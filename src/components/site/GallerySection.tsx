'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import Icon from './Icon';
import { toneBg } from '@/lib/utils';

type Item = { image: string; caption?: string };
export type GalleryData = { id: string; title?: string; subtitle?: string; layout?: string; items?: Item[] };

/**
 * Admin theke banano gallery. Layout:
 *  masonry  — pinterest er moto, lomba-choto chobi mile mishe
 *  grid     — soman ghor
 *  carousel — pashe swipe (mobile e best)
 *  spotlight — ekta boro chobi, pashe baki gula
 * Chobi te chap dile boro hoye khule (lightbox), ← → ba swipe kore dekha jay.
 */
export default function GallerySection({ gallery, tone }: { gallery: GalleryData; tone?: string }) {
  const items = (gallery.items || []).filter((i) => i?.image);
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const go = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, go]);

  if (!items.length) return null;
  const layout = gallery.layout || 'masonry';
  const onMist = (tone || 'white') === 'mist';

  // render function (component na) — lightbox khulle chobi abar load hoy na
  const thumb = (item: Item, i: number, className: string, sizes: string) => (
    <button
      key={i}
      type="button"
      onClick={() => setOpen(i)}
      className={`group relative block w-full overflow-hidden rounded-2xl bg-white text-left focus-visible:outline-offset-4 ${className}`}
      aria-label={item.caption || `ছবি ${i + 1} বড় করে দেখুন`}
    >
      <Image src={item.image} alt={item.caption || gallery.title || 'মেহেদি'} fill sizes={sizes} className="object-cover transition duration-500 group-hover:scale-[1.04]" />
      {item.caption && (
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 to-transparent px-3 pb-2.5 pt-8 text-[13px] font-medium text-white md:text-sm">
          {item.caption}
        </span>
      )}
    </button>
  );

  return (
    <section className={`py-14 md:py-20 ${toneBg(tone, 'white')}`}>
      <div className="container">
        {gallery.title && (
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="h-section">{gallery.title}</h2>
              {gallery.subtitle && <p className="lead">{gallery.subtitle}</p>}
            </div>
            <p className="text-sm text-ink/50">{items.length.toLocaleString('bn-BD')}টি ছবি</p>
          </div>
        )}

        {layout === 'carousel' && (
          <div className="no-scrollbar -mx-5 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 md:mx-0 md:gap-4 md:px-0">
            {items.map((item, i) => (
              <div key={i} className="w-[72vw] max-w-[320px] shrink-0 snap-start md:w-[300px]">
                {thumb(item, i, "aspect-[3/4]", "(max-width: 768px) 72vw, 300px")}
              </div>
            ))}
          </div>
        )}

        {layout === 'grid' && (
          <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {items.map((item, i) => thumb(item, i, 'aspect-square', '(max-width: 640px) 50vw, 25vw'))}
          </div>
        )}

        {layout === 'spotlight' && (
          <div className="mt-8 grid gap-2.5 md:grid-cols-2 md:gap-4">
            {thumb(items[0], 0, "aspect-[4/5] md:aspect-auto md:h-full md:min-h-[420px]", "(max-width: 768px) 100vw, 50vw")}
            {items.length > 1 && (
              <div className="grid grid-cols-2 gap-2.5 md:gap-4">
                {items.slice(1, 5).map((item, j) => thumb(item, j + 1, 'aspect-[4/5]', '(max-width: 768px) 50vw, 25vw'))}
              </div>
            )}
          </div>
        )}

        {layout === 'masonry' && (
          <div className="mt-8 columns-2 gap-2.5 md:columns-3 md:gap-4 lg:columns-4">
            {items.map((item, i) => (
              <div key={i} className="mb-2.5 break-inside-avoid md:mb-4">
                {thumb(item, i, i % 3 === 0 ? 'aspect-[3/4]' : i % 3 === 1 ? 'aspect-[4/5]' : 'aspect-square', "(max-width: 768px) 50vw, 25vw")}
              </div>
            ))}
          </div>
        )}

        {layout === 'spotlight' && items.length > 5 && (
          <button type="button" onClick={() => setOpen(5)} className={`mt-4 w-full rounded-xl py-3 text-[15px] font-semibold text-leaf ${onMist ? 'bg-white' : 'bg-mist'}`}>
            আরো {(items.length - 5).toLocaleString('bn-BD')}টি ছবি দেখুন
          </button>
        )}
      </div>

      {open !== null && (
        <Lightbox items={items} index={open} onClose={close} onPrev={() => go(-1)} onNext={() => go(1)} title={gallery.title} />
      )}
    </section>
  );
}

function Lightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
  title,
}: {
  items: Item[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  title?: string;
}) {
  const [touchX, setTouchX] = useState<number | null>(null);
  const item = items[index];
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || 'ছবি'}
      className="fixed inset-0 z-[60] flex flex-col bg-ink/95 text-white"
      onClick={onClose}
      onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX === null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 50) (dx < 0 ? onNext : onPrev)();
        setTouchX(null);
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 text-sm text-white/70" onClick={(e) => e.stopPropagation()}>
        <span>
          {(index + 1).toLocaleString('bn-BD')} / {items.length.toLocaleString('bn-BD')}
        </span>
        <button type="button" onClick={onClose} aria-label="বন্ধ করুন" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
          <Icon name="close" className="h-5 w-5" />
        </button>
      </div>
      <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
        <Image key={item.image} src={item.image} alt={item.caption || title || 'মেহেদি'} fill sizes="100vw" className="object-contain" priority />
        {items.length > 1 && (
          <>
            <button type="button" onClick={onPrev} aria-label="আগের ছবি" className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl hover:bg-white/20 md:flex">
              ‹
            </button>
            <button type="button" onClick={onNext} aria-label="পরের ছবি" className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl hover:bg-white/20 md:flex">
              ›
            </button>
          </>
        )}
      </div>
      <p className="min-h-[3.5rem] px-6 py-4 text-center text-[15px] text-white/85" onClick={(e) => e.stopPropagation()}>
        {item.caption}
        {items.length > 1 && <span className="mt-1 block text-xs text-white/40 md:hidden">পাশে সোয়াইপ করে পরের ছবি</span>}
      </p>
    </div>
  );
}
