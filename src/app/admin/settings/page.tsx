'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { adminFetch, toast } from '@/lib/admin';
import { useSettingsEditor } from '@/components/admin/useSettingsEditor';
import { ColorField, Field, ImageInput, PageHeader, Tabs, Toggle } from '@/components/admin/ui';

const TABS = [
  { key: 'general', label: 'General & Logo' },
  { key: 'contact', label: 'Contact & Social' },
  { key: 'delivery', label: 'Delivery & Stock' },
  { key: 'seo', label: 'SEO' },
  { key: 'tracking', label: 'Pixel / Tracking' },
  { key: 'password', label: 'Password' },
];

export default function SettingsPage() {
  const { data, get, set, save, saving, dirty } = useSettingsEditor();
  const [tab, setTab] = useState('general');
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' });

  if (!data) return <p className="text-stone-500">Loading...</p>;

  const F = (label: string, path: string, opts: { textarea?: boolean; type?: string; hint?: string; placeholder?: string } = {}) => (
    <Field label={label} value={get(path)} onChange={(v) => set(path, v)} {...opts} />
  );

  const changePassword = async () => {
    try {
      await adminFetch('/auth/change-password', { method: 'POST', body: JSON.stringify(pw) });
      toast('Password change hoyeche');
      setPw({ currentPassword: '', newPassword: '' });
    } catch (e: any) {
      toast(e.message, 'error');
    }
  };

  return (
    <div>
      <PageHeader title="Settings" desc="Logo, color, delivery charge, SEO, Facebook Pixel — sob ekhane">
        {tab !== 'password' && <button className="a-btn" onClick={save} disabled={saving}>{saving ? 'Saving...' : dirty ? 'Save korun •' : 'Save'}</button>}
      </PageHeader>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      <div className="a-card space-y-5">
        {tab === 'general' && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              {F('Website / brand name', 'siteName')}
              {F('Tagline', 'tagline')}
            </div>
            <ImageInput label="Logo" value={get('logo')} onChange={(v) => set('logo', v)} hint="PNG (transparent background) best. Na dile naam text hisebe dekhabe." />
            <ImageInput label="Favicon (browser tab icon)" value={get('favicon')} onChange={(v) => set('favicon', v)} hint="Square PNG, 512x512" />
            <h3 className="pt-2 font-semibold">Theme color</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <ColorField label="Main (header, footer, order section)" value={get('theme.primary')} onChange={(v) => set('theme.primary', v)} />
              <ColorField label="Dam / highlight" value={get('theme.accent')} onChange={(v) => set('theme.accent', v)} />
              <ColorField label="Order button" value={get('theme.highlight')} onChange={(v) => set('theme.highlight', v)} />
              <ColorField label="Halka background" value={get('theme.background')} onChange={(v) => set('theme.background', v)} />
              <ColorField label="Lekha" value={get('theme.text')} onChange={(v) => set('theme.text', v)} />
            </div>
          </>
        )}

        {tab === 'contact' && (
          <div className="grid gap-4 md:grid-cols-2">
            {F('Phone', 'contact.phone')}
            {F('WhatsApp number', 'contact.whatsapp', { hint: 'Floating WhatsApp button e use hobe' })}
            {F('Email', 'contact.email')}
            {F('Address', 'contact.address')}
            {F('Facebook page link', 'contact.facebook')}
            {F('Instagram link', 'contact.instagram')}
            {F('YouTube link', 'contact.youtube')}
            {F('TikTok link', 'contact.tiktok')}
          </div>
        )}

        {tab === 'delivery' && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              {F('Dhakar vitore charge (৳)', 'delivery.insideDhaka', { type: 'number' })}
              {F('Dhakar baire charge (৳)', 'delivery.outsideDhaka', { type: 'number' })}
              {F('Vitore label', 'delivery.insideLabel')}
              {F('Baire label', 'delivery.outsideLabel')}
              {F('Eto takar beshi kinle free (৳)', 'delivery.freeAbove', { type: 'number', hint: '0 = bondho. Jemon 1000 dile 1000 taka ba beshi hole free' })}
              {F('Eto piece er beshi nile free', 'delivery.freeAboveQty', { type: 'number', hint: '0 = bondho. Jemon 5 dile 5 ta ba beshi nile free' })}
              {F('Currency symbol', 'store.currency')}
            </div>
            <div className="rounded-xl border-2 border-dashed border-[#eebd7a] bg-[#eebd7a]/10 p-4">
              <Toggle label="Sob order e delivery FREE" checked={!!get('delivery.freeAll')} onChange={(v) => set('delivery.freeAll', v)} />
              <p className="mt-2 text-sm text-stone-600">On korle Dhakar vitore-baire sob order e delivery charge 0 hobe (offer er somoy kaje lage). Shudhu kichu product/combo te free dite chaile oi product/combo edit kore "Free delivery" on korun.</p>
            </div>
            <Toggle label="Stock track korbe (order hole stock kombe, stock sesh hole order nibe na)" checked={get('store.trackStock') !== false} onChange={(v) => set('store.trackStock', v)} />
          </>
        )}

        {tab === 'seo' && (
          <>
            {F('Website URL (domain)', 'seo.siteUrl', { placeholder: 'https://rongerbari.com', hint: 'Live korar por obosshoi den — sitemap, Google er jonno lage' })}
            {F('SEO title (Google e je title dekhabe)', 'seo.title')}
            {F('Meta description (Google e niche je lekha)', 'seo.description', { textarea: true, hint: '150-160 character er moddhe' })}
            {F('Keywords (comma diye)', 'seo.keywords', { textarea: true })}
            <ImageInput label="Share image (Facebook e link share korle je chobi dekhabe)" value={get('seo.ogImage')} onChange={(v) => set('seo.ogImage', v)} hint="1200x630 px best" />
            {F('Google Search Console verification code', 'seo.googleVerification', { hint: 'Shudhu content="..." er vitorer code ta' })}
          </>
        )}

        {tab === 'tracking' && (
          <>
            <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
              ID boshiye Save dilei website e auto pixel chole ashbe. Events: PageView, ViewContent, AddToCart, InitiateCheckout, Purchase.
              Access Token dile server-side <b>Conversion API</b> o kaj korbe (iOS / adblocker eo order track hobe, duplicate hobe na).
            </div>
            <h3 className="font-semibold">Facebook (Meta)</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {F('Facebook Pixel ID', 'tracking.fbPixelId', { placeholder: '123456789012345' })}
              {F('Test event code (testing er somoy)', 'tracking.fbTestEventCode', { placeholder: 'TEST12345', hint: 'Test sesh hole faka kore din' })}
            </div>
            {F('Conversion API Access Token', 'tracking.fbAccessToken', { textarea: true, hint: 'Events Manager → Settings → Conversions API → Generate access token. Eta secret, website e dekhay na.' })}
            <h3 className="pt-2 font-semibold">Google & TikTok</h3>
            <div className="grid gap-4 md:grid-cols-3">
              {F('Google Tag Manager ID', 'tracking.gtmId', { placeholder: 'GTM-XXXXXXX' })}
              {F('Google Analytics 4 ID', 'tracking.ga4Id', { placeholder: 'G-XXXXXXXXXX' })}
              {F('TikTok Pixel ID', 'tracking.tiktokPixelId')}
            </div>
            {F('Custom JavaScript (advanced, optional)', 'tracking.customHeadScript', { textarea: true, hint: 'Shudhu JS code — <script> tag chara. Na bujhle faka rakhun.' })}
          </>
        )}

        {tab === 'password' && (
          <div className="max-w-sm space-y-4">
            <Field label="Bortoman password" type="password" value={pw.currentPassword} onChange={(v) => setPw({ ...pw, currentPassword: v })} />
            <Field label="Notun password (6+ character)" type="password" value={pw.newPassword} onChange={(v) => setPw({ ...pw, newPassword: v })} />
            <button className="a-btn" onClick={changePassword}>Password change korun</button>
          </div>
        )}
      </div>
    </div>
  );
}
