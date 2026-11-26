/**
 * Demo product + combo add kore. Chalao:  npm run seed
 * (Pore admin panel theke edit/delete korte parbe)
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.product.count();
  if (count > 0) {
    console.log('Product already ache, seed skip kora holo.');
    return;
  }

  const p1 = await prisma.product.create({
    data: {
      name: 'অর্গানিক মেহেদি কোন',
      slug: 'organic-mehedi-cone',
      shortDesc: '১০০% প্রাকৃতিক, কেমিক্যাল মুক্ত, গাঢ় রং',
      description:
        'আমাদের অর্গানিক মেহেদি কোন তৈরি হয় বাছাই করা মেহেদি পাতা, ইউক্যালিপটাস অয়েল ও লেবুর রস দিয়ে।\nকোনো কেমিক্যাল বা PPD নেই, তাই ত্বকের জন্য নিরাপদ।\nলাগানোর ৬-৮ ঘণ্টা পর গাঢ় মেরুন রং আসে।',
      price: 80,
      salePrice: 60,
      stock: 500,
      images: [],
      isFeatured: true,
      sortOrder: 1,
    },
  });

  const p2 = await prisma.product.create({
    data: {
      name: 'নেইল মেহেদি কোন',
      slug: 'nail-mehedi-cone',
      shortDesc: 'নখে লাগানোর জন্য স্পেশাল ফর্মুলা',
      description: 'নখের জন্য বিশেষভাবে তৈরি, দ্রুত রং আসে এবং অনেকদিন থাকে।',
      price: 70,
      salePrice: 50,
      stock: 300,
      images: [],
      sortOrder: 2,
    },
  });

  const p3 = await prisma.product.create({
    data: {
      name: 'হেয়ার মেহেদি পাউডার (২০০ গ্রাম)',
      slug: 'hair-mehedi-powder',
      shortDesc: 'চুলের প্রাকৃতিক কন্ডিশনার ও কালার',
      description: 'খাঁটি মেহেদি পাতার গুঁড়া। চুল নরম, ঝলমলে ও খুশকিমুক্ত রাখে।',
      price: 250,
      salePrice: 199,
      stock: 200,
      images: [],
      sortOrder: 3,
    },
  });

  await prisma.combo.create({
    data: {
      name: '১২ পিস মেহেদি কোন কম্বো',
      slug: 'combo-12-cone',
      description: '১০টি অর্গানিক কোন + ২টি নেইল কোন — ঈদ/বিয়ের জন্য পারফেক্ট',
      price: 550,
      regularPrice: 940,
      sortOrder: 1,
      items: {
        create: [
          { productId: p1.id, quantity: 10 },
          { productId: p2.id, quantity: 2 },
        ],
      },
    },
  });

  await prisma.combo.create({
    data: {
      name: 'ফ্যামিলি কম্বো',
      slug: 'family-combo',
      description: '৬টি অর্গানিক কোন + ১টি হেয়ার মেহেদি পাউডার',
      price: 520,
      regularPrice: 730,
      sortOrder: 2,
      items: {
        create: [
          { productId: p1.id, quantity: 6 },
          { productId: p3.id, quantity: 1 },
        ],
      },
    },
  });

  console.log('✅ Demo product ar combo add hoye geche!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
