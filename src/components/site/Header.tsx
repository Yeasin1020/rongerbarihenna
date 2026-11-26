import Link from 'next/link';
import Image from 'next/image';
import Icon from './Icon';
import type { Settings } from '@/lib/types';

export default function Header({ settings }: { settings: Settings }) {
  const enabled = new Set((settings.sections || []).filter((s: { enabled: boolean }) => s.enabled).map((s: { key: string }) => s.key));
  const t = settings.texts || {};
  const d = settings.design || {};
  const nav = [
    { key: 'combos', href: '/#combos', label: t.navCombos },
    { key: 'products', href: '/#products', label: t.navProducts },
    { key: 'howToUse', href: '/#how', label: t.navHow },
    { key: 'faq', href: '/#faq', label: t.navFaq },
  ].filter((n) => enabled.has(n.key) && n.label && d.showHeaderNav !== false);
  const phone = d.showHeaderPhone !== false && settings.contact?.phone && !/X/.test(settings.contact.phone) ? settings.contact.phone : '';

  return (
    <header className="sticky top-0 z-40 border-b border-leaf/10 bg-white/95 backdrop-blur-md">
      <div className="container flex h-[64px] items-center justify-between gap-4 md:h-[78px]">
        <Link href="/" className="flex shrink-0 items-center" aria-label={settings.siteName}>
          {settings.logo && (
            <Image src={settings.logo} alt="" width={96} height={96} className="h-11 w-11 object-contain md:h-[52px] md:w-[52px]" priority />
          )}
          {d.showSiteNameWithLogo !== false || !settings.logo ? (
            <span className="ml-2.5 leading-none">
              <span className="block font-display text-[1.2rem] text-leaf md:text-[1.4rem]">{settings.siteName}</span>
              {settings.tagline && <span className="mt-1 hidden text-[11.5px] text-ink/50 sm:block">{settings.tagline}</span>}
            </span>
          ) : null}
        </Link>

        <nav className="hidden items-center gap-8 text-[15px] lg:flex">
          {nav.map((n) => (
            <a key={n.key} href={n.href} className="text-ink/70 transition hover:text-leaf">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {phone && (
            <a href={`tel:${phone}`} aria-label="কল করুন" className="flex h-10 w-10 items-center justify-center rounded-full border border-leaf/20 text-leaf md:w-auto md:gap-2 md:px-4">
              <Icon name="phone" className="h-[18px] w-[18px]" />
              <span className="hidden text-sm font-medium md:inline">{phone}</span>
            </a>
          )}
          <a href="/#order" className="hidden h-10 items-center rounded-full bg-leaf px-5 text-sm font-semibold text-white transition hover:bg-leaf/90 sm:inline-flex">
            {t.headerCta || 'অর্ডার করুন'}
          </a>
        </div>
      </div>
    </header>
  );
}
