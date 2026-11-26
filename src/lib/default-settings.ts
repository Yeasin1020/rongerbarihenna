/**
 * Landing page er default content. Admin panel theke sob change kora jay —
 * ekhane edit korar dorkar nai. Database e kichu na thakle egula dekhabe.
 */
export const DEFAULT_SETTINGS = {
  // Brand er version — purono save kora rong/logo notun brand e update korar jonno
  brandVersion: 2,
  siteName: 'RongerBari Henna',
  tagline: 'রঙের বাড়ি — খাঁটি অর্গানিক মেহেদি',
  logo: '/brand/logo.png',
  favicon: '',

  // Logo theke: navy + sonali (gold). Admin > Settings theke bodlano jay
  theme: {
    primary: '#262d47', // navy — header lekha, order section, footer
    accent: '#94642c', // gaar sonali/bronze — dam, badge (sada background e porte shubidha)
    highlight: '#eebd7a', // sonali — order button
    background: '#f1f0f5', // halka navy-sada — alternate section
    text: '#171b2c',
  },

  store: {
    currency: '৳',
    trackStock: true,
  },

  // Design: font ar kon jinish dekhabe
  design: {
    fontDisplay: 'tiro', // tiro | notoSerif | galada
    fontBody: 'anek', // anek | hind | notoSans
    showStickyBar: true, // mobile e nicher order bar
    showWhatsApp: true, // sticky bar e WhatsApp button
    showHeaderPhone: true,
    showHeaderNav: true,
    showSiteNameWithLogo: true, // header e logo er pashe naam
    heroShowPrice: true, // hero te "dam shuru ৳.. theke"
    heroMehndiArt: true, // hero te mehedi naksha
    productButtonOnCards: true,
  },

  contact: {
    phone: '01XXXXXXXXX',
    whatsapp: '01XXXXXXXXX',
    email: '',
    address: 'ঢাকা, বাংলাদেশ',
    facebook: 'https://www.facebook.com/profile.php?id=61579613190609',
    instagram: '',
    youtube: '',
    tiktok: '',
  },

  announcement: {
    enabled: true,
    link: '',
    text: 'সারা বাংলাদেশে ক্যাশ অন ডেলিভারি — পণ্য হাতে পেয়ে টাকা দিন',
  },

  // Landing page er section gula — order change, on/off admin panel theke
  sections: [
    { key: 'hero', label: 'Hero (upore boro ongsho)', enabled: true, tone: 'leaf' },
    { key: 'features', label: 'Boishishto', enabled: true, tone: 'white' },
    { key: 'gallery-products', label: 'Gallery: amader kon', enabled: true, tone: 'mist' },
    { key: 'combos', label: 'Combo offer', enabled: true, tone: 'white' },
    { key: 'products', label: 'Product', enabled: true, tone: 'mist' },
    { key: 'gallery-results', label: 'Gallery: hate mehedi', enabled: true, tone: 'white' },
    { key: 'howToUse', label: 'Byabohar er niyom', enabled: true, tone: 'mist' },
    { key: 'video', label: 'Video', enabled: false, tone: 'white' },
    { key: 'gallery-making', label: 'Gallery: kon toiri', enabled: true, tone: 'white' },
    { key: 'testimonials', label: 'Customer review', enabled: true, tone: 'mist' },
    { key: 'gallery-reviews', label: 'Gallery: review screenshot', enabled: true, tone: 'white' },
    { key: 'faq', label: 'Proshno-uttor (FAQ)', enabled: true, tone: 'white' },
    { key: 'order', label: 'Order form', enabled: true, tone: 'leaf' },
  ] as { key: string; label: string; enabled: boolean; tone?: string }[],


  hero: {
    badge: '১০০% অর্গানিক • কেমিক্যাল মুক্ত',
    title: 'হাত রাঙান খাঁটি মেহেদিতে',
    subtitle:
      'রঙের বাড়ির মেহেদি তৈরি হয় বাছাই করা মেহেদি পাতা থেকে — গাঢ় মেরুন রং, মিষ্টি ঘ্রাণ আর ত্বকের জন্য সম্পূর্ণ নিরাপদ।',
    image: '/gallery/cones-blue-2.jpg',
    ctaText: 'অর্ডার করুন',
    ctaLink: '#order',
    secondaryCtaText: 'কম্বো দেখুন',
    secondaryCtaLink: '#combos',
    highlights: ['ক্যাশ অন ডেলিভারি', '২৪-৭২ ঘণ্টায় ডেলিভারি', 'রং না আসলে টাকা ফেরত'],
  },

  features: {
    title: 'কেন রঙের বাড়ির মেহেদি?',
    subtitle: 'হাজারো কাস্টমারের আস্থার নাম',
    // icon: leaf | drop | truck | shield | heart | star | clock | gift
    items: [
      { icon: 'leaf', title: '১০০% প্রাকৃতিক', text: 'কোনো কেমিক্যাল বা PPD নেই, শিশুদের হাতেও নিশ্চিন্তে লাগান।' },
      { icon: 'drop', title: 'গাঢ় রং', text: '৬-৮ ঘণ্টায় গাঢ় মেরুন রং আসে, থাকে ১০-১৫ দিন।' },
      { icon: 'truck', title: 'দ্রুত ডেলিভারি', text: 'ঢাকায় ২৪ ঘণ্টা, ঢাকার বাইরে ৪৮-৭২ ঘণ্টায়।' },
      { icon: 'shield', title: 'রং না এলে টাকা ফেরত', text: 'পছন্দ না হলে পুরো টাকা ফেরত দিই।' },
    ],
  },

  productsSection: {
    title: 'আমাদের প্রোডাক্ট',
    subtitle: 'পছন্দের প্রোডাক্ট বেছে নিন',
  },

  combosSection: {
    title: 'কম্বো অফার',
    subtitle: 'একসাথে নিলে দাম কম পড়ে — ঈদ, বিয়ে আর গায়ে হলুদের জন্য',
  },

  howToUse: {
    title: 'ব্যবহারের নিয়ম',
    steps: [
      { title: 'হাত পরিষ্কার করুন', text: 'সাবান দিয়ে হাত ধুয়ে ভালোভাবে শুকিয়ে নিন।' },
      { title: 'ডিজাইন করুন', text: 'কোনের মুখ কেটে পছন্দমতো ডিজাইন করুন।' },
      { title: '৬-৮ ঘণ্টা রাখুন', text: 'শুকিয়ে গেলে লেবু-চিনির পানি লাগান।' },
      { title: 'তুলে ফেলুন', text: 'পানি ছাড়া ঘষে তুলুন, ১২ ঘণ্টা পানি এড়িয়ে চলুন।' },
    ],
  },

  video: {
    title: 'দেখুন কেমন রং আসে',
    youtubeUrl: '',
  },

  // Purono single gallery (compat er jonno thake) — notun gallery gula niche "galleries" e
  gallery: {
    title: 'কাস্টমারদের হাতে আমাদের মেহেদি',
    images: [] as string[],
  },

  // Onekgula gallery. Protiti gallery Sections e "gallery-<id>" hisebe thake.
  // layout: masonry (pinterest er moto) | grid (soman chhoto ghor) | carousel (pashe swipe) | spotlight (ekta boro + baki chhoto)
  galleries: [
    {
      id: 'results',
      title: 'হাতে মেহেদি — ডিজাইন আর রঙ',
      subtitle: 'আমাদের কোন দিয়ে আঁকা কিছু ডিজাইন। ছবিতে চাপ দিলে বড় করে দেখা যাবে।',
      layout: 'masonry',
      items: [
        { image: '/gallery/hand-stain-1.jpg', caption: 'শুকানোর পর গাঢ় রঙ' },
        { image: '/gallery/hand-design-outdoor.jpg', caption: 'আঙুল আর হাতের পিঠে ডিজাইন' },
        { image: '/gallery/hand-design-full.jpg', caption: 'হাতের পিঠে ফুল ডিজাইন' },
        { image: '/gallery/hand-design-green-cone.jpg', caption: 'সহজ আঙুলের ডিজাইন' },
        { image: '/gallery/hand-stain-2.jpg', caption: 'রঙ আসার পর' },
        { image: '/gallery/hand-design-closeup.jpg', caption: 'জালি আর ফুলের ডিজাইন' },
        { image: '/gallery/hand-design-side.jpg', caption: 'হাতের পাশে ডিজাইন' },
        { image: '/gallery/hand-design-kids.jpg', caption: 'ছোটদের হাতে' },
        { image: '/gallery/hand-design-silver-cone.jpg', caption: 'ফুল হাতের ডিজাইন' },
        { image: '/gallery/hand-design-phone-1.jpg', caption: '' },
        { image: '/gallery/hand-design-phone-2.jpg', caption: '' },
      ],
    },
    {
      id: 'products',
      title: 'আমাদের মেহেদি কোন',
      subtitle: 'লার্জ, মিডিয়াম আর স্মল — তিন সাইজে',
      layout: 'carousel',
      items: [
        { image: '/gallery/cones-sizes.jpg', caption: 'লার্জ, মিডিয়াম আর স্মল কোন' },
        { image: '/gallery/cone-large.jpg', caption: 'লার্জ কোন — ২৫-২৮ গ্রাম' },
        { image: '/gallery/cone-small.jpg', caption: 'স্মল কোন — ১৫-১৮ গ্রাম' },
        { image: '/gallery/cones-blue-2.jpg', caption: '' },
        { image: '/gallery/cones-grass.jpg', caption: '' },
        { image: '/gallery/cones-blue-1.jpg', caption: '' },
      ],
    },
    {
      id: 'making',
      title: 'কোন তৈরির কিছু মুহূর্ত',
      subtitle: 'শিট কেটে কোন বানানো থেকে প্যাকিং',
      layout: 'spotlight',
      items: [
        { image: '/gallery/cone-sheets-2.jpg', caption: 'কোন বানানোর শিট' },
        { image: '/gallery/empty-cones.jpg', caption: 'খালি কোন' },
        { image: '/gallery/cone-sheets-1.jpg', caption: '' },
      ],
    },
    {
      id: 'reviews',
      title: 'কাস্টমাররা যা পাঠিয়েছেন',
      subtitle: 'ফেসবুক পেজে আসা মেসেজ আর ছবি',
      layout: 'carousel',
      items: [] as { image: string; caption: string }[],
    },
  ] as { id: string; title: string; subtitle: string; layout: string; items: { image: string; caption: string }[] }[],

  testimonials: {
    title: 'কাস্টমার যা বলছেন',
    items: [
      { name: 'সুমাইয়া আক্তার', location: 'ঢাকা', text: 'এত গাঢ় রং আগে কোনো মেহেদিতে পাইনি! ঘ্রাণটাও অসাধারণ।', rating: 5, image: '' },
      { name: 'নুসরাত জাহান', location: 'চট্টগ্রাম', text: 'ডেলিভারি খুব দ্রুত পেয়েছি, প্যাকেজিংও সুন্দর।', rating: 5, image: '' },
      { name: 'তানিয়া ইসলাম', location: 'গাজীপুর', text: 'বিয়ের জন্য কম্বো নিয়েছিলাম, সবাই প্রশংসা করেছে।', rating: 5, image: '' },
    ],
  },

  faq: {
    title: 'সচরাচর জিজ্ঞাসা',
    items: [
      { q: 'মেহেদিতে কি কেমিক্যাল আছে?', a: 'না, আমাদের মেহেদি ১০০% প্রাকৃতিক উপাদানে তৈরি।' },
      { q: 'কতদিনে ডেলিভারি পাব?', a: 'ঢাকার ভিতরে ২৪-৪৮ ঘণ্টা, ঢাকার বাইরে ৪৮-৭২ ঘণ্টা।' },
      { q: 'টাকা কিভাবে দিব?', a: 'পণ্য হাতে পেয়ে ডেলিভারি ম্যানকে টাকা দিবেন (ক্যাশ অন ডেলিভারি)।' },
      { q: 'মেহেদি কতদিন ভালো থাকে?', a: 'ফ্রিজে রাখলে ৩ মাস, বাইরে ১ মাস পর্যন্ত ভালো থাকে।' },
    ],
  },

  orderSection: {
    title: 'অর্ডার করতে নিচের ফর্মটি পূরণ করুন',
    subtitle: 'ক্যাশ অন ডেলিভারি — পণ্য হাতে পেয়ে টাকা দিন',
    buttonText: 'অর্ডার কনফার্ম করুন',
    successTitle: 'ধন্যবাদ! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে',
    successMessage: 'আমাদের প্রতিনিধি খুব শীঘ্রই আপনাকে কল করে অর্ডারটি কনফার্ম করবেন।',
  },

  delivery: {
    insideDhaka: 70,
    outsideDhaka: 130,
    insideLabel: 'ঢাকার ভিতরে',
    outsideLabel: 'ঢাকার বাইরে',
    freeAll: false, // true = sob order e delivery free
    freeAbove: 0, // eto takar beshi kinle free (0 = bondho)
    freeAboveQty: 0, // eto piece er beshi nile free (0 = bondho)
  },

  footer: {
    text: 'রঙের বাড়ি — প্রাকৃতিক সৌন্দর্যের বিশ্বস্ত ঠিকানা।',
    copyright: '© RongerBari Henna. সর্বস্বত্ব সংরক্ষিত।',
    links: [] as { label: string; url: string }[],
  },

  // Admin theke banano notun section (Sections tab e "custom-<id>" hisebe thake)
  // type: textImage (lekha + chobi) | banner (rong-er upor boro lekha + button) | text (shudhu lekha)
  customSections: [] as {
    id: string;
    type: 'textImage' | 'banner' | 'text';
    title: string;
    text: string;
    image: string;
    imageSide: 'left' | 'right';
    buttonText: string;
    buttonLink: string;
  }[],

  // Website er sob choto lekha — button, label, placeholder, error. {price} {amount} egula auto boshe.
  texts: {
    navCombos: 'কম্বো',
    navProducts: 'প্রোডাক্ট',
    navHow: 'ব্যবহারের নিয়ম',
    navFaq: 'জিজ্ঞাসা',
    headerCta: 'অর্ডার করুন',

    heroFromPrice: 'দাম শুরু {price} থেকে',

    comboSave: '{amount} সাশ্রয়',
    comboButton: 'নিন',
    productButton: 'অর্ডারে যোগ করুন',

    orderStep1: 'পণ্য বাছাই করুন',
    orderStep2: 'আপনার তথ্য দিন',
    namePlaceholder: 'আপনার নাম',
    phonePlaceholder: 'মোবাইল নাম্বার (01XXXXXXXXX)',
    addressPlaceholder: 'পুরো ঠিকানা — বাসা, এলাকা, থানা, জেলা',
    notePlaceholder: 'কিছু বলার থাকলে লিখুন (না লিখলেও চলবে)',
    summaryItems: 'পণ্য',
    summaryDelivery: 'ডেলিভারি চার্জ',
    summaryTotal: 'মোট',
    freeDelivery: 'ফ্রি',
    freeBadge: 'ফ্রি ডেলিভারি',
    freeHintAmount: 'আর {amount} কিনলে ডেলিভারি ফ্রি',
    freeHintQty: 'আর {count}টি নিলে ডেলিভারি ফ্রি',
    freeApplied: 'আপনার অর্ডারে ডেলিভারি ফ্রি',
    orderTrust: 'পণ্য হাতে পেয়ে টাকা দিন — অগ্রিম লাগবে না',
    orderLoading: 'অর্ডার নেওয়া হচ্ছে…',
    errSelect: 'অন্তত একটি পণ্য বাছাই করুন',
    errPhone: '১১ ডিজিটের সঠিক মোবাইল নাম্বার দিন, যেমন 01712345678',
    errAddress: 'বাসা, এলাকা, থানা ও জেলা সহ পুরো ঠিকানা লিখুন',

    stickyIdle: 'ক্যাশ অন ডেলিভারি',
    stickyEmpty: 'পণ্য বাছাই করুন',
    stickyButton: 'অর্ডার করুন',
    whatsappMessage: 'আসসালামু আলাইকুম, আমি মেহেদি অর্ডার করতে চাই',

    productOrderButton: 'অর্ডার করুন',
    productTrust1: 'পণ্য হাতে পেয়ে টাকা দিন',
    productTrust2: 'সারা বাংলাদেশে হোম ডেলিভারি',
    productCall: 'কল করে অর্ডার:',
    productDetails: 'বিস্তারিত',
    outOfStock: 'এই মুহূর্তে স্টকে নেই',

    faqCall: 'উত্তর না পেলে কল করুন',

    thanksOrderNo: 'অর্ডার নাম্বার',
    thanksPay: 'ডেলিভারির সময় দিবেন',
    thanksCall: 'কিছু জানতে চাইলে কল করুন',
    thanksHome: 'হোম পেজে ফিরুন',

    footerContact: 'যোগাযোগ',
    footerSocial: 'আমাদের পেজ',
  },

  seo: {
    title: 'RongerBari Henna | খাঁটি অর্গানিক মেহেদি',
    description:
      'রঙের বাড়ি — ১০০% অর্গানিক, কেমিক্যাল মুক্ত মেহেদি কোন ও হেয়ার মেহেদি। সারা বাংলাদেশে ক্যাশ অন ডেলিভারি।',
    keywords: 'mehedi, organic mehedi, henna, mehendi cone, মেহেদি, অর্গানিক মেহেদি, RongerBari Henna, Ronger Bari Henna, রঙের বাড়ি হেনা',
    ogImage: '/brand/og.jpg',
    siteUrl: '',
    googleVerification: '',
  },

  tracking: {
    fbPixelId: '',
    fbAccessToken: '', // Conversion API (server-side) — kokhono public hoy na
    fbTestEventCode: '',
    gtmId: '',
    ga4Id: '',
    tiktokPixelId: '',
    customHeadScript: '',
  },
};

export type SiteSettings = typeof DEFAULT_SETTINGS;
