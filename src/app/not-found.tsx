import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#f1f0f5] p-8 text-center">
      <p className="font-display text-6xl text-[#262d47]">৪০৪</p>
      <h1 className="mt-4 text-xl font-semibold">এই পেজটি খুঁজে পাওয়া যায়নি</h1>
      <Link href="/" className="mt-6 rounded-xl bg-[#262d47] px-6 py-3 font-semibold text-white">
        হোম পেজে যান
      </Link>
    </div>
  );
}
