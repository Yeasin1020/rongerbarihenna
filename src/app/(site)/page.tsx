import type { Metadata } from 'next';
import { getPublicSettings } from '@/lib/server/settings';
import { getCombos, getProducts } from '@/lib/server/catalog';
import { effectivePrice, siteUrl } from '@/lib/utils';
import Hero from '@/components/site/Hero';
import { Faq, Features, Gallery, HowToUse, Testimonials, Video } from '@/components/site/Sections';
import { CombosSection, ProductsSection } from '@/components/site/ProductSections';
import OrderForm from '@/components/site/OrderForm';
import CustomSection from '@/components/site/CustomSection';
import GallerySection from '@/components/site/GallerySection';

// Page age theke toiri thake (super fast). Admin e save korle sathe sathe notun hoy.
export const revalidate = 3600;

export const metadata: Metadata = { alternates: { canonical: '/' } };

const DEFAULT_ORDER = ['hero', 'features', 'combos', 'products', 'howToUse', 'testimonials', 'faq', 'order'];

export default async function HomePage() {
  const [s, products, combos] = await Promise.all([getPublicSettings(), getProducts(), getCombos()]);
  const currency = s.store?.currency || '৳';
  const phone = s.contact?.phone && !/X/.test(s.contact.phone) ? s.contact.phone : undefined;
  const prices = [...products.map(effectivePrice), ...combos.map((c) => c.price)].filter((n) => n > 0);
  const fromPrice = prices.length ? Math.min(...prices) : undefined;

  const sections = s.sections?.length
    ? s.sections.filter((x) => x.enabled)
    : DEFAULT_ORDER.map((key) => ({ key, label: key, enabled: true, tone: undefined as string | undefined }));
  const t = s.texts;

  const render = ({ key, tone }: { key: string; tone?: string }) => {
    switch (key) {
      case 'hero':
        return <Hero key={key} hero={s.hero} fromPrice={fromPrice} currency={currency} texts={t} design={s.design} tone={tone} />;
      case 'features':
        return <Features key={key} data={s.features} tone={tone} />;
      case 'products':
        return (
          <ProductsSection
            key={key}
            data={s.productsSection}
            products={products}
            currency={currency}
            texts={t}
            tone={tone}
            showButton={s.design?.productButtonOnCards !== false}
          />
        );
      case 'combos':
        return <CombosSection key={key} data={s.combosSection} combos={combos} currency={currency} texts={t} tone={tone} />;
      case 'howToUse':
        return <HowToUse key={key} data={s.howToUse} tone={tone} />;
      case 'video':
        return <Video key={key} data={s.video} tone={tone} />;
      case 'gallery':
        return <Gallery key={key} data={s.gallery} tone={tone} />;
      case 'testimonials':
        return <Testimonials key={key} data={s.testimonials} tone={tone} />;
      case 'faq':
        return <Faq key={key} data={s.faq} phone={phone} callText={t?.faqCall} tone={tone} />;
      case 'order':
        return (
          <OrderForm key={key} products={products} combos={combos} delivery={s.delivery} texts={s.orderSection} t={t} currency={currency} tone={tone} />
        );
      default:
        if (key.startsWith('gallery-')) {
          const g = (s.galleries || []).find((x) => `gallery-${x.id}` === key);
          return g ? <GallerySection key={key} gallery={g} tone={tone} /> : null;
        }
        if (key.startsWith('custom-')) {
          const block = (s.customSections || []).find((b) => `custom-${b.id}` === key);
          return block ? <CustomSection key={key} block={block} tone={tone} /> : null;
        }
        return null;
    }
  };

  const base = siteUrl(s);
  const abs = (u: string) => new URL(u, base).toString();
  const ld: object[] = products.slice(0, 12).map((p) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    image: p.images?.length ? p.images.map(abs) : undefined,
    description: p.shortDesc || p.description || undefined,
    brand: { '@type': 'Brand', name: s.siteName },
    offers: { '@type': 'Offer', priceCurrency: 'BDT', price: effectivePrice(p), availability: 'https://schema.org/InStock', url: `${base}/products/${encodeURIComponent(p.slug)}` },
  }));
  if (s.faq?.items?.length) {
    ld.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: s.faq.items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    });
  }

  return (
    <>
      {sections.map(render)}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
