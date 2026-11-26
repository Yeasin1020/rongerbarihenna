import Image from 'next/image';
import Icon from './Icon';
import Leaves from './Leaves';
import { formatPrice, toneBg } from '@/lib/utils';
import type { Settings } from '@/lib/types';

/**
 * Hero: navy er upor sonali — logo ar kon er label er moto.
 * Dan pashe jharokha (arch) frame e chobi, pashe sonali patar dal haate akar moto fute othe.
 */
export default function Hero({
  hero = {},
  fromPrice,
  currency,
  texts = {},
  design = {},
  tone,
}: {
  hero?: Settings;
  fromPrice?: number;
  currency: string;
  texts?: Settings;
  design?: Settings;
  tone?: string;
}) {
  const dark = (tone || 'leaf') === 'leaf';
  const [beforePrice, afterPrice] = String(texts.heroFromPrice || '{price}').split('{price}');
  const highlights: string[] = (hero.highlights || []).filter(Boolean);
  const showArt = design.heroMehndiArt !== false;

  return (
    <section className={`relative overflow-hidden ${toneBg(tone, 'leaf')} ${dark ? 'text-white' : 'text-ink'}`}>
      {dark && (
        <>
          <div className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-haldi/[0.09] blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-haldi/40 to-transparent" />
        </>
      )}

      <div className="container relative grid items-center gap-12 pb-16 pt-10 md:grid-cols-[1.12fr_1fr] md:gap-16 md:pb-24 md:pt-20">
        <div className="animate-rise">
          {hero.badge && (
            <p className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13.5px] ${dark ? 'border border-haldi/35 text-haldi' : 'bg-white text-leaf'}`}>
              <Icon name="leaf" className="h-4 w-4" />
              {hero.badge}
            </p>
          )}
          <h1 className={`h-display mt-6 text-[2.55rem] sm:text-[3.2rem] lg:text-[4.25rem] ${dark ? 'text-white' : 'text-ink'}`}>{hero.title}</h1>
          {hero.subtitle && <p className={`mt-5 max-w-[34rem] text-[1.08rem] leading-[1.85] ${dark ? 'text-white/70' : 'text-ink/70'}`}>{hero.subtitle}</p>}

          {fromPrice && design.heroShowPrice !== false && texts.heroFromPrice ? (
            <p className={`mt-7 flex items-baseline gap-2 ${dark ? 'text-white/60' : 'text-ink/60'}`}>
              {beforePrice}
              <span className={`font-display text-[2.1rem] leading-none ${dark ? 'text-haldi' : 'text-stain'}`}>{formatPrice(fromPrice, currency)}</span>
              {afterPrice}
            </p>
          ) : null}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {hero.ctaText && (
              <a href={hero.ctaLink || '#order'} className="btn-haldi sm:min-w-[13rem]">
                <Icon name="bag" className="h-5 w-5" />
                {hero.ctaText}
              </a>
            )}
            {hero.secondaryCtaText && (
              <a
                href={hero.secondaryCtaLink || '#combos'}
                className={dark ? 'btn border border-white/25 text-white hover:border-haldi hover:text-haldi' : 'btn-ghost'}
              >
                {hero.secondaryCtaText}
              </a>
            )}
          </div>

          {highlights.length > 0 && (
            <ul className={`mt-9 grid gap-3 border-t pt-6 text-[15px] sm:grid-cols-3 sm:gap-4 ${dark ? 'border-white/10 text-white/80' : 'border-ink/10 text-ink/75'}`}>
              {highlights.map((h) => (
                <li key={h} className="flex items-center gap-2.5">
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${dark ? 'bg-haldi text-ink' : 'bg-leaf text-white'}`}>
                    <Icon name="check" className="h-3 w-3" strokeWidth={2.6} />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative mx-auto w-full max-w-[430px]">
          {showArt && (
            <>
              <Leaves animate className="absolute -right-10 -top-12 z-10 h-40 w-40 text-haldi md:-right-16 md:h-52 md:w-52" />
              <Leaves animate className="absolute -bottom-10 -left-12 z-10 h-32 w-32 rotate-180 text-haldi/80 md:-left-16 md:h-40 md:w-40" />
            </>
          )}
          <div className={`relative rounded-t-[999px] border p-3 ${dark ? 'border-haldi/50' : 'border-leaf/30'}`}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] bg-white/5">
              {hero.image ? (
                <Image src={hero.image} alt={hero.title || 'মেহেদি'} fill priority sizes="(max-width: 768px) 90vw, 430px" className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center p-14 text-haldi/60">
                  <Leaves className="h-full w-full" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
