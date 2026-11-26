'use client';

import { useState } from 'react';
import SmartImage from './SmartImage';

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  return (
    <div className="md:sticky md:top-24 md:self-start">
      <SmartImage src={images[active]} alt={name} priority sizes="(max-width: 768px) 100vw, 50vw" className="aspect-[4/5] w-full rounded-[22px]" />
      {images.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`ছবি ${i + 1}`}
              className={`w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${i === active ? 'border-leaf' : 'border-transparent opacity-70'}`}
            >
              <SmartImage src={src} alt="" sizes="80px" className="aspect-square" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
