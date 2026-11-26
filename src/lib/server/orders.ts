import 'server-only';
import { OrderStatus, Prisma } from '@prisma/client';
import { db } from './db';
import { HttpError } from './http';
import { getAllSettings } from './settings';
import { normalizeBdPhone } from './helpers';
import { calcDelivery, effectivePrice } from '../utils';
import { sendPurchaseEvent } from './capi';
import type { OrderInput } from './validation';

const INACTIVE: OrderStatus[] = [OrderStatus.CANCELLED, OrderStatus.RETURNED];
const dhakaDate = (d: Date) => d.toLocaleDateString('en-CA', { timeZone: 'Asia/Dhaka' });

async function generateOrderNo() {
  const ymd = dhakaDate(new Date()).replace(/-/g, '').slice(2);
  for (let i = 0; i < 10; i++) {
    const no = `RB${ymd}${Math.floor(1000 + Math.random() * 9000)}`;
    if (!(await db.order.findUnique({ where: { orderNo: no } }))) return no;
  }
  return `RB${ymd}${Date.now().toString().slice(-6)}`;
}

type LineLike = { productId: number | null; comboId: number | null; quantity: number };

/** Product ID -> koto piece lagbe (combo er vitorer product shoho) */
async function stockNeeds(items: LineLike[], tx: Prisma.TransactionClient | typeof db = db) {
  const needs = new Map<number, number>();
  const comboIds = items.filter((i) => i.comboId).map((i) => i.comboId as number);
  const combos = comboIds.length ? await tx.combo.findMany({ where: { id: { in: comboIds } }, include: { items: true } }) : [];
  for (const it of items) {
    if (it.productId) needs.set(it.productId, (needs.get(it.productId) || 0) + it.quantity);
    if (it.comboId) {
      combos
        .find((c) => c.id === it.comboId)
        ?.items.forEach((ci) => needs.set(ci.productId, (needs.get(ci.productId) || 0) + ci.quantity * it.quantity));
    }
  }
  return needs;
}

export async function createOrder(input: OrderInput, ctx: { ip?: string; ua?: string }) {
  const s = await getAllSettings();

  const merged = new Map<string, { type: 'product' | 'combo'; id: number; quantity: number }>();
  for (const it of input.items) {
    const key = `${it.type}:${it.id}`;
    merged.set(key, { ...it, quantity: (merged.get(key)?.quantity || 0) + it.quantity });
  }
  const items = [...merged.values()];
  const productIds = items.filter((i) => i.type === 'product').map((i) => i.id);
  const comboIds = items.filter((i) => i.type === 'combo').map((i) => i.id);

  const [products, combos] = await Promise.all([
    productIds.length ? db.product.findMany({ where: { id: { in: productIds }, isActive: true } }) : Promise.resolve([]),
    comboIds.length ? db.combo.findMany({ where: { id: { in: comboIds }, isActive: true } }) : Promise.resolve([]),
  ]);

  const lines = items.map((it) => {
    if (it.type === 'product') {
      const p = products.find((x) => x.id === it.id);
      if (!p) throw new HttpError(400, 'একটি পণ্য এখন পাওয়া যাচ্ছে না, পেজটি রিফ্রেশ করুন');
      const price = effectivePrice(p);
      return { productId: p.id, comboId: null, name: p.name, image: p.images?.[0] || null, price, quantity: it.quantity, total: price * it.quantity, free: p.freeDelivery };
    }
    const c = combos.find((x) => x.id === it.id);
    if (!c) throw new HttpError(400, 'একটি কম্বো এখন পাওয়া যাচ্ছে না, পেজটি রিফ্রেশ করুন');
    return { productId: null, comboId: c.id, name: c.name, image: c.image || null, price: c.price, quantity: it.quantity, total: c.price * it.quantity, free: c.freeDelivery };
  });

  const subtotal = lines.reduce((sum, l) => sum + l.total, 0);
  const count = lines.reduce((sum, l) => sum + l.quantity, 0);
  const deliveryCharge = calcDelivery(s.delivery, input.area, subtotal, count, lines.some((l) => l.free)).charge;
  const total = subtotal + deliveryCharge;
  const itemsData = lines.map(({ free: _free, ...l }) => l);
  const orderNo = await generateOrderNo();
  const trackStock = s.store?.trackStock !== false;

  const order = await db.$transaction(async (tx) => {
    if (trackStock) {
      const needs = await stockNeeds(lines, tx);
      for (const [pid, qty] of needs) {
        const r = await tx.product.updateMany({ where: { id: pid, stock: { gte: qty } }, data: { stock: { decrement: qty } } });
        if (r.count === 0) {
          const p = await tx.product.findUnique({ where: { id: pid } });
          throw new HttpError(400, `দুঃখিত, "${p?.name || 'পণ্য'}" এখন পর্যাপ্ত স্টকে নেই`);
        }
      }
    }
    return tx.order.create({
      data: {
        orderNo,
        customerName: input.customerName,
        phone: normalizeBdPhone(input.phone),
        address: input.address,
        area: input.area,
        note: input.note?.trim() || null,
        subtotal,
        deliveryCharge,
        total,
        ip: ctx.ip,
        userAgent: ctx.ua?.slice(0, 500),
        sourceUrl: input.sourceUrl?.slice(0, 1000),
        items: { create: itemsData },
      },
      include: { items: true },
    });
  });

  return {
    order,
    capi: () =>
      sendPurchaseEvent(order, s.tracking, {
        ip: ctx.ip,
        ua: ctx.ua,
        eventId: input.eventId,
        fbp: input.fbp,
        fbc: input.fbc,
        sourceUrl: input.sourceUrl,
      }),
  };
}

// ---------------- Admin ----------------

export async function listOrders(q: URLSearchParams) {
  const page = Math.max(1, Number(q.get('page')) || 1);
  const limit = Math.min(200, Math.max(1, Number(q.get('limit')) || 20));
  const where: Prisma.OrderWhereInput = {};
  const status = q.get('status');
  if (status && (Object.values(OrderStatus) as string[]).includes(status)) where.status = status as OrderStatus;
  const search = q.get('search')?.trim();
  if (search) {
    where.OR = [
      { orderNo: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search } },
      { customerName: { contains: search, mode: 'insensitive' } },
    ];
  }
  const from = q.get('from');
  const to = q.get('to');
  if (from || to) {
    const range: Prisma.DateTimeFilter = {};
    if (from) range.gte = new Date(`${from}T00:00:00+06:00`);
    if (to) range.lte = new Date(`${to}T23:59:59.999+06:00`);
    where.createdAt = range;
  }
  const [data, total] = await Promise.all([
    db.order.findMany({ where, include: { items: true }, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    db.order.count({ where }),
  ]);
  return { data, total, page, limit, pages: Math.ceil(total / limit) };
}

export async function getOrder(id: number) {
  const o = await db.order.findUnique({ where: { id }, include: { items: true } });
  if (!o) throw new HttpError(404, 'Order pawa jay nai');
  const previousOrders = await db.order.count({ where: { phone: o.phone, id: { not: o.id } } });
  return { ...o, previousOrders };
}

async function adjustStock(orderId: number, direction: 'restore' | 'deduct') {
  const s = await getAllSettings();
  if (s.store?.trackStock === false) return;
  const items = await db.orderItem.findMany({ where: { orderId } });
  const needs = await stockNeeds(items);
  for (const [pid, qty] of needs) {
    await db.product.updateMany({
      where: { id: pid },
      data: { stock: direction === 'restore' ? { increment: qty } : { decrement: qty } },
    });
  }
}

export async function updateOrder(
  id: number,
  dto: { status?: OrderStatus; adminNote?: string; customerName?: string; phone?: string; address?: string; area?: string; deliveryCharge?: number; discount?: number },
) {
  const o = await db.order.findUnique({ where: { id } });
  if (!o) throw new HttpError(404, 'Order pawa jay nai');

  const data: Prisma.OrderUpdateInput = {};
  if (dto.customerName !== undefined) data.customerName = dto.customerName;
  if (dto.phone !== undefined) data.phone = normalizeBdPhone(dto.phone);
  if (dto.address !== undefined) data.address = dto.address;
  if (dto.area !== undefined) data.area = dto.area;
  if (dto.adminNote !== undefined) data.adminNote = dto.adminNote;
  if (dto.deliveryCharge !== undefined || dto.discount !== undefined) {
    const deliveryCharge = dto.deliveryCharge ?? o.deliveryCharge;
    const discount = dto.discount ?? o.discount;
    data.deliveryCharge = deliveryCharge;
    data.discount = discount;
    data.total = Math.max(0, o.subtotal + deliveryCharge - discount);
  }
  if (dto.status && dto.status !== o.status) {
    data.status = dto.status;
    const was = INACTIVE.includes(o.status);
    const now = INACTIVE.includes(dto.status);
    if (!was && now) await adjustStock(id, 'restore');
    if (was && !now) await adjustStock(id, 'deduct');
  }
  await db.order.update({ where: { id }, data });
  return getOrder(id);
}

export async function deleteOrder(id: number) {
  const o = await db.order.findUnique({ where: { id } });
  if (!o) throw new HttpError(404, 'Order pawa jay nai');
  if (!INACTIVE.includes(o.status)) await adjustStock(id, 'restore');
  await db.order.delete({ where: { id } });
}

export async function orderStats() {
  const startToday = new Date(`${dhakaDate(new Date())}T00:00:00+06:00`);
  const start7 = new Date(startToday.getTime() - 6 * 86400000);
  const start30 = new Date(startToday.getTime() - 29 * 86400000);

  const [byStatus, today, delivered, last7, month, recent, lowStock, productCount, comboCount] = await Promise.all([
    db.order.groupBy({ by: ['status'], _count: { _all: true } }),
    db.order.aggregate({ where: { createdAt: { gte: startToday } }, _count: { _all: true }, _sum: { total: true } }),
    db.order.aggregate({ where: { status: 'DELIVERED' }, _sum: { total: true }, _count: { _all: true } }),
    db.order.findMany({ where: { createdAt: { gte: start7 } }, select: { createdAt: true, total: true, status: true } }),
    db.order.aggregate({ where: { createdAt: { gte: start30 }, status: { notIn: INACTIVE } }, _count: { _all: true }, _sum: { total: true } }),
    db.order.findMany({ orderBy: { createdAt: 'desc' }, take: 6 }),
    db.product.findMany({ where: { stock: { lte: 10 } }, select: { id: true, name: true, stock: true }, orderBy: { stock: 'asc' }, take: 8 }),
    db.product.count(),
    db.combo.count(),
  ]);

  const days = Array.from({ length: 7 }, (_, i) => ({ date: dhakaDate(new Date(start7.getTime() + i * 86400000)), orders: 0, amount: 0 }));
  for (const o of last7) {
    const d = days.find((x) => x.date === dhakaDate(o.createdAt));
    if (d) {
      d.orders++;
      if (!INACTIVE.includes(o.status)) d.amount += o.total;
    }
  }

  const statusCounts: Record<string, number> = {};
  Object.values(OrderStatus).forEach((st) => (statusCounts[st] = 0));
  byStatus.forEach((b) => (statusCounts[b.status] = b._count._all));

  return {
    statusCounts,
    totalOrders: Object.values(statusCounts).reduce((a, b) => a + b, 0),
    today: { orders: today._count._all, amount: today._sum.total || 0 },
    delivered: { orders: delivered._count._all, amount: delivered._sum.total || 0 },
    last30: { orders: month._count._all, amount: month._sum.total || 0 },
    days,
    recent,
    lowStock,
    productCount,
    comboCount,
  };
}
