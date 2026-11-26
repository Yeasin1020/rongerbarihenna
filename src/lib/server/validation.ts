import { z } from 'zod';

const int = (min = 0) => z.coerce.number().int().min(min);
// undefined = change korbo na, faka = null
const optStr = (max = 5000) =>
  z.string().max(max).optional().nullable().transform((v) => (v === undefined ? undefined : v || null));
const optPrice = () =>
  z.coerce.number().int().min(0).optional().nullable().transform((v) => (v === undefined ? undefined : v || null));

export const orderSchema = z.object({
  customerName: z.string().trim().min(2, 'নাম লিখুন').max(100),
  phone: z
    .string()
    .transform((v) => v.replace(/[\s-]/g, ''))
    .refine((v) => /^(\+?88)?01[3-9]\d{8}$/.test(v), 'সঠিক মোবাইল নাম্বার দিন (01XXXXXXXXX)'),
  address: z.string().trim().min(5, 'সম্পূর্ণ ঠিকানা লিখুন').max(500),
  area: z.enum(['inside', 'outside']),
  note: z.string().max(500).optional(),
  items: z
    .array(z.object({ type: z.enum(['product', 'combo']), id: int(1), quantity: int(1).max(100) }))
    .min(1, 'অন্তত একটি পণ্য বাছাই করুন')
    .max(50),
  eventId: z.string().max(100).optional(),
  fbp: z.string().max(200).optional(),
  fbc: z.string().max(300).optional(),
  sourceUrl: z.string().max(1000).optional(),
});
export type OrderInput = z.infer<typeof orderSchema>;

export const productSchema = z.object({
  name: z.string().trim().min(1, 'Product er naam din').max(200),
  slug: z.string().max(200).optional(),
  shortDesc: optStr(300),
  description: optStr(20000),
  price: int(0),
  salePrice: optPrice(),
  stock: int(-100000).default(0),
  sku: optStr(100),
  images: z.array(z.string().max(1000)).default([]),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  freeDelivery: z.boolean().optional(),
  sortOrder: z.coerce.number().int().default(0),
  metaTitle: optStr(200),
  metaDesc: optStr(500),
});

export const comboSchema = z.object({
  name: z.string().trim().min(1, 'Combo er naam din').max(200),
  slug: z.string().max(200).optional(),
  description: optStr(5000),
  image: optStr(1000),
  price: int(0),
  regularPrice: optPrice(),
  isActive: z.boolean().default(true),
  freeDelivery: z.boolean().optional(),
  sortOrder: z.coerce.number().int().default(0),
  items: z.array(z.object({ productId: int(1), quantity: int(1) })).min(1, 'Kompokkhe ekta product add korun'),
});

export const STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'] as const;

export const orderUpdateSchema = z.object({
  status: z.enum(STATUSES).optional(),
  adminNote: z.string().max(2000).optional(),
  customerName: z.string().trim().min(1).max(100).optional(),
  phone: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
  area: z.enum(['inside', 'outside']).optional(),
  deliveryCharge: int(0).optional(),
  discount: int(0).optional(),
});

export const bulkStatusSchema = z.object({
  ids: z.array(int(1)).min(1),
  status: z.enum(STATUSES),
});

export const loginSchema = z.object({
  email: z.string().email('Sothik email din'),
  password: z.string().min(1, 'Password din'),
});

export const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6, 'Notun password kompokkhe 6 character'),
});
