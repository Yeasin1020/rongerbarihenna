'use client';

import { useEffect } from 'react';
import { track } from '@/lib/track';

export default function ViewContent({ id, name, price }: { id: string; name: string; price: number }) {
  useEffect(() => {
    // Pixel load hote ektu somoy lage
    const t = setTimeout(() => {
      track('ViewContent', { value: price, content_ids: [id], content_name: name, contents: [{ id, quantity: 1, item_price: price }] });
    }, 800);
    return () => clearTimeout(t);
  }, [id, name, price]);
  return null;
}
