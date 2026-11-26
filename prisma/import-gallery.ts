/**
 * public/gallery/ er chobi gula Cloudinary te upload kore, website er /gallery/... link gula Cloudinary link e bodle dey.
 *
 *   npm run gallery:import
 *
 * - Cloudinary .env e na thakle kichu kore na (bole dey ki korte hobe)
 * - Same naam e upload hoy (overwrite), tai abar chalaleo duplicate hoy na
 * - Admin nije je chobi diyeche (onno link), seta chhoy na
 * - Cloudinary na thakleo website e chobi dekhay (public/gallery theke)
 */
import { PrismaClient, type Prisma } from '@prisma/client';
import { createHash } from 'crypto';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join, basename } from 'path';
import { DEFAULT_SETTINGS } from '../src/lib/default-settings';

const ROOT = process.cwd();
const DIR = join(ROOT, 'public', 'gallery');

// ---- .env pora (tsx nije .env load kore na) ----
if (existsSync(join(ROOT, '.env'))) {
  for (const line of readFileSync(join(ROOT, '.env'), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

function cloudinary() {
  let cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  let apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  let apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  const url = process.env.CLOUDINARY_URL?.trim();
  if (url && (!cloudName || !apiKey || !apiSecret)) {
    try {
      const u = new URL(url);
      cloudName ||= u.hostname;
      apiKey ||= decodeURIComponent(u.username);
      apiSecret ||= decodeURIComponent(u.password);
    } catch {}
  }
  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret, folder: `${process.env.CLOUDINARY_FOLDER?.trim() || 'ronger-bari'}/gallery` };
}

async function upload(file: string, cfg: NonNullable<ReturnType<typeof cloudinary>>) {
  const publicId = basename(file).replace(/\.[^.]+$/, '');
  const timestamp = Math.floor(Date.now() / 1000);
  const params: Record<string, string | number> = { folder: cfg.folder, overwrite: 'true', public_id: publicId, timestamp };
  const toSign = Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join('&');
  const signature = createHash('sha1').update(toSign + cfg.apiSecret).digest('hex');

  const form = new FormData();
  form.append('file', new Blob([readFileSync(join(DIR, file))], { type: 'image/jpeg' }), file);
  for (const [k, v] of Object.entries(params)) form.append(k, String(v));
  form.append('api_key', cfg.apiKey);
  form.append('signature', signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cfg.cloudName}/image/upload`, { method: 'POST', body: form });
  const data = (await res.json().catch(() => ({}))) as { secure_url?: string; error?: { message?: string } };
  if (!res.ok || !data.secure_url) throw new Error(`${file}: ${data.error?.message || res.status}`);
  return data.secure_url;
}

async function main() {
  const cfg = cloudinary();
  if (!cfg) {
    console.log('  Cloudinary .env e nai — gallery import skip. CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET diye abar chalao.');
    process.exit(2);
  }

  const urls: Record<string, string> = {};
  const files = readdirSync(DIR).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  for (const [i, file] of files.entries()) {
    process.stdout.write(`  [${i + 1}/${files.length}] ${file} … `);
    urls[file] = await upload(file, cfg);
    console.log('ok');
  }

  const prisma = new PrismaClient();
  try {
    const row = await prisma.setting.findUnique({ where: { id: 1 } });
    const data = (row?.data as Record<string, any>) || {};

    // /gallery/xxx.jpg -> Cloudinary link (shob jaygay)
    const swap = (u: unknown) => {
      if (typeof u !== 'string' || !u.startsWith('/gallery/')) return u;
      return urls[u.slice('/gallery/'.length)] || u;
    };
    const galleries: any[] = Array.isArray(data.galleries) ? data.galleries : JSON.parse(JSON.stringify(DEFAULT_SETTINGS.galleries));
    for (const g of galleries) g.items = (g.items || []).map((it: any) => ({ ...it, image: swap(it.image) }));
    data.galleries = galleries;
    data.hero = { ...(data.hero || {}), image: swap(data.hero?.image || DEFAULT_SETTINGS.hero.image) };

    await prisma.setting.upsert({
      where: { id: 1 },
      create: { id: 1, data: data as Prisma.InputJsonValue },
      update: { data: data as Prisma.InputJsonValue },
    });
    console.log(`  ✔ ${files.length} ta chobi Cloudinary te, gallery ready`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error('  ✖ Gallery import hoy ni:', e.message);
  process.exit(1);
});
