// Haate banano line icon — emoji er bodole, brand er sathe mile
const PATHS: Record<string, string> = {
  leaf: 'M5 19c0-8 5-14 15-15-1 10-7 15-15 15Zm0 0 7-7',
  drop: 'M12 3s6 6.4 6 11a6 6 0 1 1-12 0c0-4.6 6-11 6-11Zm-2.5 11.5a2.6 2.6 0 0 0 2.5 2.5',
  truck: 'M3 6h11v10H3zM14 10h4l3 3v3h-7M7 19a1.8 1.8 0 1 0 0-.1M17 19a1.8 1.8 0 1 0 0-.1',
  shield: 'M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Zm-3 9 2 2 4-4',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z',
  star: 'm12 4 2.4 5 5.6.8-4 3.9.9 5.5L12 16.6 7.1 19.2l.9-5.5-4-3.9 5.6-.8L12 4Z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4.5l3 2',
  gift: 'M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-2-3-5-3-5-1s3 1 5 1Zm0 0c2-3 5-3 5-1s-3 1-5 1Z',
  phone: 'M5 4h3l2 5-2 1a11 11 0 0 0 6 6l1-2 5 2v3a2 2 0 0 1-2 2C10 21 3 14 3 6a2 2 0 0 1 2-2Z',
  check: 'm5 12.5 4.5 4.5L19 7.5',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  close: 'M6 6l12 12M18 6 6 18',
  bag: 'M6 8h12l-1 12H7L6 8Zm3 0a3 3 0 0 1 6 0',
};

export default function Icon({ name, className = 'h-6 w-6', strokeWidth = 1.6 }: { name: string; className?: string; strokeWidth?: number }) {
  const d = PATHS[name] || PATHS.leaf;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={d} />
    </svg>
  );
}
