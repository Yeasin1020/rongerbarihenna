/**
 * Sonali patar dal — logo er patar moto (original line art).
 * Brand er signature ornament: hero, banner, footer, faka chobir jaygay.
 */
type P = [number, number];
const P0: P = [14, 188];
const P1: P = [64, 150];
const P2: P = [118, 84];
const P3: P = [186, 14];

function point(t: number): P {
  const u = 1 - t;
  return [
    u * u * u * P0[0] + 3 * u * u * t * P1[0] + 3 * u * t * t * P2[0] + t * t * t * P3[0],
    u * u * u * P0[1] + 3 * u * u * t * P1[1] + 3 * u * t * t * P2[1] + t * t * t * P3[1],
  ];
}
function angle(t: number) {
  const u = 1 - t;
  const dx = 3 * u * u * (P1[0] - P0[0]) + 6 * u * t * (P2[0] - P1[0]) + 3 * t * t * (P3[0] - P2[0]);
  const dy = 3 * u * u * (P1[1] - P0[1]) + 6 * u * t * (P2[1] - P1[1]) + 3 * t * t * (P3[1] - P2[1]);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}
const r2 = (n: number) => Math.round(n * 100) / 100;

const LEAVES = Array.from({ length: 11 }, (_, i) => {
  const t = 0.1 + i * 0.078;
  const [x, y] = point(t);
  const side = i % 2 === 0 ? -1 : 1;
  return { x: r2(x), y: r2(y), rot: r2(angle(t) + side * 52), s: r2(1.05 - t * 0.45), filled: i % 3 !== 1 };
});

const LEAF = 'M0 0C8-9 22-10 33 0C22 10 8 9 0 0Z';

export default function Leaves({ className = '', animate = false }: { className?: string; animate?: boolean }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeLinecap="round" className={className} aria-hidden>
      <path
        d={`M${P0.join(' ')}C${P1.join(' ')} ${P2.join(' ')} ${P3.join(' ')}`}
        strokeWidth={1.6}
        {...(animate ? { strokeDasharray: 1200, className: 'animate-draw' } : {})}
      />
      {LEAVES.map((l, i) => (
        <g
          key={i}
          transform={`translate(${l.x} ${l.y}) rotate(${l.rot}) scale(${l.s})`}
          style={animate ? { animation: `leaf-in .6s ${0.25 + i * 0.09}s both` } : undefined}
        >
          <path d={LEAF} fill={l.filled ? 'currentColor' : 'none'} strokeWidth={1.2 / l.s} />
          {!l.filled && <path d="M3 0L29 0" strokeWidth={0.9 / l.s} />}
        </g>
      ))}
    </svg>
  );
}
