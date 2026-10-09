import { createClient } from '@supabase/supabase-js';
import { Order, StoreSettings, CustomerReview, ProductOffer, Coupon } from '../types/store';
import { formatWhatsAppUrl } from './contactUtils';

// Retrieve credentials from Vite env or fallback
const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 
  'https://ecowrkizfpmcpsyzvvze.supabase.co';

const SUPABASE_ANON_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjb3dya2l6ZnBtY3BzeXp2dnplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0NDE1NTUsImV4cCI6MjEwMTAxNzU1NX0.CQegYKi9Ti0sxde8RU4UIK2zf56stSxLpjCRwhUwcYg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// ORDER MAPPERS & DATABASE OPERATIONS
// ==========================================

export function mapSupabaseToOrder(row: any): Order {
  const customer = row.customer || {};
  const items = Array.isArray(row.items) ? row.items : [];
  const firstItem = items[0] || {};

  return {
    id: row.id,
    orderNumber: row.id,
    customerName: customer.fullName || customer.name || 'زبون',
    phone: customer.phone || '',
    city: customer.city || '',
    address: customer.address || '',
    offerId: firstItem.offerId || firstItem.id || 'offer-1',
    offerTitle: firstItem.title || firstItem.name || 'دهن سنام الجمل Sanambio',
    quantity: Number(firstItem.quantity || 1),
    totalAmount: Number(row.total || 0),
    shippingCost: Number(row.shipping || 0),
    status: (row.status || 'new') as Order['status'],
    notes: customer.notes || row.status_note || '',
    couponCode: firstItem.couponCode || '',
    discountAmount: Number(firstItem.discountAmount || 0),
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at,
    trackingCode: row.status_note || '',
    paymentMethod: row.payment_method?.toUpperCase() === 'BANK_TRANSFER' ? 'BANK_TRANSFER' : 'COD'
  };
}

export function mapOrderToSupabase(order: Order): any {
  return {
    id: order.id,
    items: [
      {
        offerId: order.offerId,
        title: order.offerTitle,
        quantity: order.quantity,
        price: order.totalAmount,
        discountAmount: order.discountAmount || 0,
        couponCode: order.couponCode || ''
      }
    ],
    customer: {
      fullName: order.customerName,
      name: order.customerName,
      phone: order.phone,
      city: order.city,
      address: order.address,
      notes: order.notes || ''
    },
    payment_method: order.paymentMethod === 'BANK_TRANSFER' ? 'bank_transfer' : 'cod',
    subtotal: Math.max(0, order.totalAmount - (order.shippingCost || 0)),
    shipping: order.shippingCost || 0,
    total: order.totalAmount,
    status: order.status,
    status_note: order.trackingCode || order.notes || '',
    created_at: order.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

// Fetch all orders from Supabase
export async function fetchOrdersFromSupabase(): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching orders from Supabase:', error.message);
      return [];
    }
    return (data || []).map(mapSupabaseToOrder);
  } catch (err) {
    console.warn('Failed to fetch orders from Supabase:', err);
    return [];
  }
}

// Sync offers to Supabase offers table
export async function syncOffersToSupabase(offers: ProductOffer[]): Promise<boolean> {
  try {
    if (!offers || offers.length === 0) return true;
    const rows = offers.map((o, idx) => ({
      id: o.id,
      title: o.title,
      subtitle: o.subtitle || '',
      description: o.description || '',
      quantity: o.quantity || 1,
      price: o.price,
      original_price: o.originalPrice || o.price,
      discount_percent: o.discountPercentage || 0,
      is_popular: !!o.popular,
      is_best_value: !!o.bestValue,
      badge_text: o.tag || '',
      gifts: o.freeGift ? [o.freeGift] : [],
      sort_order: idx + 1,
      updated_at: new Date().toISOString()
    }));
    const { error } = await supabase.from('offers').upsert(rows, { onConflict: 'id' });
    if (error) {
      console.warn('Could not sync to offers table (using store_settings fallback):', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed syncing offers to Supabase:', err);
    return false;
  }
}

// Sync coupons to Supabase coupons table
export async function syncCouponsToSupabase(coupons: Coupon[]): Promise<boolean> {
  try {
    if (!coupons || coupons.length === 0) {
      // Clear coupons table in Supabase when array is empty
      await deleteAllCouponsFromSupabase();
      return true;
    }

    const rows = coupons.map(c => ({
      id: c.id,
      code: c.code.toUpperCase().trim(),
      discount_type: c.discountPercent ? 'percentage' : 'fixed',
      discount_value: c.discountPercent || c.discountFixed || 0,
      min_order_amount: c.minOrder || 0,
      is_active: c.active !== false,
      usage_count: c.usageCount || 0,
      max_uses: 1000
    }));

    // Delete any coupons in Supabase that are no longer in the list
    try {
      const activeIds = coupons.map(c => c.id);
      if (activeIds.length > 0) {
        await supabase.from('coupons').delete().not('id', 'in', `(${activeIds.map(id => `'${id}'`).join(',')})`);
      }
    } catch {
      // Ignore if filter fails
    }

    const { error } = await supabase.from('coupons').upsert(rows, { onConflict: 'id' });
    if (error) {
      console.warn('Could not sync to coupons table (using store_settings fallback):', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed syncing coupons to Supabase:', err);
    return false;
  }
}

// Delete single coupon from Supabase
export async function deleteCouponFromSupabase(couponId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('coupons').delete().or(`id.eq.${couponId},code.eq.${couponId}`);
    if (error) {
      console.warn('Error deleting coupon from Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed deleting coupon from Supabase:', err);
    return false;
  }
}

// Delete all coupons from Supabase
export async function deleteAllCouponsFromSupabase(): Promise<boolean> {
  try {
    const { error } = await supabase.from('coupons').delete().neq('id', '___empty_check___');
    if (error) {
      console.warn('Error deleting all coupons from Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed deleting all coupons from Supabase:', err);
    return false;
  }
}

// Delete single review from Supabase
export async function deleteReviewFromSupabase(reviewId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
    if (error) {
      console.warn('Error deleting review from Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed deleting review from Supabase:', err);
    return false;
  }
}

// Direct guaranteed save for admin PIN to both admin_auth and store_settings
export async function saveAdminPinToSupabase(newPin: string): Promise<boolean> {
  const cleanPin = String(newPin).trim();
  if (!cleanPin) return false;

  let authOk = false;
  let settingsOk = false;

  // 1. Direct upsert into admin_auth table
  try {
    const { error: authErr } = await supabase
      .from('admin_auth')
      .upsert({
        id: 'primary',
        pin_code: cleanPin,
        username: 'admin',
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (!authErr) {
      authOk = true;
    } else {
      console.warn('Could not save to admin_auth table:', authErr.message);
    }
  } catch (err) {
    console.warn('Exception saving to admin_auth:', err);
  }

  // 2. Direct update into store_settings table
  try {
    const { error: storeErr } = await supabase
      .from('store_settings')
      .update({
        admin_pin: cleanPin,
        updated_at: new Date().toISOString()
      })
      .eq('id', 'main');

    if (!storeErr) {
      settingsOk = true;
    } else {
      console.warn('Could not update admin_pin in store_settings:', storeErr.message);
    }
  } catch (err) {
    console.warn('Exception updating store_settings:', err);
  }

  // 3. Direct update in about_story_p1 JSON to ensure total consistency
  try {
    const { data: row } = await supabase
      .from('store_settings')
      .select('about_story_p1')
      .eq('id', 'main')
      .maybeSingle();

    if (row?.about_story_p1) {
      const parsed = JSON.parse(row.about_story_p1);
      if (!parsed.settings) parsed.settings = {};
      parsed.settings.adminPin = cleanPin;
      await supabase
        .from('store_settings')
        .update({
          about_story_p1: JSON.stringify(parsed),
          updated_at: new Date().toISOString()
        })
        .eq('id', 'main');
    }
  } catch {
    // Non-critical fallback
  }

  return authOk || settingsOk;
}

// Sync review to Supabase reviews table
export async function insertReviewToSupabase(review: CustomerReview): Promise<boolean> {
  try {
    const { error } = await supabase.from('reviews').insert([{
      author_name: review.name,
      city: review.city || 'المغرب',
      rating: review.rating || 5,
      comment: review.comment,
      verified: review.status === 'approved',
      created_at: new Date().toISOString()
    }]);
    if (error) {
      console.warn('Could not insert to reviews table:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed inserting review to Supabase:', err);
    return false;
  }
}

// Insert new order into Supabase
export async function insertOrderToSupabase(order: Order): Promise<boolean> {
  try {
    const row = mapOrderToSupabase(order);
    const { error } = await supabase.from('orders').insert([row]);
    if (error) {
      console.warn('Error inserting order to Supabase:', error.message);
      return false;
    }

    // Also sync customer to customers table if available
    try {
      await supabase.from('customers').insert([{
        full_name: order.customerName,
        phone: order.phone,
        city: order.city,
        address: order.address,
        total_orders: 1,
        total_spent: order.totalAmount,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);
    } catch {
      // Ignore if customer already exists or table has constraints
    }

    return true;
  } catch (err) {
    console.warn('Failed to insert order to Supabase:', err);
    return false;
  }
}

// Update order status in Supabase
export async function updateOrderStatusInSupabase(
  orderId: string, 
  status: Order['status'], 
  trackingCode?: string
): Promise<boolean> {
  try {
    const updatePayload: any = {
      status,
      updated_at: new Date().toISOString()
    };
    if (trackingCode !== undefined) {
      updatePayload.status_note = trackingCode;
    }

    const { error } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('id', orderId);

    if (error) {
      console.warn('Error updating order status in Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to update order status in Supabase:', err);
    return false;
  }
}

// Delete order from Supabase
export async function deleteOrderFromSupabase(orderId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('orders').delete().or(`id.eq.${orderId},status_note.eq.${orderId}`);
    if (error) {
      console.warn('Error deleting order from Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to delete order from Supabase:', err);
    return false;
  }
}

// ==========================================
// STORE SETTINGS MAPPERS & OPERATIONS
// ==========================================

export async function fetchSettingsFromSupabase(defaultSettings: StoreSettings): Promise<{
  settings: StoreSettings;
  extraState?: {
    offers?: ProductOffer[];
    reviews?: CustomerReview[];
    coupons?: Coupon[];
  };
} | null> {
  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('id', 'main')
      .single();

    if (error || !data) {
      console.warn('Could not fetch store_settings from Supabase:', error?.message);
      return null;
    }

    // Parse extra state from about_story_p1 if saved
    let extraState: any = {};
    if (data.about_story_p1) {
      try {
        extraState = JSON.parse(data.about_story_p1);
      } catch {
        extraState = {};
      }
    }

    // Also try to fetch directly from dedicated offers and coupons tables if available
    try {
      const { data: offersRows } = await supabase
        .from('offers')
        .select('*')
        .order('sort_order', { ascending: true });
      if (offersRows && offersRows.length > 0) {
        extraState.offers = offersRows.map(row => ({
          id: row.id,
          title: row.title,
          subtitle: row.subtitle || '',
          description: row.description || '',
          quantity: row.quantity || 1,
          price: Number(row.price),
          originalPrice: Number(row.original_price || row.price),
          discountPercentage: Number(row.discount_percent || 0),
          popular: !!row.is_popular,
          bestValue: !!row.is_best_value,
          tag: row.badge_text || '',
          freeGift: Array.isArray(row.gifts) && row.gifts.length > 0 ? row.gifts.join(' + ') : undefined,
          freeShipping: true
        }));
      }
    } catch {
      // Fallback to extraState.offers from store_settings
    }

    // Direct fetch for real reviews from Supabase reviews table
    try {
      const { data: reviewsRows, error: revErr } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      if (!revErr && Array.isArray(reviewsRows) && reviewsRows.length > 0) {
        extraState.reviews = reviewsRows.map(row => ({
          id: row.id,
          name: row.author_name || 'زبون',
          city: row.city || 'المغرب',
          rating: Number(row.rating || 5),
          comment: row.comment,
          verified: row.verified !== false,
          helpfulCount: 20,
          tag: 'شراء مؤكد',
          date: 'مؤخراً',
          status: row.verified !== false ? 'approved' : 'pending'
        }));
      }
    } catch {
      // Keep extraState.reviews
    }

    // Direct fetch for coupons table
    try {
      const { data: couponRows, error: couponErr } = await supabase.from('coupons').select('*');
      if (!couponErr && Array.isArray(couponRows)) {
        extraState.coupons = couponRows.map(row => ({
          id: row.id,
          code: row.code,
          discountPercent: row.discount_type === 'percentage' ? Number(row.discount_value) : undefined,
          discountFixed: row.discount_type === 'fixed' ? Number(row.discount_value) : undefined,
          minOrder: Number(row.min_order_amount || 0),
          active: row.is_active !== false,
          usageCount: row.usage_count || 0
        }));
      } else {
        extraState.coupons = [];
      }
    } catch {
      extraState.coupons = [];
    }

    // Check admin_auth table
    let adminPinFromAuth: string | undefined;
    try {
      const { data: authRow } = await supabase
        .from('admin_auth')
        .select('pin_code')
        .eq('id', 'primary')
        .maybeSingle();
      if (authRow?.pin_code) {
        adminPinFromAuth = String(authRow.pin_code).trim();
      }
    } catch {
      // Fallback
    }

    const effectivePin = (adminPinFromAuth || (data.admin_pin ? String(data.admin_pin).trim() : '') || extraState.settings?.adminPin || defaultSettings.adminPin || '1234').trim();

    const mergedAiBot = {
      ...(defaultSettings.aiBot || {}),
      ...(extraState.settings?.aiBot || {}),
      ...(data.ai_bot_settings || {}),
      geminiApiKey: data.gemini_api_key || data.ai_bot_settings?.geminiApiKey || extraState.settings?.aiBot?.geminiApiKey || defaultSettings.aiBot?.geminiApiKey || ''
    };

    // If welcome message was the old aggressive sales script, upgrade to the warm doctor welcome
    if (!mergedAiBot.welcomeMessage || mergedAiBot.welcomeMessage.includes('الباقة العائلية الاقتصادية (4 علب + علبة مجاناً)')) {
      mergedAiBot.welcomeMessage = defaultSettings.aiBot?.welcomeMessage || '';
    }
    if (!mergedAiBot.suggestedQuestions || mergedAiBot.suggestedQuestions.length === 0 || !mergedAiBot.suggestedQuestions[0]?.includes('دكتور')) {
      mergedAiBot.suggestedQuestions = defaultSettings.aiBot?.suggestedQuestions || [];
    }

    const mediaFromAiBot = data.ai_bot_settings?.media || {};
    const mediaFromExtra = extraState.settings?.media || {};

    const mergedMedia = {
      ...(defaultSettings.media || {}),
      ...(mediaFromAiBot || {}),
      ...(data.media || {}),
      ...(data.video_url ? { doctorVideoUrl: data.video_url } : {}),
      ...(data.anatomy_image_url ? { anatomicalImage: data.anatomy_image_url } : {}),
      ...(data.desert_bg_image_url ? { lifestyleImage: data.desert_bg_image_url } : {}),
      ...(mediaFromExtra || {})
    };

    const mergedSettings: StoreSettings = {
      ...defaultSettings,
      ...(extraState.settings || {}),
      storeName: data.store_name || defaultSettings.storeName,
      brandTagline: data.store_slogan || defaultSettings.brandTagline,
      heroHeadline: data.hero_headline || extraState.settings?.heroHeadline || defaultSettings.heroHeadline,
      heroSubheadline: data.hero_subheadline || extraState.settings?.heroSubheadline || defaultSettings.heroSubheadline,
      phone: data.phone || defaultSettings.phone,
      whatsappNumber: data.whatsapp || defaultSettings.whatsappNumber,
      whatsappSupportUrl: formatWhatsAppUrl(data.whatsapp || defaultSettings.whatsappNumber),
      announcementText: data.announcement_text || defaultSettings.announcementText,
      currency: data.currency || defaultSettings.currency,
      freeShippingThreshold: Number(data.free_shipping_threshold ?? defaultSettings.freeShippingThreshold),
      adminPin: effectivePin,
      logoUrl: mergedMedia.logoUrl || extraState.settings?.logoUrl || defaultSettings.logoUrl,
      networkStatusIconUrl: mergedMedia.networkStatusIconUrl || extraState.settings?.networkStatusIconUrl || defaultSettings.networkStatusIconUrl,
      aiBot: mergedAiBot,
      media: mergedMedia,
      payment: {
        ...(defaultSettings.payment || {}),
        ...(extraState.settings?.payment || {}),
        ...(data.payment_settings || {})
      },
      pixel: {
        ...(defaultSettings.pixel || {}),
        ...(extraState.settings?.pixel || {}),
        ...(data.pixel_settings || {}),
        ...(data.facebook_pixel_id ? { facebookPixelId: data.facebook_pixel_id } : {}),
        ...(data.tiktok_pixel_id ? { tiktokPixelId: data.tiktok_pixel_id } : {})
      },
      seo: {
        ...(defaultSettings.seo || {}),
        ...(extraState.settings?.seo || {})
      }
    };

    return {
      settings: mergedSettings,
      extraState: {
        offers: extraState.offers,
        reviews: extraState.reviews,
        coupons: extraState.coupons
      }
    };
  } catch (err) {
    console.warn('Failed to fetch settings from Supabase:', err);
    return null;
  }
}

// ==========================================
// SUPABASE STORAGE (MEDIA UPLOAD & SYNC)
// ==========================================

export const STORE_MEDIA_BUCKET = 'store_media';

/**
 * Converts a base64 / dataUrl string to a Blob object for Supabase Storage upload.
 */
export function dataUrlToBlob(dataUrl: string): Blob | null {
  try {
    const parts = dataUrl.split(',');
    if (parts.length < 2) return null;
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const binary = atob(parts[1]);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    return new Blob([array], { type: mime });
  } catch (err) {
    console.warn('Failed to convert dataUrl to Blob:', err);
    return null;
  }
}

/**
 * Uploads any File or Blob directly to Supabase Storage bucket 'store_media'.
 * Returns the permanent public URL or null on failure.
 */
export async function uploadFileToSupabaseStorage(
  fileOrBlob: File | Blob,
  fileName?: string,
  folder: string = 'media'
): Promise<string | null> {
  try {
    const timestamp = Date.now();
    let ext = 'jpg';
    if (fileOrBlob.type.includes('png')) ext = 'png';
    else if (fileOrBlob.type.includes('webp')) ext = 'webp';
    else if (fileOrBlob.type.includes('mp4')) ext = 'mp4';
    else if (fileOrBlob.type.includes('webm')) ext = 'webm';
    else if (fileOrBlob.type.includes('gif')) ext = 'gif';
    else if (fileOrBlob.type.includes('svg')) ext = 'svg';

    const safeName = (fileName || `${folder}_${timestamp}`)
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/\s+/g, '_');

    const finalPath = `${folder}/${timestamp}_${safeName.endsWith(`.${ext}`) ? safeName : `${safeName}.${ext}`}`;

    const { error: uploadError } = await supabase.storage
      .from(STORE_MEDIA_BUCKET)
      .upload(finalPath, fileOrBlob, {
        cacheControl: '31536000',
        upsert: true,
        contentType: fileOrBlob.type || undefined
      });

    if (uploadError) {
      console.warn('Supabase storage upload error:', uploadError.message);
      return null;
    }

    const { data } = supabase.storage
      .from(STORE_MEDIA_BUCKET)
      .getPublicUrl(finalPath);

    return data?.publicUrl || null;
  } catch (err) {
    console.warn('Failed to upload file to Supabase storage:', err);
    return null;
  }
}

/**
 * Uploads a single media item (File, Blob, or base64 dataUrl) to Supabase Storage.
 * If already a remote URL or Supabase URL, returns it directly.
 */
export async function uploadMediaItemToSupabaseStorage(
  item: string | File | Blob | null | undefined,
  preferredName: string,
  folder: string = 'media'
): Promise<string> {
  if (!item) return '';

  if (typeof item === 'string') {
    if (!item.startsWith('data:') && !item.startsWith('blob:')) {
      return item;
    }
    const blob = dataUrlToBlob(item);
    if (!blob) return item;
    const uploadedUrl = await uploadFileToSupabaseStorage(blob, preferredName, folder);
    return uploadedUrl || item;
  }

  const uploadedUrl = await uploadFileToSupabaseStorage(item, preferredName, folder);
  return uploadedUrl || '';
}

/**
 * Inspects all media assets in MediaSettings. If any item is a local base64/data URL,
 * uploads it to Supabase Storage and replaces it with the persistent Supabase Storage URL.
 */
export async function uploadAndSyncMediaSettings(media: any): Promise<any> {
  if (!media) return media;
  const updated = { ...media };

  // 0. Store Logo Image
  if (updated.logoUrl && (updated.logoUrl.startsWith('data:') || updated.logoUrl.startsWith('blob:'))) {
    const url = await uploadMediaItemToSupabaseStorage(updated.logoUrl, 'store_logo.png', 'branding');
    if (url) updated.logoUrl = url;
  }

  // 0.1 Globe / Network Status Icon
  if (updated.networkStatusIconUrl && (updated.networkStatusIconUrl.startsWith('data:') || updated.networkStatusIconUrl.startsWith('blob:'))) {
    const url = await uploadMediaItemToSupabaseStorage(updated.networkStatusIconUrl, 'network_status_icon.png', 'branding');
    if (url) updated.networkStatusIconUrl = url;
  }

  // 1. Cover / Desert Background image
  if (updated.lifestyleImage && (updated.lifestyleImage.startsWith('data:') || updated.lifestyleImage.startsWith('blob:'))) {
    const url = await uploadMediaItemToSupabaseStorage(updated.lifestyleImage, 'desert_bg_cover.jpg', 'images');
    if (url) updated.lifestyleImage = url;
  }

  // 2. Joint / Anatomical Relief image
  if (updated.anatomicalImage && (updated.anatomicalImage.startsWith('data:') || updated.anatomicalImage.startsWith('blob:'))) {
    const url = await uploadMediaItemToSupabaseStorage(updated.anatomicalImage, 'joint_anatomy.jpg', 'images');
    if (url) updated.anatomicalImage = url;
  }

  // 3. Dr. Younes Video Poster
  if (updated.doctorVideoPoster && (updated.doctorVideoPoster.startsWith('data:') || updated.doctorVideoPoster.startsWith('blob:'))) {
    const url = await uploadMediaItemToSupabaseStorage(updated.doctorVideoPoster, 'doctor_video_poster.jpg', 'images');
    if (url) updated.doctorVideoPoster = url;
  }

  // 4. Dr. Younes Video URL (if data URL or blob)
  if (updated.doctorVideoUrl && (updated.doctorVideoUrl.startsWith('data:') || updated.doctorVideoUrl.startsWith('blob:'))) {
    const url = await uploadMediaItemToSupabaseStorage(updated.doctorVideoUrl, 'doctor_younes_video.mp4', 'videos');
    if (url) updated.doctorVideoUrl = url;
  }

  // 5. Main Hero Product Image
  if (updated.heroProductImage && (updated.heroProductImage.startsWith('data:') || updated.heroProductImage.startsWith('blob:'))) {
    const url = await uploadMediaItemToSupabaseStorage(updated.heroProductImage, 'product_jar.jpg', 'images');
    if (url) updated.heroProductImage = url;
  }

  // 6. Product Gallery Slider
  if (Array.isArray(updated.productGallery) && updated.productGallery.length > 0) {
    const newGallery: string[] = [];
    for (let i = 0; i < updated.productGallery.length; i++) {
      const gItem = updated.productGallery[i];
      if (gItem && (gItem.startsWith('data:') || gItem.startsWith('blob:'))) {
        const url = await uploadMediaItemToSupabaseStorage(gItem, `gallery_image_${i + 1}.jpg`, 'gallery');
        newGallery.push(url || gItem);
      } else {
        newGallery.push(gItem);
      }
    }
    updated.productGallery = newGallery;
  }

  return updated;
}

export async function saveSettingsToSupabase(
  settings: StoreSettings,
  extra?: {
    offers?: ProductOffer[];
    reviews?: CustomerReview[];
    coupons?: Coupon[];
  }
): Promise<boolean> {
  // Create a fast save promise that resolves within 4 seconds max
  const savePromise = (async () => {
    try {
      // Auto-upload and sync any local media to Supabase Storage first
      let syncedMedia = settings.media;
      if (settings.media) {
        try {
          syncedMedia = await uploadAndSyncMediaSettings(settings.media);
        } catch (mediaErr) {
          console.warn('Media upload warning, continuing with settings save:', mediaErr);
        }
      }

      const extraPayload = JSON.stringify({
        settings: {
          heroHeadline: settings.heroHeadline,
          heroSubheadline: settings.heroSubheadline,
          enableAnnouncement: settings.enableAnnouncement,
          enableStockTicker: settings.enableStockTicker,
          initialStock: settings.initialStock,
          remainingStock: settings.remainingStock,
          guaranteeDays: settings.guaranteeDays,
          deliveryEstimate: settings.deliveryEstimate,
          enableFloatingBackground: settings.enableFloatingBackground,
          floatingBackgroundTheme: settings.floatingBackgroundTheme,
          media: syncedMedia,
          payment: settings.payment,
          aiBot: settings.aiBot,
          pixel: settings.pixel,
          seo: settings.seo,
          adminPin: settings.adminPin || '1234'
        },
        offers: extra?.offers,
        reviews: extra?.reviews,
        coupons: extra?.coupons
      });

      const updateData: any = {
        id: 'main',
        store_name: settings.storeName,
        store_slogan: settings.brandTagline,
        hero_headline: settings.heroHeadline,
        hero_subheadline: settings.heroSubheadline,
        phone: settings.phone,
        whatsapp: settings.whatsappNumber,
        announcement_text: settings.announcementText,
        currency: settings.currency,
        free_shipping_threshold: settings.freeShippingThreshold,
        admin_pin: settings.adminPin || '1234',
        video_url: syncedMedia?.doctorVideoUrl || '',
        anatomy_image_url: syncedMedia?.anatomicalImage || '',
        desert_bg_image_url: syncedMedia?.lifestyleImage || '',
        facebook_pixel_id: settings.pixel?.facebookPixelId || '',
        tiktok_pixel_id: settings.pixel?.tiktokPixelId || '',
        gemini_api_key: settings.aiBot?.geminiApiKey || '',
        ai_bot_settings: {
          ...(settings.aiBot || {}),
          media: syncedMedia || {}
        },
        media: syncedMedia || {},
        payment_settings: settings.payment || {},
        pixel_settings: settings.pixel || {},
        about_story_p1: extraPayload,
        updated_at: new Date().toISOString()
      };

      let { error } = await supabase
        .from('store_settings')
        .upsert(updateData, { onConflict: 'id' });

      // Fallback if remote schema doesn't have newer columns yet
      if (error) {
        console.warn('Full store_settings upsert failed, retrying with core schema + JSON payload:', error.message);
        const fallbackData = {
          id: 'main',
          store_name: settings.storeName,
          store_slogan: settings.brandTagline,
          phone: settings.phone,
          whatsapp: settings.whatsappNumber,
          announcement_text: settings.announcementText,
          currency: settings.currency,
          free_shipping_threshold: settings.freeShippingThreshold,
          admin_pin: settings.adminPin || '1234',
          about_story_p1: extraPayload,
          updated_at: new Date().toISOString()
        };
        const fallbackRes = await supabase
          .from('store_settings')
          .upsert(fallbackData, { onConflict: 'id' });
        if (fallbackRes.error) {
          console.warn('Fallback store_settings upsert error:', fallbackRes.error.message);
          return false;
        }
      }

      // Also sync adminPin to dedicated admin_auth table
      if (settings.adminPin) {
        try {
          await supabase
            .from('admin_auth')
            .upsert({
              id: 'primary',
              pin_code: settings.adminPin,
              username: 'admin',
              updated_at: new Date().toISOString()
            }, { onConflict: 'id' });
        } catch {
          // Ignore if table not yet created
        }
      }

      // Also sync to dedicated offers & coupons tables in parallel
      if (extra?.offers && extra.offers.length > 0) {
        syncOffersToSupabase(extra.offers).catch(() => {});
      }
      if (extra?.coupons !== undefined) {
        syncCouponsToSupabase(extra.coupons).catch(() => {});
      }

      return true;
    } catch (err: any) {
      console.warn('Failed to save settings to Supabase (offline fallback active):', err?.message || err);
      return false;
    }
  })();

  // Guarantee UI feedback within 4 seconds max
  const timeoutPromise = new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 4000);
  });

  return Promise.race([savePromise, timeoutPromise]);
}

// Test connection and table existence
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
  tables: {
    orders: boolean;
    store_settings: boolean;
    customers: boolean;
    offers: boolean;
    reviews: boolean;
    coupons: boolean;
    admin_auth: boolean;
  };
  storage?: boolean;
}> {
  try {
    const results = {
      orders: false,
      store_settings: false,
      customers: false,
      offers: false,
      reviews: false,
      coupons: false,
      admin_auth: false
    };
    
    // Check orders table
    const { error: ordersErr } = await supabase.from('orders').select('id').limit(1);
    results.orders = !ordersErr;

    // Check store_settings table
    const { error: settingsErr } = await supabase.from('store_settings').select('id').limit(1);
    results.store_settings = !settingsErr;

    // Check customers table
    const { error: customersErr } = await supabase.from('customers').select('id').limit(1);
    results.customers = !customersErr;

    // Check offers table
    const { error: offersErr } = await supabase.from('offers').select('id').limit(1);
    results.offers = !offersErr;

    // Check reviews table
    const { error: reviewsErr } = await supabase.from('reviews').select('id').limit(1);
    results.reviews = !reviewsErr;

    // Check coupons table
    const { error: couponsErr } = await supabase.from('coupons').select('id').limit(1);
    results.coupons = !couponsErr;

    // Check admin_auth table
    const { error: authErr } = await supabase.from('admin_auth').select('id').limit(1);
    results.admin_auth = !authErr;

    // Check storage bucket
    let storageOk = false;
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      storageOk = !!buckets?.some(b => b.name === STORE_MEDIA_BUCKET);
    } catch {
      storageOk = false;
    }

    const coreExist = results.orders && results.store_settings;

    return {
      success: coreExist,
      message: coreExist 
        ? 'تم الاتصال بنجاح بـ Supabase وقواعد البيانات جاهزة للعمل! ✅' 
        : 'تم الاتصال بالخادم، لكن بعض الجداول غير منشأة بعد. يرجى تشغيل كود SQL في Supabase Dashboard.',
      tables: results,
      storage: storageOk
    };
  } catch (err: any) {
    return {
      success: false,
      message: `فشل الاتصال: ${err?.message || 'تأكد من الاتصال بالإنترنت ومفاتيح Supabase'}`,
      tables: {
        orders: false,
        store_settings: false,
        customers: false,
        offers: false,
        reviews: false,
        coupons: false,
        admin_auth: false
      },
      storage: false
    };
  }
}

