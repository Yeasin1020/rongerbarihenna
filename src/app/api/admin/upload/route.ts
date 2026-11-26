import { db } from '@/lib/server/db';
import { adminRoute, HttpError } from '@/lib/server/http';
import { uploadToCloudinary } from '@/lib/server/cloudinary';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/x-icon', 'image/vnd.microsoft.icon'];
const EXT: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif' };

/**
 * Backup upload route. Normal e admin panel sorasori Cloudinary te upload kore (/api/admin/upload/sign).
 * Cloudinary set kora thakle ekhan theke o Cloudinary te jay, na thakle database e save hoy (/media/12.jpg).
 */
export const POST = adminRoute(async (req) => {
  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) throw new HttpError(400, 'Kono file pawa jay nai');
  if (!ALLOWED.includes(file.type)) throw new HttpError(400, 'Shudhu jpg, png, webp, gif chobi upload kora jabe');
  if (file.size > 5 * 1024 * 1024) throw new HttpError(400, 'Chobi 5MB er choto hote hobe');

  const cloudUrl = await uploadToCloudinary(file).catch((e: Error) => {
    throw new HttpError(502, e.message);
  });
  if (cloudUrl) return Response.json({ url: cloudUrl });

  const media = await db.media.create({
    data: { filename: file.name.slice(0, 200), mime: file.type, size: file.size, data: new Uint8Array(await file.arrayBuffer()) },
  });
  return Response.json({ url: `/media/${media.id}.${EXT[file.type] || 'png'}` });
});
