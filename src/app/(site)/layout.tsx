import type { Metadata } from 'next';
import { getPublicSettings } from '@/lib/server/settings';
import { siteStyle, siteUrl } from '@/lib/utils';
import Tracking from '@/components/site/Tracking';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import StickyOrderBar from '@/components/site/StickyOrderBar';
import { AnnouncementBar } from '@/components/site/Sections';

export async function generateMetadata(): Promise<Metadata> {
  const s = await getPublicSettings();
  const seo = s.seo || {};
  const title = seo.title || s.siteName;
  const description = seo.description || s.tagline || '';
  const image = seo.ogImage || s.hero?.image;
  return {
    metadataBase: new URL(siteUrl(s)),
    title: { default: title, template: `%s | ${s.siteName}` },
    description,
    keywords: seo.keywords ? String(seo.keywords).split(',').map((k) => k.trim()).filter(Boolean) : undefined,
    applicationName: s.siteName,
    openGraph: { type: 'website', siteName: s.siteName, title, description, locale: 'bn_BD', images: image ? [{ url: image }] : undefined },
    twitter: { card: 'summary_large_image', title, description },
    icons: s.favicon ? { icon: s.favicon, apple: s.favicon } : undefined,
    verification: seo.googleVerification ? { google: seo.googleVerification } : undefined,
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = await getPublicSettings();
  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: s.siteName,
    url: siteUrl(s),
    logo: s.logo ? new URL(s.logo, siteUrl(s)).toString() : undefined,
    telephone: s.contact?.phone || undefined,
    sameAs: [s.contact?.facebook, s.contact?.instagram, s.contact?.youtube, s.contact?.tiktok].filter(Boolean),
  };

  return (
    <div style={siteStyle(s.theme, s.design)} className="min-h-screen bg-white font-sans text-ink">
      <Tracking tracking={s.tracking} />
      {s.announcement?.enabled && <AnnouncementBar text={s.announcement?.text} link={s.announcement?.link} />}
      <Header settings={s} />
      <main>{children}</main>
      <Footer settings={s} />
      {s.design?.showStickyBar !== false && (
        <StickyOrderBar
          currency={s.store?.currency || '৳'}
          whatsapp={s.design?.showWhatsApp !== false ? s.contact?.whatsapp : undefined}
          texts={s.texts}
        />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
    </div>
  );
}
