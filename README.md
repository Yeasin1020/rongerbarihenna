# RongerBari Henna — landing page, e-commerce ar admin panel

**Ekta Next.js project** — website, admin panel, API (backend) sob ek jaygay. Database **PostgreSQL** (Prisma diye).

> ⚠️ `mehedi` folder **nijei** pura app — website + admin + backend (API: `src/app/api/`). Vitore purono `frontend` folder thakle **delete kore dao**, ota ar lagbe na.

---

## Ki ki ache

**Website (customer ra je page dekhbe)**
- Mobile-first design: mehedi pata-r sobuj, mehedi-r rong er maroon ar holud. Font: Tiro Bangla (heading) + Anek Bangla (lekha)
- Hero: jharokha (arch) frame e chobi, pashe mehedi naksha haate akar moto ake
- Mobile e nicher dike sob somoy ekta **order bar** thake (mot dam + "অর্ডার করুন"), WhatsApp button soho
- Combo, product, byabohar er niyom, video, gallery, review, FAQ, order form — **sob section admin theke edit, on/off, upor-niche kora jay**
- Ek page e order: product/combo select, quantity, Dhakar vitore/baire delivery charge auto, Cash on Delivery
- Product details page, thank-you page

**Admin panel (`/admin`)**
- Dashboard: ajker order, pending, 30 diner sale, 7 diner chart, kom stock
- Orders: status change, search, date filter, onekgula eksathe status change, CSV, invoice print, Call/WhatsApp, ei number theke ager order koyta, mobile e card view, 60 second por por auto refresh
- Products / Combos: add, edit, delete, hide, onek chobi upload, offer price, stock
- Landing page editor: hero chobi, sob lekha, section order
- Settings: logo, favicon, theme color, contact, delivery charge, free delivery, stock tracking, SEO, **Facebook Pixel + Conversion API, GTM, GA4, TikTok**, password

**Speed, SEO, Pixel**
- Page age thekei toiri thake (ISR) — khub fast. Admin e Save dile sathe sathe update
- Chobi auto WebP/AVIF, lazy load. Upload kora chobi **Cloudinary** te jay (set na thakle database e) — Vercel e deploy korleo harabe na
- Auto sitemap.xml, robots.txt, Facebook share preview, Google er jonno Product/FAQ schema
- Pixel events: PageView, ViewContent, AddToCart, InitiateCheckout, Purchase. Conversion API server theke same event_id diye jay, tai duplicate hoy na

---

## Ki lagbe

- **Node.js 20 ba 22** — https://nodejs.org (check: `node -v`)
- **PostgreSQL URL** — Neon.tech / Supabase / Railway ba local

---

## Chalanor niyom — shudhu ekta command

```bash
npm run dev
```

Prothom bar eta nijei:
1. Node version check korbe
2. Database URL chaibe (Neon er connection string paste koro) → `.env` file, secret, admin password nijei banabe
3. `npm install` korbe
4. Database e table banabe, demo product boshabe

Terminal e **admin email ar password** dekhabe — likhe rakho (`.env` file eo thakbe).
Porer bar theke `npm run dev` dilei sathe sathe chalu.

- Website: **http://localhost:3000**
- Admin: **http://localhost:3000/admin**

> Terminal kholte na chaile `start.bat` e double click korleo same kaj hobe.

### Database schema change korle (prisma/schema.prisma edit korle)

```bash
npm run db:push
```

Production mode e fast test: `npm run build` tarpor `npm start`

---

## Login er por prothome

1. **Settings → General & Logo** — logo upload, favicon, rong
2. **Settings → Contact** — phone, WhatsApp, Facebook page
3. **Settings → Delivery** — Dhakar vitore/baire charge
4. **Products** — demo product e asol chobi, dam, stock dao
5. **Combos** — combo offer
6. **Landing page** — hero chobi (4:5 ratio, 1000px+ best), lekha, review, FAQ
7. **Settings → SEO** — domain, title, description, share chobi
8. **Settings → Pixel / Tracking** — Pixel ID

---

## Cloudinary (chobi upload)

Admin panel e chobi upload korle **browser theke sorasori Cloudinary te** jay — server diye ghure na, tai fast ar boro chobi o hoy (10MB porjonto). API secret kokhono browser e jay na; server shudhu ekta signature dey.

1. cloudinary.com e free account → **Dashboard → API Keys**
2. `.env` file e jog koro:
   ```env
   CLOUDINARY_CLOUD_NAME=tomar_cloud_name
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
   CLOUDINARY_FOLDER=ronger-bari
   ```
   (othoba ek line e `CLOUDINARY_URL=cloudinary://KEY:SECRET@CLOUD_NAME`)
3. `npm run dev` bondho kore abar chalao
4. Vercel e live korle ei 4 ta variable Vercel er Environment Variables eo dao

Cloudinary set na thakle chobi database e save hoy — tao kaj korbe.

---

## Gallery

Admin → Landing page → **Gallery** tab. Jotogula dorkar gallery banano jay, protitir alada layout:

- **Masonry** — lomba-choto chobi mile (hater design er jonno best)
- **Grid** — soman chhoto ghor
- **Carousel** — pashe swipe (product, review screenshot)
- **Spotlight** — ekta boro chobi, pashe 4 ta

Chobi te chap dile website e boro hoye khule (← → ba swipe kore porer chobi).

Tomar 20 ta chobi `public/gallery/` e ache — website e **sathe sathe** dekhay, Cloudinary lage na. `.env` e Cloudinary thakle `npm run dev` er somoy ekbar nijei Cloudinary te upload hoye link gula Cloudinary er hoye jabe. Hate chalate: `npm run gallery:import`

---

## Facebook Pixel + Conversion API

1. business.facebook.com → **Events Manager** → tomar Pixel
2. **Pixel ID** copy → Admin → Settings → Pixel / Tracking → *Facebook Pixel ID*
3. Events Manager → Settings → **Conversions API → Generate access token** → *Conversion API Access Token* e boshao
4. Save
5. Test: Events Manager → **Test events** er code (TEST12345) *Test event code* e boshao → website e test order dao → Browser + Server dui tai dekhabe → test sesh hole code faka kore Save

---

## Live kora (deploy)

**Shobcheye shohoj: Vercel + Neon (dui tai free tier)**

1. Code GitHub e push koro (`.env` push hobe na — `.gitignore` e ache)
2. vercel.com → New Project → repo select
3. Environment Variables e `.env` er sob gula dao: `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, ar `NEXT_PUBLIC_SITE_URL=https://tomardomain.com`
4. Build command default (`npm run build`) e rakho — table PC theke age-i bana ache
5. Deploy → domain connect

**VPS hole:**
```bash
npm install
npm run db:push
npm run build
npm i -g pm2
pm2 start npm --name rbh -- start
```

Live howar por: Admin → Settings → SEO → **Website URL** e domain dao, Google Search Console e `https://tomardomain.com/sitemap.xml` submit koro.

---

## Folder

```
mehedi/
├── prisma/
│   ├── schema.prisma          Database table: Product, Combo, Order, Setting, Admin, Media
│   └── seed.ts                Demo data
├── src/
│   ├── middleware.ts          Login chara /admin e dhukte dey na
│   ├── app/
│   │   ├── (site)/            Website: home, product page, thank-you
│   │   ├── admin/             Admin panel
│   │   ├── api/               Backend API (orders, auth, admin/*)
│   │   ├── media/[id]/        Database theke chobi dekhay
│   │   └── sitemap.ts, robots.ts
│   ├── components/
│   │   ├── site/              Website er section gula (Hero, OrderForm, StickyOrderBar…)
│   │   └── admin/             Admin UI
│   └── lib/
│       ├── server/            Database, order, setting, Facebook CAPI
│       ├── default-settings.ts  Default lekha ar rong
│       └── track.ts           Pixel event
├── .env.example
└── package.json
```

## API

| Method | URL | Kaj |
|---|---|---|
| POST | `/api/orders` | Order (protti IP 1 minute e max 5 ta) |
| POST | `/api/auth/login`, `/api/auth/logout` | Admin login/logout |
| GET/PUT | `/api/admin/settings` | Setting |
| CRUD | `/api/admin/products`, `/api/admin/combos` | Product, combo |
| GET/PATCH/DELETE | `/api/admin/orders` | Order |
| GET | `/api/admin/stats` | Dashboard |
| POST | `/api/admin/upload` | Chobi upload |

---

## Somossa hole

| Somossa | Ki korbe |
|---|---|
| `Can't reach database server` | Internet thik ache kina dekho. Neon free plan e database ghumiye thake — 10-20 second por abar chalao |
| `Module not found: @prisma/client` / Prisma error | `npx prisma generate` chalao |
| Admin login hoy na | Password bhule gele `npm run db:studio` → `Admin` table er row delete → abar login korle `.env` er password diye notun admin hobe |
| Website e product nai | `npm run seed` chalaiso? Product `Active` ache? |
| Font download error (build e) | Internet connection lagbe (Google Fonts) |
| `backend/` ba `frontend/` folder er error | Ogula purono version — delete kore dao |
