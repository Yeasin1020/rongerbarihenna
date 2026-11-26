import { after } from 'next/server';
import { clientIp, rateLimit, route } from '@/lib/server/http';
import { orderSchema } from '@/lib/server/validation';
import { createOrder } from '@/lib/server/orders';

// Landing page theke order (protti IP theke 1 minute e max 5 ta)
export const POST = route(async (req) => {
  const ip = clientIp(req);
  rateLimit(`order:${ip}`, 5, 60_000);
  const input = orderSchema.parse(await req.json());
  const { order, capi } = await createOrder(input, { ip, ua: req.headers.get('user-agent') || undefined });
  after(capi); // response pathanor por Facebook e event jabe — customer ke wait korte hoy na
  return Response.json({
    orderNo: order.orderNo,
    total: order.total,
    subtotal: order.subtotal,
    deliveryCharge: order.deliveryCharge,
    items: order.items.map((i) => ({
      id: i.productId ? String(i.productId) : `combo-${i.comboId}`,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
    })),
  });
});
