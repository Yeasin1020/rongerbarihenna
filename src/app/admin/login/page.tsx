'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Login hoy ni');
      window.location.href = '/admin';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login hoy ni');
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-[#262d47] md:block">
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Image src="/brand/logo.png" alt="RongerBari Henna" width={220} height={228} className="h-auto w-48" priority />
          <p className="max-w-sm font-display text-4xl leading-tight text-[#eebd7a]">Order, product ar website — sob ek jaygay.</p>
          <p className="text-sm text-white/60">Admin panel</p>
        </div>
      </div>
      <div className="flex items-center justify-center bg-stone-50 p-6">
        <form onSubmit={submit} className="w-full max-w-sm">
          <Image src="/brand/logo-256.png" alt="RongerBari Henna" width={72} height={72} className="h-[72px] w-[72px] object-contain md:hidden" priority />
          <h1 className="mt-2 text-2xl font-semibold text-stone-900">Login korun</h1>
          <p className="mt-1 text-sm text-stone-500">.env file e deya admin email ar password din</p>
          <div className="mt-8 space-y-4">
            <label className="block">
              <span className="a-label">Email</span>
              <input type="email" required autoComplete="email" className="a-input !py-2.5" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="block">
              <span className="a-label">Password</span>
              <input type="password" required autoComplete="current-password" className="a-input !py-2.5" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <button className="a-btn w-full !py-3" disabled={loading}>{loading ? 'Login hocche…' : 'Login'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
