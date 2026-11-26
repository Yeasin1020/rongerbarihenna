/**
 * Mehedi naksha (original line-art). Brand er signature — hero, placeholder, footer e use hoy.
 * `animate` dile page load e haate akar moto line ta ake.
 */
export default function Mehndi({ className = '', animate = false }: { className?: string; animate?: boolean }) {
  const line = animate ? { strokeDasharray: 1200, className: 'animate-draw' } : {};
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" className={className} aria-hidden>
      {/* majhkhaner phool */}
      <circle cx="100" cy="100" r="9" {...line} />
      <circle cx="100" cy="100" r="3" fill="currentColor" stroke="none" />
      {Array.from({ length: 8 }).map((_, i) => (
        <path
          key={i}
          d="M100 89c-7-10-7-22 0-30 7 8 7 20 0 30Z"
          transform={`rotate(${i * 45} 100 100)`}
          {...line}
        />
      ))}
      <circle cx="100" cy="100" r="44" strokeDasharray="1 5" />
      {/* paisley (kolka) charpashe */}
      {Array.from({ length: 4 }).map((_, i) => (
        <g key={i} transform={`rotate(${i * 90 + 45} 100 100)`}>
          <path d="M100 38c14 0 22 10 18 20-3 8-14 9-18 2-3-5 1-10 6-9" {...line} />
          <path d="M100 30c-3-8-1-14 4-18" {...line} />
          <circle cx="105" cy="48" r="1.8" fill="currentColor" stroke="none" />
        </g>
      ))}
      {/* bahirer bindu */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return <circle key={i} cx={+(100 + Math.cos(a) * 92).toFixed(2)} cy={+(100 + Math.sin(a) * 92).toFixed(2)} r={i % 2 ? 1.2 : 2.2} fill="currentColor" stroke="none" />;
      })}
    </svg>
  );
}
