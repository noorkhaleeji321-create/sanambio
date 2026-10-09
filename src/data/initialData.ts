import { ProductOffer, Order, CustomerReview, Coupon, StoreSettings, PainPoint } from '../types/store';

export const MOROCCAN_CITIES = [
  'الدار البيضاء (Casablanca)',
  'الرباط (Rabat)',
  'مراكش (Marrakech)',
  'طنجة (Tanger)',
  'فاس (Fès)',
  'أكادير (Agadir)',
  'مكناس (Meknès)',
  'وجدة (Oujda)',
  'القنيطرة (Kénitra)',
  'تطوان (Tétouan)',
  'تمارة (Témara)',
  'سلا (Salé)',
  'المحمدية (Mohammédia)',
  'العيون (Laâyoune)',
  'الداخلة (Dakhla)',
  'بني ملال (Béni Mellal)',
  'الجديدة (El Jadida)',
  'خريبكة (Khouribga)',
  'الناظور (Nador)',
  'تازة (Taza)',
  'سطات (Settat)',
  'برشيد (Berrechid)',
  'الخميسات (Khémisset)',
  'العرائش (Larache)',
  'القصر الكبير (Ksar El Kébir)',
  'كلميم (Guelmim)',
  'الصويرة (Essaouira)',
  'ورزازات (Ouarzazate)',
  'تارودانت (Taroudant)',
  'بركان (Berkane)',
  'سيدي قاسم (Sidi Kacem)',
  'خنيفرة (Khénifra)',
  'تاونات (Taounate)',
  'سيدي سليمان (Sidi Slimane)',
  'ميدلت (Midelt)',
  'أزيلال (Azilal)',
  'تيزنيت (Tiznit)',
  'مدينة أخرى بالمغرب'
];

export const INITIAL_OFFERS: ProductOffer[] = [
  {
    id: 'offer-1',
    title: 'علبة واحدة (100ml)',
    subtitle: 'تجربة العلاج الأولية',
    quantity: 1,
    price: 199,
    originalPrice: 299,
    discountPercentage: 33,
    popular: false,
    bestValue: false,
    tag: 'تجربة أولية',
    freeShipping: true,
    description: 'تكفي لمدة 3 إلى 4 أسابيع من الاستعمال المنتظم لتخفيف الآلام اليومية.'
  },
  {
    id: 'offer-2',
    title: '2 علب + هدية مجانية',
    subtitle: 'كورس العلاج المكثف',
    quantity: 2,
    price: 299,
    originalPrice: 598,
    discountPercentage: 50,
    popular: false,
    bestValue: false,
    tag: 'تخفيض 50%',
    freeShipping: true,
    freeGift: 'صابونة الكبريت والأعشاب الطبيعية مجاناً 🎁',
    description: 'كورس موصى به لتخفيف الاحتكاك وتسكين آلام المفاصل والظهر.'
  },
  {
    id: 'offer-3',
    title: '4 علب + علبة مجاناً (5 علب)',
    subtitle: 'الباقة العائلية الاقتصادية الكبرى (العلاج الجذري المتكامل)',
    quantity: 5,
    price: 399,
    originalPrice: 995,
    discountPercentage: 60,
    popular: true,
    bestValue: true,
    tag: 'الباقة الأساسية الأوفر والأكثر طلباً 🔥',
    freeShipping: true,
    freeGift: 'علبة خامسة مجاناً + صابونة الأعشاب الطبيعية 🎁',
    description: 'العرض الأقوى والأوفر على الإطلاق: كورس علاجي متكامل ومثالي للاستخدام العائلي أو لحالات الآلام المزمنة الشديدة لضمان الشفاء التام وحماية الغضاريف على المدى الطويل.'
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'Sanambio Maroc',
  brandTagline: 'دهن سنام الجمل الطبيعي 100% الأصلي',
  logoUrl: 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/images/camel_joint_cream_jar.jpg',
  networkStatusIconUrl: '',
  phone: '+212 661-894520',
  whatsappNumber: '+212661894520',
  whatsappSupportUrl: 'https://wa.me/212661894520',
  adminPin: '1234',
  heroHeadline: 'تخلص نهائياً من آلام المفاصل والظهر واستعد حريتك في الحركة بدون ألم',
  heroSubheadline: 'التركيبة الصحراوية الأصلية المستخلصة من دهن سنام الجمل الطبيعي 100%، فعالية مثبتة في تخفيف الالتهابات، خشونة الركبة، وعرق النسا (بوزلوم) من أول أسبوع.',
  announcementText: '🔥 عرض خاص اليوم فقط: تخفيض يصل إلى 50% + توصيل بالمجان والدفع بعد استلام وفحص المنتج في جميع مدن المغرب',
  enableAnnouncement: true,
  enableStockTicker: true,
  initialStock: 150,
  remainingStock: 19,
  currency: 'درهم',
  freeShippingThreshold: 0,
  guaranteeDays: 30,
  deliveryEstimate: '24 إلى 48 ساعة كحد أقصى',
  enableFloatingBackground: true,
  floatingBackgroundTheme: 'all',
  media: {
    logoUrl: 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/branding/1791456167148_653709227_122105396001285073_676431221204038800_n.jpg',
    networkStatusIconUrl: '',
    heroProductImage: 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/gallery/1791533269028_1000pexel.jpg',
    productGallery: [
      'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/gallery/1791533269028_1000pexel.jpg',
      'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/gallery/1791534309210_1000pixel22222.jpg',
      'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/gallery/1791534755142_pexel1000_4444.jpg',
      'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/gallery/1791534780908_pexel1000_33333.jpg',
      'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/gallery/1791535357989_66666pexel.jpg',
      'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/gallery/1791535376677_ec51d75b-3a35-455c-b478-460989ce19c7.jpg'
    ],
    autoSlideGallery: true,
    gallerySpeed: 5000,
    lifestyleImage: 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/images/1791499254307_Gemini_Generated_Image_qydgyrqydgyrqydg.jpg',
    anatomicalImage: 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/images/1791459145261_7a11670f-60ae-483f-a2c0-2b396398d2cb.jpg',
    painAreaImages: {
      knee: 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/pain_areas/knee_cartilage.jpg',
      spine: 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/pain_areas/spine_lumbar.jpg',
      sciatica: 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/pain_areas/sciatica_nerve.jpg',
      neck: 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/pain_areas/neck_shoulder.jpg',
      joints: 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/pain_areas/hand_joints_rheumatism.jpg'
    },
    doctorVideoUrl: 'https://youtu.be/yPDfuwox5Oo',
    doctorVideoPoster: 'https://img.youtube.com/vi/yPDfuwox5Oo/maxresdefault.jpg',
    doctorChannelName: 'Dr. Younes Health',
    doctorSubText: 'الصحة مفهومة في 60 ثانية'
  },
  payment: {
    enableCod: true,
    codLabel: 'الدفع عند الاستلام (COD) - بعد معاينة الطرد',
    enableBankTransfer: false,
    bankTransferLabel: 'تحويل بنكي مباشر (Virement Bancaire)',
    bankDetails: 'Attijariwafa Bank - RIB: 007 780 0001234567890123 45 (Sanambio SARL)',
    shippingCost: 0,
    freeShippingLabel: 'توصيل مجاني لجميع مدن المغرب (0 درهم)',
    checkoutButtonText: 'تأكيد الطلب الآن (الدفع عند الاستلام)',
    orderSuccessTitle: 'تم تسجيل طلبك بنجاح!',
    orderSuccessMessage: 'سيتصل بك فريق خدمة العملاء خلال ساعات لتأكيد موعد الشحن والتسليم.'
  },
  aiBot: {
    enabled: true,
    botName: 'د. يونس',
    botRoleTitle: 'استشاري جراحة المفاصل والعظام وخبير الطب التكميلي بـ SanamBio',
    geminiApiKey: '',
    tone: 'persuasive_doctor',
    welcomeMessage: 'السلام عليكم ورحمة الله وبركاته 🩺 مرحباً بك أخي / أختي الفاضلة!\nمعك الدكتور يونس، المستشار الطبي لخبير علاج المفاصل والغضاريف بـ SanamBio 🐪🌿.\n\nصحتك وراحتك هي رأس مالك.. كيف نقدر نعاونك اليوم؟ واش كتعاني من شي ألم في المفاصل (الركبة، الظهر، بوزلوم...)، أو باغي استشارة على أفضل باقة مناسبة لحالتك؟',
    suggestedQuestions: [
      'السلام عليكم دكتور، بغيت استشارة طبية 🩺',
      'عندي خشونة وألم حاد في الركبة والغضروف 🦵',
      'كنعاني من عرق النسا (بوزلوم) وأسفل الظهر ⚡',
      'علاش باقة 4 علب + علبة مجاناً هي الأفضل لعلاج المفاصل؟ 🔥',
      'شحال ثمن العروض وكيفاش نستافد من التوصيل المجاني؟ 🏷️'
    ]
  },
  pixel: {
    facebookPixelId: '',
    enableFacebookPixel: true,
    tiktokPixelId: '',
    enableTiktokPixel: true,
    googleAnalyticsId: '',
    enableGoogleAnalytics: false,
    trackPageView: true,
    trackViewContent: true,
    trackAddToCart: true,
    trackInitiateCheckout: true,
    trackPurchase: true,
    trackLead: true,
    trackContact: true,
    testEventMode: false
  },
  seo: {
    metaTitle: 'دهن سنام الجمل Sanambio® الأصلي بالمغرب | علاج طبيعي لآلام المفاصل والظهر',
    metaDescription: 'دهن سنام الجمل Sanambio الأصلي 100% للتخلص من آلام المفاصل، الروماتيزم، خشونة الركبة، والظهر وعرق النسا (السياتيك). نتائج مضمونة وسريعة مع توصيل بالمجان والدفع بعد المعاينة.',
    keywords: 'دهن سنام الجمل الأصلي, علاج آلام المفاصل, علاج خشونة الركبة, دهن سنام الجمل المغرب, علاج عرق النسا, سياتيك, شحم سنام الجمل, مرهم المفاصل, Sanambio Maroc',
    googleSiteVerification: 'pjRFwLdsmHRqegId-SltDphxrSWV27kLM_8lFnWmCy0',
    canonicalUrl: '',
    enableStructuredData: true
  }
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'SNB-1089',
    customerName: 'الحاج عبد الله الفاسي',
    phone: '0661248910',
    city: 'فاس (Fès)',
    address: 'حي النرجس، شارع القدس إقامة 14 شقة 3',
    offerId: 'offer-2',
    offerTitle: '2 علب + هدية مجانية',
    quantity: 2,
    totalAmount: 299,
    status: 'delivered',
    notes: 'يرجى الاتصال في الصباح الباكر',
    createdAt: '2026-10-04T10:15:00',
    trackingCode: 'MA-FE-9821',
    paymentMethod: 'COD'
  },
  {
    id: 'ord-1002',
    orderNumber: 'SNB-1090',
    customerName: 'فاطمة الزهراء الإدريسي',
    phone: '0672114590',
    city: 'الدار البيضاء (Casablanca)',
    address: 'المعاريف، زنقة نورماندي عمارة 8',
    offerId: 'offer-2',
    offerTitle: '2 علب + هدية مجانية',
    quantity: 2,
    totalAmount: 299,
    status: 'shipping',
    notes: 'التسليم بعد الساعة الرابعة زوالاً',
    createdAt: '2026-10-05T14:30:00',
    trackingCode: 'MA-CS-4412',
    paymentMethod: 'COD'
  },
  {
    id: 'ord-1003',
    orderNumber: 'SNB-1091',
    customerName: 'محمد بنعلي',
    phone: '0663459012',
    city: 'طنجة (Tanger)',
    address: 'شارع المقاومة، بالقرب من محطة القطار',
    offerId: 'offer-3',
    offerTitle: '3 علب + علبة رابعة مجاناً',
    quantity: 4,
    totalAmount: 399,
    status: 'confirmed',
    notes: 'تأكيد عبر الواتساب تم بنجاح',
    createdAt: '2026-10-05T18:45:00',
    trackingCode: 'MA-TG-7731',
    paymentMethod: 'COD'
  },
  {
    id: 'ord-1004',
    orderNumber: 'SNB-1092',
    customerName: 'خديجة المرابط',
    phone: '0654890123',
    city: 'مراكش (Marrakech)',
    address: 'حي المسيرة 1، زنقة المنار رقم 45',
    offerId: 'offer-1',
    offerTitle: 'علبة واحدة (100ml)',
    quantity: 1,
    totalAmount: 199,
    status: 'new',
    notes: '',
    createdAt: '2026-10-06T08:20:00',
    paymentMethod: 'COD'
  },
  {
    id: 'ord-1005',
    orderNumber: 'SNB-1093',
    customerName: 'العربي التازي',
    phone: '0668903412',
    city: 'أكادير (Agadir)',
    address: 'حي الهدى، قرب صيدلية الرحمة',
    offerId: 'offer-2',
    offerTitle: '2 علب + هدية مجانية',
    quantity: 2,
    totalAmount: 299,
    status: 'new',
    notes: 'زبون دائم',
    createdAt: '2026-10-06T09:40:00',
    paymentMethod: 'COD'
  }
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    name: 'الحاج بوشعيب المنصوري',
    city: 'الدار البيضاء',
    rating: 5,
    comment: 'صراحة دهن سنام الجمل سانامبيو غير ليا حياتي. كنت كنعاني من ألم حاد في الركبة ومكنقدرش نصلي واقف. بعد أسبوع فقط من الاستعمال حسيت براحة كبيرة والآن الحمد لله كنتمشى بدون عكاز. منتوج أصلي وكنشكركم على سرعة التوصيل والمعاملة الطيبة.',
    date: 'منذ 3 أيام',
    verified: true,
    helpfulCount: 42,
    tag: 'شراء مؤكد',
    status: 'approved'
  },
  {
    id: 'rev-2',
    name: 'أمينة بنجلون',
    city: 'الرباط',
    rating: 5,
    comment: 'شريت باقة 2 علب للوالدة ديالي لي كتعاني من بوزلوم (السياتيك) وألم أسفل الظهر. النتيجة بانت من الأيام الأولى، الحرارة اللطيفة والزيوت الطبيعية كتهدن الألم فالحين. شكراً Sanambio.',
    date: 'منذ 5 أيام',
    verified: true,
    helpfulCount: 31,
    tag: 'شراء مؤكد',
    status: 'approved'
  },
  {
    id: 'rev-3',
    name: 'عبد الرحيم الشاوي',
    city: 'مراكش',
    rating: 5,
    comment: 'أنا رياضي وعندي دائماً تشنجات في عضلات الرقبة والكتف. هذا الدهن طبيعي 100% ومافيه حتى رائحة مزعجة، كيتشرب بسرعة والراحة ديالو فورية. كنصح به أي واحد كيعاني من تيبس المفاصل.',
    date: 'منذ أسبوع',
    verified: true,
    helpfulCount: 19,
    tag: 'شراء مؤكد',
    status: 'approved'
  },
  {
    id: 'rev-4',
    name: 'السيدة زبيدة الوردي',
    city: 'طنجة',
    rating: 5,
    comment: 'وصلني للمنزل في أقل من 24 ساعة، فتحت العلبة وتأكدت من الجودة عاد خلصت للموزع. منتج مضمون ورائحته أعشاب طبيعية زكية. شكراً جزيلاً لكم على المصداقية.',
    date: 'منذ أسبوعين',
    verified: true,
    helpfulCount: 26,
    tag: 'شراء مؤكد',
    status: 'approved'
  }
];

export const INITIAL_COUPONS: Coupon[] = [];

export const PAIN_AREAS: PainPoint[] = [
  {
    id: 'knee',
    name: 'خشونة وألم الركبة',
    title: 'تخفيف احتكاك الغضاريف والتهاب المفصل',
    description: 'يغذي الأنسجة المحيطة بركبة الساق ويزيد من إفراز السائل الزلالي المرن الذي يمنع التآكل والخشونة.',
    symptoms: ['صعوبة في ثني الركبة', 'صوت طقطقة عند المشي أو صعود الدرج', 'انتفاخ وألم شديد أثناء الصلاة'],
    howItHelps: 'تغلغل عميق للأحماض الدهنية الأساسية (أوميغا 3 و 6 و 9) لتهدئة الغشاء الزلالي وتسكين الألم الموضعي.',
    reliefTime: 'إحساس بالراحة خلال 15 دقيقة وتحسن ملحوظ في الحركة خلال 5 أيام.',
    iconName: 'Activity',
    imageUrl: 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/pain_areas/knee_cartilage.jpg',
    diagramTitle: 'تشريح مفصل الركبة: تزييت الغضروف وتعويض السائل الزلالي لمنع الاحتكاك والتآكل'
  },
  {
    id: 'spine',
    name: 'أسفل الظهر والعمود الفقري',
    title: 'علاج التشنجات العضلية والضغط الفقري',
    description: 'يرخي الأوتار المشدودة حول الفقرات القطنية ويقلل من الضغط الحاصل على الأعصاب.',
    symptoms: ['ألم ممتد عند الوقوف أو الجلوس طويلاً', 'تيبس الصباح وصعوبة الاستقامة', 'تشنج العضلات الظهرية'],
    howItHelps: 'تأثير حراري طبيعي ينشط الدورة الدموية الدقيقة في عضلات الظهر ويخفف احتقان الفقرات.',
    reliefTime: 'تراجع حدة التشنج بعد أول تدليك بالدهن الدافئ.',
    iconName: 'ShieldAlert',
    imageUrl: 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/pain_areas/spine_lumbar.jpg',
    diagramTitle: 'تشريح الفقرات القطنية L1-L5: إزالة تشنج عضلات الظهر وتخفيف الضغط على الأقراص الفقرية'
  },
  {
    id: 'sciatica',
    name: 'عرق النسا / بوزلوم (السياتيك)',
    title: 'تسكين وخز العصب الوركي وتنميل الساق',
    description: 'يساعد في تهدئة الالتهاب الحاد المحيط بالعصب الوركي الممتد من أسفل الظهر إلى القدم.',
    symptoms: ['ألم حارق يمتد على طول الفخذ والساق', 'تنميل وخدر في القدم وأصابعها', 'صعوبة في النوم والراحة'],
    howItHelps: 'مضادات الالتهاب الطبيعية في شحم السنام تخترق حتى عمق الأنسجة العصبية لتقليل التوتر.',
    reliefTime: 'تهدئة سريعة للنوبات الحادة وتحسن مستمر مع التدليك اليومي.',
    iconName: 'Zap',
    imageUrl: 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/pain_areas/sciatica_nerve.jpg',
    diagramTitle: 'تشريح مسار العصب الوركي (بوزلوم): تسكين التهاب العصب المضغوط ووقف تنميل الساق الممتد'
  },
  {
    id: 'neck',
    name: 'الرقبة والأكتاف',
    title: 'إزالة تيبس الرقبة والصداع التوتري',
    description: 'يعالج التقلصات الناتجة عن الجلوس الطويل أمام الشاشات أو القيادة والبرد.',
    symptoms: ['صعوبة الالتفات يميناً ويساراً', 'ثقل مستمر فوق الكتفين', 'صداع ناتج عن شد عضلات العنق'],
    howItHelps: 'يرخي الألياف العضلية المشدودة ويمنح إحساساً فورياً بالخفة والاسترخاء.',
    reliefTime: 'مرونة ملحوظة في حركة الرقبة بعد التدليك المباشر.',
    iconName: 'HeartPulse',
    imageUrl: 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/pain_areas/neck_shoulder.jpg',
    diagramTitle: 'تشريح الفقرات العنقية C1-C7 والأكتاف: فك تشنج العضلات واستعادة مرونة الرقبة'
  },
  {
    id: 'joints',
    name: 'الروماتيزم ومفاصل اليدين والقدمين',
    title: 'مكافحة التهاب المفاصل الروماتويدي',
    description: 'تركيبة غنية بالمعادن والعناصر المغذية التي تحمي المفاصل الصغيرة من التورم والألم البارد.',
    symptoms: ['ألم في أصابع اليدين وتيبس المعصم', 'حساسية شديدة للبرد والرطوبة', 'صعوبة الإمساك بالأشياء'],
    howItHelps: 'تكوين طبقة حماية عازلة تدفئ المفصل وتغذيه بالزيوت الطبيعية المعالجة.',
    reliefTime: 'استعادة قوة القبضة وسهولة حركة الأصابع بشكل طبيعي.',
    iconName: 'Sparkles',
    imageUrl: 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/pain_areas/hand_joints_rheumatism.jpg',
    diagramTitle: 'تشريح مفاصل اليدين والأصابع: طرد البرودة والرطوبة وتهدئة تورم وتصلب المفاصل'
  }
];

export const FAQS = [
  {
    q: 'هل دهن سنام الجمل Sanambio طبيعي 100% وأصلي؟',
    a: 'نعم بكل تأكيد. منتج Sanambio مستخلص من أجود أنواع سنام الإبل الصحراوية المغربية النقية مع زيوت وأعشاب نباتية مهدئة، بدون أي مواد كيميائية أو ملونات صناعية أو بارابين.'
  },
  {
    q: 'كيف يعمل الدهن وما هي مدة ظهور النتائج؟',
    a: 'يبدأ الإحساس بالراحة وتسكين الألم الموضعي خلال 15 إلى 30 دقيقة من التدليك بفضل قدرته الفائقة على النفاذ السريع. أما بالنسبة للتحسن الجذري في مرونة المفصل والتخلص من الخشونة، فينصح باتباع كورس متكامل لمدة 2 إلى 3 أسابيع.'
  },
  {
    q: 'ما هي طريقة الاستعمال الصحيحة للحصول على أفضل نتيجة؟',
    a: '1. تنظيف المكان المصاب بماء دافئ وتجفيفه بلطف لفتح مسام الجلد.\n2. أخذ كمية مناسبة من الدهن وتدليكها بحركات دائرية هادئة لمدة 5 دقائق حتى يتشربه الجلد كلياً.\n3. تغطية المنطقة بلباس دافئ وتكرار العملية مرتين يومياً (صباحاً وقبل النوم).'
  },
  {
    q: 'كيف تتم عملية التوصيل والدفع؟',
    a: 'التوصيل مجاني 100% لجميع مدن وقرى المملكة المغربية. الدفع يكون نقداً عند الاستلام (COD) فقط بعد أن يصلك الموزع إلى باب منزلك وتتأكد من سلامة الطرد والمنتج بنفسك.'
  },
  {
    q: 'هل هناك أي آثار جانبية أو موانع استعمال؟',
    a: 'المنتج طبيعي وآمن تماماً للاستخدام الخارجي لجميع الفئات العمرية بما في ذلك كبار السن. لا توجد أي آثار جانبية سلبية.'
  },
  {
    q: 'ماذا لو لم أحصل على النتيجة المرجوة؟',
    a: 'نحن نثق تماماً في جودة وفعالية دهن Sanambio الأصلي، ونقدم ضمان استبدال أو استرجاع لمدة 30 يوماً في حال وجود أي مشكلة.'
  }
];
