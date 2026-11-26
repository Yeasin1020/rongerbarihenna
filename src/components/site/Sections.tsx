import Icon from './Icon';
import SmartImage from './SmartImage';
import { toneBg, youtubeId } from '@/lib/utils';
import type { Settings } from '@/lib/types';

type S = Settings;
const bn = (n: number) => n.toLocaleString('bn-BD');

function Heading({ title, subtitle, center }: { title?: string; subtitle?: string; center?: boolean }) {
  if (!title) return null;
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <h2 className="h-section">{title}</h2>
      {subtitle && <p className={`lead ${center ? 'mx-auto' : ''}`}>{subtitle}</p>}
    </div>
  );
}

export function AnnouncementBar({ text, link }: { text?: string; link?: string }) {
  if (!text) return null;
  const cls = 'block bg-haldi px-4 py-2 text-center text-[13px] font-medium text-ink md:text-sm';
  return link ? (
    <a href={link} className={`${cls} underline-offset-4 hover:underline`}>
      {text}
    </a>
  ) : (
    <div className={cls}>{text}</div>
  );
}

export function Features({ data = {}, tone }: { data?: S; tone?: string }) {
  const items: S[] = data.items || [];
  if (!items.length) return null;
  return (
    <section className={`py-14 md:py-20 ${toneBg(tone, 'white')}`}>
      <div className="container">
        <Heading title={data.title} subtitle={data.subtitle} />
        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-leaf/15 bg-leaf/15 lg:grid-cols-4">
          {items.map((f, i) => (
            <div key={i} className="bg-white p-5 md:p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mist text-leaf">
                <Icon name={f.icon} />
              </span>
              <h3 className="mt-4 text-[1.1rem] font-semibold text-ink">{f.title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink/65">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowToUse({ data = {}, tone }: { data?: S; tone?: string }) {
  const steps: S[] = data.steps || [];
  if (!steps.length) return null;
  return (
    <section id="how" className={`scroll-mt-20 py-14 md:py-20 ${toneBg(tone, 'mist')}`}>
      <div className="container">
        <Heading title={data.title} />
        <ol className="relative mt-10 grid gap-8 md:grid-cols-4 md:gap-6">
          <span className="absolute left-[19px] top-2 h-[calc(100%-1rem)] w-px bg-leaf/25 md:left-0 md:top-[19px] md:h-px md:w-full" aria-hidden />
          {steps.map((s, i) => (
            <li key={i} className="relative flex gap-5 md:block">
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-leaf font-display text-lg text-white ring-[6px] ring-white/0">
                {bn(i + 1)}
              </span>
              <div className="md:mt-5">
                <h3 className="text-[1.1rem] font-semibold">{s.title}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-ink/65">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Video({ data = {}, tone }: { data?: S; tone?: string }) {
  const id = youtubeId(data.youtubeUrl);
  if (!id) return null;
  return (
    <section className={`py-14 md:py-20 ${toneBg(tone, 'white')}`}>
      <div className="container max-w-4xl">
        <Heading title={data.title} center />
        <div className="mt-8 aspect-video overflow-hidden rounded-2xl bg-ink">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}`}
            title={data.title || 'Video'}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

export function Gallery({ data = {}, tone }: { data?: S; tone?: string }) {
  const images: string[] = (data.images || []).filter(Boolean);
  if (!images.length) return null;
  return (
    <section className={`py-14 md:py-20 ${toneBg(tone, 'white')}`}>
      <div className="container">
        <Heading title={data.title} />
        <div className="no-scrollbar -mx-5 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-4 md:px-0">
          {images.map((src, i) => (
            <SmartImage
              key={i}
              src={src}
              alt={`${data.title || 'Gallery'} ${i + 1}`}
              sizes="(max-width: 768px) 70vw, 25vw"
              className={`aspect-[3/4] w-[70vw] shrink-0 snap-start rounded-2xl md:w-auto ${i % 3 === 1 ? 'md:translate-y-6' : ''}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials({ data = {}, tone }: { data?: S; tone?: string }) {
  const items: S[] = data.items || [];
  if (!items.length) return null;
  return (
    <section className={`overflow-hidden py-14 md:py-20 ${toneBg(tone, 'white')}`}>
      <div className="container">
        <Heading title={data.title} />
        <div className="no-scrollbar -mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:px-0">
          {items.map((t, i) => (
            <figure key={i} className={`flex w-[82vw] max-w-[360px] shrink-0 snap-start flex-col rounded-2xl p-6 md:w-auto md:max-w-none ${tone === 'mist' ? 'bg-white' : 'bg-mist'}`}>
              <div className="flex gap-0.5 text-haldi" aria-label={`${t.rating || 5} তারা`}>
                {Array.from({ length: Math.min(5, Number(t.rating) || 5) }).map((_, j) => (
                  <svg key={j} viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                    <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z" />
                  </svg>
                ))}
              </div>
              <blockquote className="mt-4 flex-1 font-display text-[1.15rem] leading-[1.7] text-ink">{t.text}</blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-leaf/15 pt-4">
                {t.image ? (
                  <SmartImage src={t.image} alt={t.name} sizes="44px" className="h-11 w-11 rounded-full" />
                ) : (
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-leaf font-display text-lg text-white">{String(t.name || '?').charAt(0)}</span>
                )}
                <div>
                  <div className="font-semibold">{t.name}</div>
                  {t.location && <div className="text-sm text-ink/55">{t.location}</div>}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Faq({ data = {}, phone, callText, tone }: { data?: S; phone?: string; callText?: string; tone?: string }) {
  const items: S[] = data.items || [];
  if (!items.length) return null;
  return (
    <section id="faq" className={`scroll-mt-20 py-14 md:py-20 ${toneBg(tone, 'white')}`}>
      <div className="container grid gap-8 md:grid-cols-[1fr_1.6fr] md:gap-16">
        <div>
          <h2 className="h-section">{data.title}</h2>
          {phone && callText && (
            <p className="lead">
              {callText}{' '}
              <a href={`tel:${phone}`} className="font-semibold text-leaf underline decoration-haldi decoration-2 underline-offset-4">
                {phone}
              </a>
            </p>
          )}
        </div>
        <div className="border-t border-leaf/15">
          {items.map((f, i) => (
            <details key={i} className="group border-b border-leaf/15">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[1.05rem] font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-leaf/25 text-leaf transition group-open:rotate-45 group-open:bg-leaf group-open:text-white">
                  <Icon name="plus" className="h-4 w-4" />
                </span>
              </summary>
              <p className="-mt-1 max-w-prose whitespace-pre-line pb-5 leading-[1.8] text-ink/70">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
