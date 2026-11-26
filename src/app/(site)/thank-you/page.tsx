import type { Metadata } from 'next';
import { getPublicSettings } from '@/lib/server/settings';
import PurchaseTracker from '@/components/site/PurchaseTracker';
import Image from 'next/image';
import Leaves from '@/components/site/Leaves';

export const metadata: Metadata = { title: 'অর্ডার সম্পন্ন', robots: { index: false, follow: false } };

export default async function ThankYou({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const [{ order }, s] = await Promise.all([searchParams, getPublicSettings()]);
  const t = s.orderSection || {};
  const phone = s.contact?.phone && !/X/.test(s.contact.phone) ? s.contact.phone : '';
  const tx = s.texts;
  return (
    <section className="bg-mist py-14 md:py-20">
      <div className="container max-w-xl text-center">
        <div className="relative mx-auto h-32 w-32">
          <Leaves animate className="absolute -right-10 -top-8 h-20 w-20 text-haldi" />
          {s.logo ? <Image src={s.logo} alt={s.siteName} fill sizes="128px" className="object-contain" /> : <Leaves className="h-full w-full text-leaf" />}
        </div>
        <h1 className="h-display mt-6 text-[1.9rem] md:text-[2.4rem]">{t.successTitle || 'ধন্যবাদ! অর্ডারটি নেওয়া হয়েছে'}</h1>
        {order && (
          <p className="mt-4 text-[1.05rem] text-ink/70">
            {tx.thanksOrderNo} <span className="rounded-md bg-white px-2 py-1 font-semibold tracking-wide text-leaf">{order}</span>
          </p>
        )}
        {t.successMessage && <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink/70">{t.successMessage}</p>}
        <PurchaseTracker currency={s.store?.currency || '৳'} payLabel={tx.thanksPay} deliveryLabel={tx.summaryDelivery} />
        {phone && (
          <p className="mt-6 text-[15px] text-ink/65">
            {tx.thanksCall} <a href={`tel:${phone}`} className="font-semibold text-leaf">{phone}</a>
          </p>
        )}
        <a href="/" className="btn-ghost mt-8">{tx.thanksHome}</a>
      </div>
    </section>
  );
}
