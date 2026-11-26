import SmartImage from './SmartImage';
import Leaves from './Leaves';
import { toneBg } from '@/lib/utils';
import type { Settings } from '@/lib/types';

/**
 * Admin theke banano notun section.
 *  - textImage: ek pashe lekha, arek pashe chobi
 *  - banner: rong-er upor boro lekha + button (offer, ghoshona)
 *  - text: shudhu title ar lekha
 */
export default function CustomSection({ block, tone }: { block: Settings; tone?: string }) {
  if (!block) return null;
  const button = block.buttonText && (
    <a href={block.buttonLink || '#order'} className={block.type === 'banner' ? 'btn-haldi mt-7' : 'btn-leaf mt-7'}>
      {block.buttonText}
    </a>
  );

  if (block.type === 'banner') {
    return (
      <section className="bg-white py-10 md:py-14">
        <div className="container">
          <div className="relative overflow-hidden rounded-[26px] bg-leaf px-6 py-12 text-center text-white md:px-16 md:py-16">
            <Leaves className="pointer-events-none absolute -left-8 -top-10 h-48 w-48 rotate-180 text-haldi/20" />
            <Leaves className="pointer-events-none absolute -bottom-8 -right-6 h-56 w-56 text-haldi/25" />
            <div className="relative mx-auto max-w-2xl">
              {block.title && <h2 className="font-display text-[1.9rem] leading-[1.25] md:text-[2.6rem]">{block.title}</h2>}
              {block.text && <p className="mt-4 whitespace-pre-line text-[1.05rem] leading-[1.75] text-white/80">{block.text}</p>}
              {button}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (block.type === 'text') {
    return (
      <section className={`py-14 md:py-20 ${toneBg(tone, 'white')}`}>
        <div className="container max-w-3xl">
          {block.title && <h2 className="h-section">{block.title}</h2>}
          {block.text && <div className="mt-5 whitespace-pre-line text-[1.05rem] leading-[1.85] text-ink/75">{block.text}</div>}
          {button}
        </div>
      </section>
    );
  }

  // textImage
  const imageLeft = block.imageSide === 'left';
  return (
    <section className={`py-14 md:py-20 ${toneBg(tone, 'white')}`}>
      <div className="container grid items-center gap-8 md:grid-cols-2 md:gap-14">
        <SmartImage
          src={block.image}
          alt={block.title || ''}
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`aspect-[4/3] rounded-[22px] ${imageLeft ? 'md:order-first' : 'md:order-last'}`}
        />
        <div>
          {block.title && <h2 className="h-section">{block.title}</h2>}
          {block.text && <p className="mt-4 max-w-prose whitespace-pre-line text-[1.05rem] leading-[1.85] text-ink/70">{block.text}</p>}
          {button}
        </div>
      </div>
    </section>
  );
}
