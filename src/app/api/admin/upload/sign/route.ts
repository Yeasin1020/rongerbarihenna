import { adminRoute } from '@/lib/server/http';
import { cloudinaryConfig, signParams } from '@/lib/server/cloudinary';

export const dynamic = 'force-dynamic';

/**
 * Browser theke sorasori Cloudinary te upload er jonno signature dey.
 * Fole boro chobi o server diye ghure jay na — fast, ar Vercel er 4.5MB limit e atke na.
 * API secret kokhono browser e jay na.
 */
export const GET = adminRoute(async () => {
  const cfg = cloudinaryConfig();
  if (!cfg) return Response.json({ enabled: false });
  const timestamp = Math.floor(Date.now() / 1000);
  return Response.json({
    enabled: true,
    cloudName: cfg.cloudName,
    apiKey: cfg.apiKey,
    folder: cfg.folder,
    timestamp,
    signature: signParams({ folder: cfg.folder, timestamp }, cfg.apiSecret),
  });
});
