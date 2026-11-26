import Link from 'next/link';
import SmartImage from './SmartImage';
import AddToOrderButton from './AddToOrderButton';
import { effectivePrice, fill, formatPrice, toneBg } from '@/lib/utils';
import type { Combo, Product, Settings } from '@/lib/types';

type Common = { data?: Settings; currency: string; texts?: Settings; tone?: string };

export function CombosSection({ data = {}, combos, currency, texts = {}, tone }: Common & { combos: Combo[] }) {
  if (!combos.length) return null;
  return (
    <section id="combos" className={`scroll-mt-20 py-14 md:py-20 ${toneBg(tone, 'white')}`}>
      <div className="container">
        <div className="max-w-2xl">
          <h2 className="h-section">{data.title}</h2>
          {data.subtitle && <p className="lead">{data.subtitle}</p>}
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {combos.map((c, idx) => {
            const save = c.regularPrice && c.regularPrice > c.price ? c.regularPrice - c.price : 0;
            const featured = idx === 0;
            return (
              <article
                key={c.id}
                className={`grid grid-cols-[112px_1fr] gap-4 rounded-2xl p-3 sm:grid-cols-[180px_1fr] sm:gap-6 sm:p-4 ${featured ? 'bg-leaf text-white' : 'border border-leaf/15 bg-white'}`}
              >
                <SmartImage
                  src={c.image || c.items?.[0]?.product?.images?.[0]}
                  alt={c.name}
                  sizes="180px"
                  className="aspect-square self-start rounded-xl"
                />
                <div className="flex min-w-0 flex-col py-1 pr-1">
                  {(save > 0 || (c.freeDelivery && texts.freeBadge)) && (
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      {save > 0 && (
                        <span className={`rounded-md px-2 py-0.5 text-[13px] font-semibold ${featured ? 'bg-haldi text-ink' : 'bg-stain/10 text-stain'}`}>
                          {fill(texts.comboSave || '{amount}', { amount: formatPrice(save, currency) })}
                        </span>
                      )}
                      {c.freeDelivery && texts.freeBadge && (
                        <span className={`rounded-md px-2 py-0.5 text-[13px] font-semibold ${featured ? 'border border-haldi/50 text-haldi' : 'bg-leaf text-haldi'}`}>{texts.freeBadge}</span>
                      )}
                    </div>
                  )}
                  <h3 className="font-display text-[1.3rem] leading-snug sm:text-[1.5rem]">{c.name}</h3>
                  {c.items?.length > 0 && (
                    <p className={`mt-1.5 text-[14px] leading-relaxed ${featured ? 'text-white/75' : 'text-ink/60'}`}>
                      {c.items.map((it) => `${it.product?.name} ${it.quantity.toLocaleString('bn-BD')}টি`).join(' + ')}
                    </p>
                  )}
                  <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
                    <div className="leading-none">
                      <span className={`font-display text-[1.8rem] ${featured ? 'text-haldi' : 'text-stain'}`}>{formatPrice(c.price, currency)}</span>
                      {save > 0 && (
                        <span className={`ml-2 text-sm line-through ${featured ? 'text-white/50' : 'text-ink/40'}`}>{formatPrice(c.regularPrice || 0, currency)}</span>
                      )}
                    </div>
                    <AddToOrderButton
                      type="c"
                      id={c.id}
                      label={texts.comboButton || 'নিন'}
                      className={`h-10 rounded-full px-6 text-[15px] font-semibold transition active:translate-y-px ${featured ? 'bg-haldi text-ink' : 'bg-leaf text-white'}`}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ProductsSection({
  data = {},
  products,
  currency,
  texts = {},
  tone,
  showButton = true,
}: Common & { products: Product[]; showButton?: boolean }) {
  if (!products.length) return null;
  return (
    <section id="products" className={`scroll-mt-20 py-14 md:py-20 ${toneBg(tone, 'mist')}`}>
      <div className="container">
        <div className="max-w-2xl">
          <h2 className="h-section">{data.title}</h2>
          {data.subtitle && <p className="lead">{data.subtitle}</p>}
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          {products.map((p) => {
            const price = effectivePrice(p);
            return (
              <article key={p.id} className="group flex flex-col">
                <Link href={`/products/${p.slug}`} className="relative block overflow-hidden rounded-2xl">
                  <SmartImage src={p.images?.[0]} alt={p.name} sizes="(max-width: 768px) 50vw, 25vw" className="aspect-[4/5] transition duration-500 group-hover:scale-[1.03]" />
                  {p.freeDelivery && texts.freeBadge && (
                    <span className="absolute left-2 top-2 rounded-md bg-leaf px-2 py-1 text-[11.5px] font-semibold text-haldi shadow">{texts.freeBadge}</span>
                  )}
                </Link>
                <Link href={`/products/${p.slug}`} className="mt-3">
                  <h3 className="line-clamp-2 text-[1rem] font-semibold leading-snug text-ink md:text-[1.08rem]">{p.name}</h3>
                </Link>
                {p.shortDesc && <p className="mt-1 line-clamp-1 text-[13px] text-ink/55 md:text-sm">{p.shortDesc}</p>}
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-[1.35rem] text-stain">{formatPrice(price, currency)}</span>
                  {price < p.price && <span className="text-sm text-ink/40 line-through">{formatPrice(p.price, currency)}</span>}
                </div>
                {showButton && (
                  <AddToOrderButton
                    type="p"
                    id={p.id}
                    label={texts.productButton || 'অর্ডারে যোগ করুন'}
                    className="mt-3 h-11 rounded-xl border border-leaf/25 bg-white text-[14px] font-semibold text-leaf transition hover:bg-leaf hover:text-white active:translate-y-px"
                  />
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
