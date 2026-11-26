'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useSettingsEditor } from '@/components/admin/useSettingsEditor';
import { ArrayEditor, Field, GalleryItemsEditor, ImageInput, PageHeader, StringListEditor, Tabs, Toggle } from '@/components/admin/ui';

const TABS = [
  { key: 'sections', label: 'Sections' },
  { key: 'hero', label: 'Hero' },
  { key: 'features', label: 'Boishishto' },
  { key: 'productText', label: 'Product / Combo' },
  { key: 'howToUse', label: 'Byabohar' },
  { key: 'galleries', label: 'Gallery' },
  { key: 'media', label: 'Video' },
  { key: 'testimonials', label: 'Review' },
  { key: 'faq', label: 'FAQ' },
  { key: 'order', label: 'Order form' },
  { key: 'custom', label: 'Custom section' },
  { key: 'texts', label: 'Sob lekha' },
  { key: 'design', label: 'Design' },
  { key: 'other', label: 'Announcement & Footer' },
];

// Kon section e kon background deya jabe
const TONES: Record<string, string[]> = {
  hero: ['mist', 'white'],
  order: ['leaf', 'mist', 'white'],
};
const TONE_LABEL: Record<string, string> = { white: 'Sada', mist: 'Halka sobuj', leaf: 'Gaar sobuj' };
const GALLERY_LAYOUTS: [string, string][] = [
  ['masonry', 'Masonry — lomba-choto mile (hater design er jonno best)'],
  ['grid', 'Grid — soman chhoto ghor'],
  ['carousel', 'Carousel — pashe swipe (review screenshot / product)'],
  ['spotlight', 'Spotlight — ekta boro, pashe 4 ta'],
];
const CUSTOM_LABEL: Record<string, string> = { textImage: 'Lekha + chobi', banner: 'Banner / offer', text: 'Shudhu lekha' };

// "Sob lekha" tab: group kore dekhai
const TEXT_GROUPS: { title: string; fields: [string, string][] }[] = [
  {
    title: 'Header',
    fields: [
      ['navCombos', 'Menu: combo'],
      ['navProducts', 'Menu: product'],
      ['navHow', 'Menu: byabohar'],
      ['navFaq', 'Menu: FAQ'],
      ['headerCta', 'Header er button'],
    ],
  },
  { title: 'Hero', fields: [['heroFromPrice', 'Dam er line ({price} = shobcheye kom dam)']] },
  {
    title: 'Product & combo card',
    fields: [
      ['comboSave', 'Combo savings badge ({amount} = koto taka bachbe)'],
      ['comboButton', 'Combo card er button'],
      ['productButton', 'Product card er button'],
    ],
  },
  {
    title: 'Order form',
    fields: [
      ['orderStep1', 'Step 1 er title'],
      ['orderStep2', 'Step 2 er title'],
      ['namePlaceholder', 'Naam er ghor'],
      ['phonePlaceholder', 'Mobile er ghor'],
      ['addressPlaceholder', 'Thikana er ghor'],
      ['notePlaceholder', 'Note er ghor'],
      ['summaryItems', 'Hisab: pondo'],
      ['summaryDelivery', 'Hisab: delivery'],
      ['summaryTotal', 'Hisab: mot'],
      ['freeDelivery', 'Free delivery hole (hisab e)'],
      ['freeBadge', 'Free delivery badge (card e)'],
      ['freeHintAmount', 'Free er kotha ({amount} = ar koto taka)'],
      ['freeHintQty', 'Free er kotha ({count} = ar koto piece)'],
      ['freeApplied', 'Free hoye gele'],
      ['orderLoading', 'Order hobar somoy button e'],
      ['orderTrust', 'Button er nicher lekha'],
      ['errSelect', 'Error: pondo bachai kore ni'],
      ['errPhone', 'Error: vul mobile number'],
      ['errAddress', 'Error: thikana choto'],
    ],
  },
  {
    title: 'Mobile er nicher order bar',
    fields: [
      ['stickyIdle', 'Kichu na nile upore'],
      ['stickyEmpty', 'Kichu na nile niche'],
      ['stickyButton', 'Button'],
      ['whatsappMessage', 'WhatsApp e auto message'],
    ],
  },
  {
    title: 'Product page',
    fields: [
      ['productOrderButton', 'Order button'],
      ['productTrust1', 'Bharsha line 1'],
      ['productTrust2', 'Bharsha line 2'],
      ['productCall', 'Call line'],
      ['productDetails', 'Bistarito heading'],
      ['outOfStock', 'Stock sesh hole'],
    ],
  },
  { title: 'FAQ', fields: [['faqCall', 'Phone number er age lekha']] },
  {
    title: 'Thank-you page',
    fields: [
      ['thanksOrderNo', 'Order number label'],
      ['thanksPay', 'Mot takar label'],
      ['thanksCall', 'Call line'],
      ['thanksHome', 'Home button'],
    ],
  },
  {
    title: 'Footer',
    fields: [
      ['footerContact', 'Jogajog heading'],
      ['footerSocial', 'Social heading'],
    ],
  },
];

const newId = () => Math.random().toString(36).slice(2, 8);

export default function LandingEditor() {
  const { data, get, set, save, saving, dirty } = useSettingsEditor();
  const [tab, setTab] = useState('sections');
  const [device, setDevice] = useState<'mobile' | 'desktop' | 'off'>('mobile');
  const [previewKey, setPreviewKey] = useState(0);

  if (!data) return <p className="text-stone-500">Loading...</p>;

  const saveAndRefresh = async () => {
    await save();
    setPreviewKey((k) => k + 1);
  };

  const sections: any[] = get('sections') || [];
  const customs: any[] = get('customSections') || [];
  const updateSection = (i: number, patch: any) => set('sections', sections.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const moveSection = (i: number, d: number) => {
    const arr = [...sections];
    const j = i + d;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    set('sections', arr);
  };

  const addCustom = (type: string) => {
    const id = newId();
    set('customSections', [
      ...customs,
      { id, type, title: 'Notun section', text: '', image: '', imageSide: 'right', buttonText: '', buttonLink: '#order' },
    ]);
    // Order form er age boshai
    const idx = sections.findIndex((s) => s.key === 'order');
    const arr = [...sections];
    arr.splice(idx >= 0 ? idx : arr.length, 0, { key: `custom-${id}`, label: `Custom: ${CUSTOM_LABEL[type]}`, enabled: true, tone: 'white' });
    set('sections', arr);
  };
  const updateCustom = (id: string, patch: any) => {
    set('customSections', customs.map((b) => (b.id === id ? { ...b, ...patch } : b)));
    if (patch.type) {
      set('sections', sections.map((s) => (s.key === `custom-${id}` ? { ...s, label: `Custom: ${CUSTOM_LABEL[patch.type]}` } : s)));
    }
  };
  const removeCustom = (id: string) => {
    if (!confirm('Ei section ta muche felben?')) return;
    set('customSections', customs.filter((b) => b.id !== id));
    set('sections', sections.filter((s) => s.key !== `custom-${id}`));
  };

  const galleries: any[] = get('galleries') || [];
  const updateGallery = (id: string, patch: any) => set('galleries', galleries.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  const addGallery = () => {
    const id = newId();
    set('galleries', [...galleries, { id, title: 'Notun gallery', subtitle: '', layout: 'masonry', items: [] }]);
    const idx = sections.findIndex((s) => s.key === 'order');
    const arr = [...sections];
    arr.splice(idx >= 0 ? idx : arr.length, 0, { key: `gallery-${id}`, label: 'Gallery: Notun gallery', enabled: true, tone: 'white' });
    set('sections', arr);
  };
  const removeGallery = (id: string) => {
    if (!confirm('Ei gallery ta muche felben? (Cloudinary te chobi thekei jabe)')) return;
    set('galleries', galleries.filter((g) => g.id !== id));
    set('sections', sections.filter((s) => s.key !== `gallery-${id}`));
  };
  const renameGallery = (id: string, title: string) => {
    updateGallery(id, { title });
    set('sections', sections.map((s) => (s.key === `gallery-${id}` ? { ...s, label: `Gallery: ${title}` } : s)));
  };

  const F = (label: string, path: string, opts: { textarea?: boolean; type?: string; hint?: string; placeholder?: string; rows?: number } = {}) => (
    <Field label={label} value={get(path)} onChange={(v) => set(path, v)} {...opts} />
  );

  return (
    <div>
      <PageHeader title="Landing page" desc="Website er protiti lekha, chobi, section, font — sob ekhan theke">
        <div className="hidden items-center rounded-lg border border-stone-300 bg-white p-0.5 text-sm xl:flex">
          {(['mobile', 'desktop', 'off'] as const).map((d) => (
            <button key={d} onClick={() => setDevice(d)} className={`rounded-md px-3 py-1.5 ${device === d ? 'bg-stone-900 text-white' : 'text-stone-600'}`}>
              {d === 'mobile' ? 'Mobile' : d === 'desktop' ? 'Desktop' : 'Preview bondho'}
            </button>
          ))}
        </div>
        <a href="/" target="_blank" className="a-btn-light">Website khulun</a>
        <button className="a-btn" onClick={saveAndRefresh} disabled={saving}>
          {saving ? 'Save hocche…' : dirty ? 'Save korun •' : 'Save'}
        </button>
      </PageHeader>

      <div className={`grid gap-6 ${device !== 'off' ? 'xl:grid-cols-[minmax(0,1fr)_auto]' : ''}`}>
        <div className="min-w-0">
          <Tabs tabs={TABS} active={tab} onChange={setTab} />

          <div className="a-card space-y-5">
            {tab === 'sections' && (
              <>
                <p className="text-sm text-stone-500">↑ ↓ diye order bodlan, switch diye on/off, ar protiti section er background bachun.</p>
                <div className="space-y-2">
                  {sections.map((s, i) => {
                    const tones = TONES[s.key] || ['white', 'mist'];
                    return (
                      <div key={s.key} className="flex flex-wrap items-center gap-3 rounded-lg border border-stone-200 p-3">
                        <div className="min-w-[180px] flex-1">
                          <Toggle label={s.label || s.key} checked={s.enabled} onChange={(v) => updateSection(i, { enabled: v })} />
                        </div>
                        <select className="a-input !w-auto !py-1.5" value={s.tone || tones[0]} onChange={(e) => updateSection(i, { tone: e.target.value })} aria-label="Background">
                          {tones.map((t) => (
                            <option key={t} value={t}>
                              {TONE_LABEL[t]}
                            </option>
                          ))}
                        </select>
                        <div className="flex gap-1">
                          <button className="a-btn-light !px-3 !py-1.5" onClick={() => moveSection(i, -1)} aria-label="Upore">
                            ↑
                          </button>
                          <button className="a-btn-light !px-3 !py-1.5" onClick={() => moveSection(i, 1)} aria-label="Niche">
                            ↓
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-sm text-stone-500">
                  Notun section lagbe?{' '}
                  <button className="font-medium text-[#262d47] underline" onClick={() => setTab('custom')}>
                    Custom section
                  </button>{' '}
                  tab e jan.
                </p>
              </>
            )}

            {tab === 'hero' && (
              <>
                {F('Badge (title er upore choto lekha)', 'hero.badge')}
                {F('Boro title', 'hero.title', { textarea: true, rows: 2 })}
                {F('Subtitle', 'hero.subtitle', { textarea: true })}
                <ImageInput label="Hero chobi" value={get('hero.image')} onChange={(v) => set('hero.image', v)} hint="Lomba (4:5) chobi, 1000px+ hole sobcheye sundor" />
                <div className="grid gap-4 md:grid-cols-2">
                  {F('Main button', 'hero.ctaText')}
                  {F('Main button link', 'hero.ctaLink', { hint: '#order = order form e jabe' })}
                  {F('Duitiyo button', 'hero.secondaryCtaText', { hint: 'Faka rakhle dekhabe na' })}
                  {F('Duitiyo button link', 'hero.secondaryCtaLink')}
                </div>
                <StringListEditor label="Choto highlight (tick chinho diye)" items={get('hero.highlights')} onChange={(v) => set('hero.highlights', v)} />
                <div className="space-y-3 border-t border-stone-100 pt-4">
                  <Toggle label="Shobcheye kom dam dekhabe" checked={get('design.heroShowPrice') !== false} onChange={(v) => set('design.heroShowPrice', v)} />
                  <Toggle label="Mehedi naksha (animation) dekhabe" checked={get('design.heroMehndiArt') !== false} onChange={(v) => set('design.heroMehndiArt', v)} />
                </div>
              </>
            )}

            {tab === 'features' && (
              <>
                {F('Section title', 'features.title')}
                {F('Subtitle', 'features.subtitle')}
                <ArrayEditor
                  label="Boishishto"
                  items={get('features.items')}
                  onChange={(v) => set('features.items', v)}
                  newItem={{ icon: 'leaf', title: '', text: '' }}
                  fields={[
                    { key: 'icon', label: 'Icon: leaf, drop, truck, shield, heart, star, clock, gift' },
                    { key: 'title', label: 'Title' },
                    { key: 'text', label: 'Lekha', type: 'textarea' },
                  ]}
                />
              </>
            )}

            {tab === 'productText' && (
              <>
                <h3 className="font-semibold">Combo section</h3>
                {F('Title', 'combosSection.title')}
                {F('Subtitle', 'combosSection.subtitle')}
                <h3 className="pt-4 font-semibold">Product section</h3>
                {F('Title', 'productsSection.title')}
                {F('Subtitle', 'productsSection.subtitle')}
                <Toggle label="Product card e button dekhabe" checked={get('design.productButtonOnCards') !== false} onChange={(v) => set('design.productButtonOnCards', v)} />
                <p className="text-sm text-stone-500">Product ba combo add/edit korte bam pasher menu theke Products / Combos e jan.</p>
              </>
            )}

            {tab === 'howToUse' && (
              <>
                {F('Section title', 'howToUse.title')}
                <ArrayEditor
                  label="Dhap"
                  items={get('howToUse.steps')}
                  onChange={(v) => set('howToUse.steps', v)}
                  newItem={{ title: '', text: '' }}
                  fields={[
                    { key: 'title', label: 'Title' },
                    { key: 'text', label: 'Lekha', type: 'textarea' },
                  ]}
                />
              </>
            )}

            {tab === 'galleries' && (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="max-w-xl text-sm text-stone-600">
                    Jotogula dorkar gallery banan — hater design, product, review screenshot… Protiti gallery Sections tab e alada section, sekhan theke on/off ar jayga bodlano jay.
                  </p>
                  <button className="a-btn-light" onClick={addGallery}>+ Notun gallery</button>
                </div>
                {galleries.map((g) => {
                  const sec = sections.find((s) => s.key === `gallery-${g.id}`);
                  return (
                    <div key={g.id} className="space-y-4 rounded-xl border border-stone-200 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{g.title || 'Gallery'}</h3>
                          <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600">{(g.items || []).length} chobi</span>
                          {sec && !sec.enabled && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">Website e bondho</span>}
                        </div>
                        <div className="flex gap-2">
                          {sec && (
                            <Toggle label="Dekhabe" checked={sec.enabled} onChange={(v) => updateSection(sections.indexOf(sec), { enabled: v })} />
                          )}
                          <button className="a-btn-light !py-1.5 text-red-700" onClick={() => removeGallery(g.id)}>Delete</button>
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Title" value={g.title} onChange={(v) => renameGallery(g.id, v)} />
                        <Field label="Subtitle" value={g.subtitle} onChange={(v) => updateGallery(g.id, { subtitle: v })} />
                      </div>
                      <label className="block">
                        <span className="a-label">Layout</span>
                        <select className="a-input" value={g.layout || 'masonry'} onChange={(e) => updateGallery(g.id, { layout: e.target.value })}>
                          {GALLERY_LAYOUTS.map(([v, l]) => (
                            <option key={v} value={v}>{l}</option>
                          ))}
                        </select>
                      </label>
                      <GalleryItemsEditor items={g.items} onChange={(v) => updateGallery(g.id, { items: v })} />
                    </div>
                  );
                })}
                {!galleries.length && <p className="text-sm text-stone-400">Kono gallery nai. "+ Notun gallery" e click korun.</p>}
              </>
            )}

            {tab === 'media' && (
              <>
                <h3 className="font-semibold">Video</h3>
                {F('Title', 'video.title')}
                {F('YouTube link', 'video.youtubeUrl', { placeholder: 'https://youtu.be/xxxx', hint: 'Sections tab e "Video" on korte bhulben na' })}
              </>
            )}

            {tab === 'testimonials' && (
              <>
                {F('Section title', 'testimonials.title')}
                <ArrayEditor
                  label="Customer review"
                  items={get('testimonials.items')}
                  onChange={(v) => set('testimonials.items', v)}
                  newItem={{ name: '', location: '', text: '', rating: 5, image: '' }}
                  fields={[
                    { key: 'name', label: 'Naam' },
                    { key: 'location', label: 'Jayga' },
                    { key: 'rating', label: 'Rating (1-5)', type: 'number' },
                    { key: 'text', label: 'Review', type: 'textarea' },
                    { key: 'image', label: 'Chobi (na dile naam er prothom okkhor)', type: 'image' },
                  ]}
                />
              </>
            )}

            {tab === 'faq' && (
              <>
                {F('Section title', 'faq.title')}
                <ArrayEditor
                  label="Proshno-uttor"
                  items={get('faq.items')}
                  onChange={(v) => set('faq.items', v)}
                  newItem={{ q: '', a: '' }}
                  fields={[
                    { key: 'q', label: 'Proshno' },
                    { key: 'a', label: 'Uttor', type: 'textarea' },
                  ]}
                />
              </>
            )}

            {tab === 'order' && (
              <>
                {F('Title', 'orderSection.title')}
                {F('Subtitle', 'orderSection.subtitle')}
                {F('Order button', 'orderSection.buttonText')}
                {F('Thank-you page title', 'orderSection.successTitle')}
                {F('Thank-you page message', 'orderSection.successMessage', { textarea: true })}
                <p className="text-sm text-stone-500">
                  Form er placeholder ar error message{' '}
                  <button className="font-medium text-[#262d47] underline" onClick={() => setTab('texts')}>
                    Sob lekha
                  </button>{' '}
                  tab e. Delivery charge: Settings → Delivery.
                </p>
              </>
            )}

            {tab === 'custom' && (
              <>
                <div>
                  <p className="text-sm text-stone-600">Notun section add korun. Add korle Sections tab e order form er age boshbe — sekhan theke jekono jaygay sorate parben.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button className="a-btn-light" onClick={() => addCustom('textImage')}>+ Lekha + chobi</button>
                    <button className="a-btn-light" onClick={() => addCustom('banner')}>+ Banner / offer</button>
                    <button className="a-btn-light" onClick={() => addCustom('text')}>+ Shudhu lekha</button>
                  </div>
                </div>
                {customs.map((b) => (
                  <div key={b.id} className="space-y-4 rounded-xl border border-stone-200 bg-stone-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <select className="a-input !w-auto" value={b.type} onChange={(e) => updateCustom(b.id, { type: e.target.value })} aria-label="Section er dhoron">
                        <option value="textImage">Lekha + chobi</option>
                        <option value="banner">Banner / offer</option>
                        <option value="text">Shudhu lekha</option>
                      </select>
                      <button className="a-btn-light !py-1.5 text-red-700" onClick={() => removeCustom(b.id)}>
                        Delete
                      </button>
                    </div>
                    <Field label="Title" value={b.title} onChange={(v) => updateCustom(b.id, { title: v })} />
                    <Field label="Lekha" textarea rows={4} value={b.text} onChange={(v) => updateCustom(b.id, { text: v })} />
                    {b.type === 'textImage' && (
                      <>
                        <ImageInput label="Chobi" value={b.image} onChange={(v) => updateCustom(b.id, { image: v })} />
                        <label className="block">
                          <span className="a-label">Chobi kon pashe (desktop e)</span>
                          <select className="a-input !w-auto" value={b.imageSide} onChange={(e) => updateCustom(b.id, { imageSide: e.target.value })}>
                            <option value="right">Dane</option>
                            <option value="left">Bame</option>
                          </select>
                        </label>
                      </>
                    )}
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Button (faka = button nai)" value={b.buttonText} onChange={(v) => updateCustom(b.id, { buttonText: v })} />
                      <Field label="Button link" value={b.buttonLink} onChange={(v) => updateCustom(b.id, { buttonLink: v })} />
                    </div>
                  </div>
                ))}
                {!customs.length && <p className="text-sm text-stone-400">Ekhono kono custom section nai.</p>}
              </>
            )}

            {tab === 'texts' && (
              <div className="space-y-8">
                <p className="text-sm text-stone-500">
                  Website er sob button, label, placeholder ar error message. {'{price}'} ba {'{amount}'} thakle oikhane auto dam boshbe.
                </p>
                {TEXT_GROUPS.map((g) => (
                  <div key={g.title}>
                    <h3 className="mb-3 font-semibold">{g.title}</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {g.fields.map(([k, label]) => (
                        <div key={k}>{F(label, `texts.${k}`)}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'design' && (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="a-label">Heading font</span>
                    <select className="a-input" value={get('design.fontDisplay') || 'tiro'} onChange={(e) => set('design.fontDisplay', e.target.value)}>
                      <option value="tiro">Tiro Bangla — klasik, boi-er moto</option>
                      <option value="notoSerif">Noto Serif Bengali — porishkar serif</option>
                      <option value="galada">Galada — haate lekha, utsob</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="a-label">Lekha (body) font</span>
                    <select className="a-input" value={get('design.fontBody') || 'anek'} onChange={(e) => set('design.fontBody', e.target.value)}>
                      <option value="anek">Anek Bangla — modern</option>
                      <option value="hind">Hind Siliguri — porichito</option>
                      <option value="notoSans">Noto Sans Bengali — simple</option>
                    </select>
                  </label>
                </div>
                <div className="space-y-3 border-t border-stone-100 pt-4">
                  <Toggle label="Mobile e nicher order bar" checked={get('design.showStickyBar') !== false} onChange={(v) => set('design.showStickyBar', v)} />
                  <Toggle label="Order bar e WhatsApp button" checked={get('design.showWhatsApp') !== false} onChange={(v) => set('design.showWhatsApp', v)} />
                  <Toggle label="Header e phone number" checked={get('design.showHeaderPhone') !== false} onChange={(v) => set('design.showHeaderPhone', v)} />
                  <Toggle label="Header e menu" checked={get('design.showHeaderNav') !== false} onChange={(v) => set('design.showHeaderNav', v)} />
                </div>
                <p className="text-sm text-stone-500">Rong bodlate: Settings → General & Logo → Theme color.</p>
              </>
            )}

            {tab === 'other' && (
              <>
                <Toggle label="Announcement bar (sobar upore)" checked={!!get('announcement.enabled')} onChange={(v) => set('announcement.enabled', v)} />
                {F('Announcement lekha', 'announcement.text')}
                {F('Announcement link (optional)', 'announcement.link', { placeholder: '#order' })}
                <h3 className="pt-4 font-semibold">Footer</h3>
                {F('Footer lekha', 'footer.text', { textarea: true })}
                {F('Copyright', 'footer.copyright')}
                <ArrayEditor
                  label="Footer link (Privacy policy, Return policy…)"
                  items={get('footer.links')}
                  onChange={(v) => set('footer.links', v)}
                  newItem={{ label: '', url: '' }}
                  fields={[
                    { key: 'label', label: 'Lekha' },
                    { key: 'url', label: 'Link' },
                  ]}
                />
              </>
            )}
          </div>
        </div>

        {device !== 'off' && (
          <div className="hidden xl:block">
            <div className="sticky top-6">
              <div className="mb-2 flex items-center justify-between text-xs text-stone-500">
                <span>Live preview{dirty ? ' — save korle update hobe' : ''}</span>
                <button className="underline" onClick={() => setPreviewKey((k) => k + 1)}>
                  Reload
                </button>
              </div>
              <div className={`overflow-hidden rounded-[22px] border-[6px] border-stone-800 bg-white shadow-xl ${device === 'mobile' ? 'h-[760px] w-[390px]' : 'h-[640px] w-[560px]'}`}>
                <iframe
                  key={`${previewKey}-${device}`}
                  src="/"
                  title="Website preview"
                  className={device === 'mobile' ? 'h-full w-full' : 'h-[1280px] w-[1120px] origin-top-left scale-50'}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-4 mt-6 flex justify-end">
        <button className="a-btn !px-8 !py-3 shadow-xl" onClick={saveAndRefresh} disabled={saving}>
          {saving ? 'Save hocche…' : 'Sob change save korun'}
        </button>
      </div>
    </div>
  );
}
