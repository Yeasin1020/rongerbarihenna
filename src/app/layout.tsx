import type { Viewport } from 'next';
import { Anek_Bangla, Galada, Hind_Siliguri, Noto_Sans_Bengali, Noto_Serif_Bengali, Tiro_Bangla } from 'next/font/google';
import './globals.css';

// Admin > Settings > Design theke font bacha jay. Browser shudhu je font use hoy seta-i download kore.
const tiro = Tiro_Bangla({ subsets: ['bengali', 'latin'], weight: '400', display: 'swap', variable: '--f-tiro' });
const notoSerif = Noto_Serif_Bengali({ subsets: ['bengali', 'latin'], display: 'swap', variable: '--f-noto-serif' });
const galada = Galada({ subsets: ['bengali', 'latin'], weight: '400', display: 'swap', variable: '--f-galada' });
const anek = Anek_Bangla({ subsets: ['bengali', 'latin'], display: 'swap', variable: '--f-anek' });
const hind = Hind_Siliguri({ subsets: ['bengali', 'latin'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--f-hind' });
const notoSans = Noto_Sans_Bengali({ subsets: ['bengali', 'latin'], display: 'swap', variable: '--f-noto-sans' });

const fontVars = [tiro, notoSerif, galada, anek, hind, notoSans].map((f) => f.variable).join(' ');

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#262d47',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={fontVars}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
