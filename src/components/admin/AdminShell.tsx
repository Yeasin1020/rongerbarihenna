'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { logout } from '@/lib/admin';

const NAV = [
  { href: '/admin', label: 'Dashboard', d: 'M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6v-9h-6v9Zm0-16v5h6V4h-6Z' },
  { href: '/admin/orders', label: 'Orders', d: 'M6 3h12v18l-3-2-3 2-3-2-3 2V3Zm3 5h6M9 12h6' },
  { href: '/admin/products', label: 'Products', d: 'M5 19c0-8 5-14 15-15-1 10-7 15-15 15Zm0 0 7-7' },
  { href: '/admin/combos', label: 'Combos', d: 'M4 10h16v10H4zM3 7h18v3H3zM12 7v13' },
  { href: '/admin/landing', label: 'Landing page', d: 'M4 5h16v14H4zM4 9h16M8 13h5' },
  { href: '/admin/settings', label: 'Settings', d: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7-3 2-1-2-4-2 1-2-1V5h-4v2l-2 1-2-1-2 4 2 1v2l-2 1 2 4 2-1 2 1v2h4v-2l2-1 2 1 2-4-2-1v-2Z' },
];

type Toast = { id: number; message: string; type: 'success' | 'error' };

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const isLogin = pathname === '/admin/login';

  useEffect(() => {
    const h = (e: Event) => {
      const d = (e as CustomEvent<Omit<Toast, 'id'>>).detail;
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, ...d }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
    };
    window.addEventListener('rbh:toast', h);
    return () => window.removeEventListener('rbh:toast', h);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const toastUi = (
    <div className="no-print fixed inset-x-4 bottom-4 z-[100] flex flex-col items-center gap-2 md:inset-x-auto md:right-6">
      {toasts.map((t) => (
        <div key={t.id} role="status" className={`rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${t.type === 'error' ? 'bg-red-700' : 'bg-stone-900'}`}>
          {t.message}
        </div>
      ))}
    </div>
  );

  if (isLogin) return <>{children}{toastUi}</>;

  const active = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href));
  const current = NAV.find((n) => active(n.href));

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <div className="no-print sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-stone-200 bg-white px-4 lg:hidden">
        <button onClick={() => setOpen(true)} aria-label="Menu" className="-ml-1 flex h-10 w-10 items-center justify-center rounded-lg hover:bg-stone-100">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
        <Image src="/brand/logo-256.png" alt="" width={32} height={32} className="h-8 w-8 object-contain" />
        <span className="font-semibold">{current?.label || 'Admin'}</span>
      </div>

      <aside className={`no-print fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#1d2338] text-white transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-20 items-center gap-3 px-5">
          <Image src="/brand/logo-256.png" alt="" width={44} height={44} className="h-11 w-11 object-contain" />
          <span className="leading-tight">
            <span className="block font-display text-lg text-[#eebd7a]">RongerBari Henna</span>
            <span className="text-[11px] text-white/50">Admin panel</span>
          </span>
        </div>
        <nav className="flex-1 space-y-0.5 px-3 py-2">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] transition ${active(n.href) ? 'bg-white text-[#1d2338] font-semibold' : 'text-white/75 hover:bg-white/10 hover:text-white'}`}
            >
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" aria-hidden><path d={n.d} /></svg>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-0.5 border-t border-white/10 p-3 text-[14px]">
          <a href="/" target="_blank" className="block rounded-lg px-3 py-2 text-white/75 hover:bg-white/10 hover:text-white">Website dekhun</a>
          <button onClick={logout} className="block w-full rounded-lg px-3 py-2 text-left text-[#f2c879] hover:bg-white/10">Logout</button>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-5 md:px-8 md:py-8">{children}</div>
      </main>
      {toastUi}
    </div>
  );
}
