import Image from 'next/image';
import { cn } from '@/lib/utils';
import Leaves from './Leaves';

/** Chobi na thakle mehedi naksha diye placeholder */
export default function SmartImage({
  src,
  alt,
  className,
  sizes = '(max-width: 768px) 100vw, 33vw',
  priority,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className={cn('relative overflow-hidden bg-mist', className)}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-[22%] text-leaf/25" aria-hidden>
          <Leaves className="h-full w-full" />
        </div>
      )}
    </div>
  );
}
