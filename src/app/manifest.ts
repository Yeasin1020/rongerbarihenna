import type { MetadataRoute } from 'next';

// Mobile e "Add to Home screen" korle logo diye app er moto khulbe
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RongerBari Henna',
    short_name: 'RongerBari',
    description: 'খাঁটি মেহেদি কোন — সারা বাংলাদেশে ক্যাশ অন ডেলিভারি',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#262d47',
    icons: [
      { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
