export type OrderStatus = 'new' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
export type PaymentMethod = 'COD' | 'BANK_TRANSFER';

export interface ProductOffer {
  id: string;
  title: string;
  subtitle: string;
  quantity: number;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  popular?: boolean;
  bestValue?: boolean;
  tag?: string;
  freeShipping: boolean;
  freeGift?: string;
  description: string;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  offerId: string;
  offerTitle: string;
  quantity: number;
  totalAmount: number;
  shippingCost?: number;
  status: OrderStatus;
  notes?: string;
  couponCode?: string;
  discountAmount?: number;
  createdAt: string;
  updatedAt?: string;
  trackingCode?: string;
  paymentMethod: PaymentMethod;
}

export interface CustomerReview {
  id: string;
  name: string;
  city: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  helpfulCount: number;
  tag?: string;
  status: 'approved' | 'pending';
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent?: number;
  discountFixed?: number;
  minOrder?: number;
  active: boolean;
  expiryDate?: string;
  usageCount: number;
}

export interface PaymentSettings {
  enableCod: boolean;
  codLabel: string;
  enableBankTransfer: boolean;
  bankTransferLabel: string;
  bankDetails: string;
  shippingCost: number;
  freeShippingLabel: string;
  checkoutButtonText: string;
  orderSuccessTitle: string;
  orderSuccessMessage: string;
}

export interface MediaSettings {
  logoUrl?: string;
  networkStatusIconUrl?: string;
  heroProductImage: string;
  productGallery: string[];
  autoSlideGallery: boolean;
  gallerySpeed: number;
  lifestyleImage: string;
  anatomicalImage: string;
  painAreaImages?: {
    knee?: string;
    spine?: string;
    sciatica?: string;
    neck?: string;
    joints?: string;
    [key: string]: string | undefined;
  };
  doctorVideoUrl: string;
  doctorVideoPoster: string;
  doctorChannelName: string;
  doctorSubText: string;
}

export interface AiBotSettings {
  enabled: boolean;
  botName: string;
  botRoleTitle: string;
  geminiApiKey: string;
  systemPrompt?: string;
  welcomeMessage: string;
  tone: 'persuasive_doctor' | 'friendly_expert' | 'aggressive_closer';
  avatarUrl?: string;
  suggestedQuestions: string[];
}

export interface PixelSettings {
  // Facebook / Meta Pixel
  facebookPixelId: string;
  enableFacebookPixel: boolean;

  // TikTok Pixel
  tiktokPixelId: string;
  enableTiktokPixel: boolean;

  // Google Analytics / GTM (Optional)
  googleAnalyticsId?: string;
  enableGoogleAnalytics?: boolean;

  // Individual Event Trackers
  trackPageView: boolean;
  trackViewContent: boolean;
  trackAddToCart: boolean;
  trackInitiateCheckout: boolean;
  trackPurchase: boolean;
  trackLead: boolean;
  trackContact: boolean;

  // Debugging / Test Notification
  testEventMode: boolean;
}

export interface SeoSettings {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  googleSiteVerification?: string;
  canonicalUrl?: string;
  enableStructuredData?: boolean;
}

export interface StoreSettings {
  storeName: string;
  brandTagline: string;
  logoUrl?: string;
  networkStatusIconUrl?: string;
  phone: string;
  whatsappNumber: string;
  whatsappSupportUrl: string;
  adminPin?: string;
  heroHeadline: string;
  heroSubheadline: string;
  announcementText: string;
  enableAnnouncement: boolean;
  enableStockTicker: boolean;
  initialStock: number;
  remainingStock: number;
  currency: string;
  freeShippingThreshold: number;
  guaranteeDays: number;
  deliveryEstimate: string;
  enableFloatingBackground?: boolean;
  floatingBackgroundTheme?: 'all' | 'hearts' | 'stars' | 'emojis';
  media: MediaSettings;
  payment: PaymentSettings;
  aiBot?: AiBotSettings;
  pixel?: PixelSettings;
  seo?: SeoSettings;
}

export interface PainPoint {
  id: string;
  name: string;
  title: string;
  description: string;
  symptoms: string[];
  howItHelps: string;
  reliefTime: string;
  iconName: string;
  imageUrl?: string;
  diagramTitle?: string;
}
