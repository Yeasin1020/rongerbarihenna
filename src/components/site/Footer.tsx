import Image from 'next/image';
import Leaves from './Leaves';
import type { Settings } from '@/lib/types';

export default function Footer({ settings }: { settings: Settings }) {
  const c = settings.contact || {};
  const socials = [
    { href: c.facebook, label: 'Facebook' },
    { href: c.instagram, label: 'Instagram' },
    { href: c.youtube, label: 'YouTube' },
    { href: c.tiktok, label: 'TikTok' },
  ].filter((s) => s.href);
  const real = (v?: string) => v && !/X/.test(v);
  const t = settings.texts || {};
  const links: { label: string; url: string }[] = (settings.footer?.links || []).filter((l: { label: string; url: string }) => l.label && l.url);

  return (
    <footer className="relative overflow-hidden bg-leaf pb-28 text-white md:pb-0">
      <Leaves className="pointer-events-none absolute -right-10 -top-6 h-72 w-72 text-haldi/[0.12]" />
      <div className="container relative grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            {settings.logo && <Image src={settings.logo} alt="" width={128} height={128} className="h-16 w-16 object-contain" />}
            <p className="font-display text-2xl text-haldi">{settings.siteName}</p>
          </div>
          {settings.footer?.text && <p className="mt-3 max-w-sm leading-relaxed text-white/70">{settings.footer.text}</p>}
          {links.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/70">
              {links.map((l) => (
                <li key={l.url + l.label}>
                  <a href={l.url} className="underline-offset-4 hover:text-white hover:underline">{l.label}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="space-y-2 text-white/80">
          <p className="mb-3 font-semibold text-haldi">{t.footerContact}</p>
          {real(c.phone) && <a className="block hover:text-white" href={`tel:${c.phone}`}>{c.phone}</a>}
          {c.email && <a className="block hover:text-white" href={`mailto:${c.email}`}>{c.email}</a>}
          {c.address && <p>{c.address}</p>}
        </div>
        {socials.length > 0 && (
          <div>
            <p className="mb-3 font-semibold text-haldi">{t.footerSocial}</p>
            <div className="flex flex-wrap gap-2">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/85 transition hover:bg-white hover:text-leaf">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="container relative border-t border-white/10 py-5 text-sm text-white/55">{settings.footer?.copyright || `© ${settings.siteName}`}</div>
    </footer>
  );
}
