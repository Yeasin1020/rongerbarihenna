import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublicSettings } from '@/lib/server/settings';
import { getProduct, getProducts } from '@/lib/server/catalog';
import { effectivePrice, formatPrice, siteUrl } from '@/lib/utils';
import ProductGallery from '@/components/site/ProductGallery';
import ViewContent from '@/components/site/ViewContent';
import Icon from '@/components/site/Icon';

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct(decodeURIComponent((await params).slug));
  if (!p) return { title: 'পণ্য পাওয়া যায়নি' };
  const description = p.metaDesc || p.shortDesc || p.description?.slice(0, 160) || '';
  return {
    title: p.metaTitle || p.name,
    description,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: { title: p.metaTitle || p.name, description, images: p.images?.length ? p.images.slice(0, 3) : undefined },
  };
}

export default async function ProductPage({ params }: Props) {
  const slug = decodeURIComponent((await params).slug);
  const [p, s] = await Promise.all([getProduct(slug), getPublicSettings()]);
  if (!p) notFound();
  const currency = s.store?.currency || '৳';
  const price = effectivePrice(p);
  const base = siteUrl(s);
  const inStock = p.stock > 0 || s.store?.trackStock === false;
  const t = s.texts;

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    image: p.images.map((u) => new URL(u, base).toString()),
    sku: p.sku || String(p.id),
    description: p.description || p.shortDesc || '',
    brand: { '@type': 'Brand', name: s.siteName },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BDT',
      price,
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${base}/products/${encodeURIComponent(p.slug)}`,
    },
  };

  return (
    <section className="bg-white pb-16 pt-6 md:pt-10">
      <ViewContent id={String(p.id)} name={p.name} price={price} />
      <div className="container">
        <nav className="mb-6 flex flex-wrap gap-1.5 text-sm text-ink/50">
          <Link href="/" className="hover:text-leaf">হোম</Link>
          <span>/</span>
          <Link href="/#products" className="hover:text-leaf">প্রোডাক্ট</Link>
        </nav>
        <div className="grid gap-8 md:grid-cols-2 md:gap-14">
          <ProductGallery images={p.images || []} name={p.name} />
          <div className="md:pt-4">
            <h1 className="h-display text-[2rem] md:text-[2.8rem]">{p.name}</h1>
            {p.shortDesc && <p className="mt-3 text-[1.08rem] leading-relaxed text-ink/65">{p.shortDesc}</p>}
            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-[2.4rem] leading-none text-stain">{formatPrice(price, currency)}</span>
              {price < p.price && <span className="text-lg text-ink/40 line-through">{formatPrice(p.price, currency)}</span>}
            </div>
            {!inStock && <p className="mt-3 font-semibold text-stain">{t.outOfStock}</p>}
            <a href={`/?add=p:${p.id}#order`} className="btn-haldi mt-7 w-full sm:w-auto sm:min-w-[16rem]">
              <Icon name="bag" className="h-5 w-5" /> {t.productOrderButton}
            </a>
            <ul className="mt-7 space-y-3 border-t border-leaf/15 pt-6 text-[15px] text-ink/75">
              <li className="flex items-center gap-3"><Icon name="shield" className="h-5 w-5 text-leaf" /> {t.productTrust1}</li>
              <li className="flex items-center gap-3"><Icon name="truck" className="h-5 w-5 text-leaf" /> {t.productTrust2}</li>
              {s.contact?.phone && !/X/.test(s.contact.phone) && (
                <li className="flex items-center gap-3">
                  <Icon name="phone" className="h-5 w-5 text-leaf" /> {t.productCall}{' '}
                  <a className="font-semibold text-leaf" href={`tel:${s.contact.phone}`}>{s.contact.phone}</a>
                </li>
              )}
            </ul>
            {p.description && (
              <div className="mt-8">
                <h2 className="font-display text-[1.5rem] text-leaf">{t.productDetails}</h2>
                <div className="mt-3 max-w-prose whitespace-pre-line leading-[1.85] text-ink/75">{p.description}</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </section>
  );
}
