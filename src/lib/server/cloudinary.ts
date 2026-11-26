import 'server-only';
import { createHash } from 'crypto';

/**
 * Cloudinary config .env theke. Duibhabe deya jay:
 *   CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
 * othoba alada alada:
 *   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 * Optional: CLOUDINARY_FOLDER (default: ronger-bari)
 */
export function cloudinaryConfig() {
  let cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  let apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  let apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  const url = process.env.CLOUDINARY_URL?.trim();
  if (url && (!cloudName || !apiKey || !apiSecret)) {
    try {
      const u = new URL(url);
      cloudName = cloudName || u.hostname;
      apiKey = apiKey || decodeURIComponent(u.username);
      apiSecret = apiSecret || decodeURIComponent(u.password);
    } catch {
      /* vul URL — niche null return */
    }
  }
  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret, folder: process.env.CLOUDINARY_FOLDER?.trim() || 'ronger-bari' };
}

/** Cloudinary signature: param gula a-z sajiye & diye jora + secret, tarpor SHA-1 */
export function signParams(params: Record<string, string | number>, apiSecret: string) {
  const toSign = Object.keys(params)
    .sort()
    .filter((k) => params[k] !== '' && params[k] !== undefined)
    .map((k) => `${k}=${params[k]}`)
    .join('&');
  return createHash('sha1').update(toSign + apiSecret).digest('hex');
}

/** Server theke upload (browser direct upload kaj na korle backup) */
export async function uploadToCloudinary(file: File) {
  const cfg = cloudinaryConfig();
  if (!cfg) return null;
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { folder: cfg.folder, timestamp };
  const form = new FormData();
  form.append('file', file);
  form.append('api_key', cfg.apiKey);
  form.append('timestamp', String(timestamp));
  form.append('folder', cfg.folder);
  form.append('signature', signParams(params, cfg.apiSecret));

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cfg.cloudName}/image/upload`, { method: 'POST', body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || 'Cloudinary upload hoy ni');
  return data.secure_url as string;
}
