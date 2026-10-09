import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ProductOffer, Order, CustomerReview, Coupon, StoreSettings, OrderStatus } from '../types/store';
import { INITIAL_OFFERS, INITIAL_ORDERS, INITIAL_REVIEWS, INITIAL_COUPONS, INITIAL_SETTINGS } from '../data/initialData';
import {
  supabase,
  fetchOrdersFromSupabase,
  insertOrderToSupabase,
  updateOrderStatusInSupabase,
  deleteOrderFromSupabase,
  fetchSettingsFromSupabase,
  saveSettingsToSupabase,
  uploadAndSyncMediaSettings,
  mapSupabaseToOrder,
  insertReviewToSupabase,
  deleteCouponFromSupabase,
  deleteAllCouponsFromSupabase,
  deleteReviewFromSupabase,
  saveAdminPinToSupabase
} from '../lib/supabase';
import { formatWhatsAppUrl } from '../lib/contactUtils';

interface StoreContextType {
  // Store Settings
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  updateAdminPin: (newPin: string) => Promise<boolean>;

  // Offers / Products
  offers: ProductOffer[];
  updateOffer: (id: string, updated: Partial<ProductOffer>) => void;

  // Orders
  orders: Order[];
  addOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingCode?: string) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;

  // Reviews
  reviews: CustomerReview[];
  addReview: (review: Omit<CustomerReview, 'id' | 'date' | 'helpfulCount' | 'status'>) => void;
  updateReviewStatus: (reviewId: string, status: 'approved' | 'pending') => void;
  deleteReview: (reviewId: string) => void;
  voteHelpful: (reviewId: string) => void;

  // Coupons
  coupons: Coupon[];
  applyCoupon: (code: string, currentTotal: number) => { valid: boolean; discountAmount: number; message: string };
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usageCount'>) => void;
  toggleCoupon: (id: string) => void;
  deleteCoupon: (id: string) => void;
  deleteAllCoupons: () => Promise<void>;

  // Mode View
  viewMode: 'landing' | 'admin';
  setViewMode: (mode: 'landing' | 'admin') => void;

  // Active selected offer for checkout
  selectedOfferId: string;
  setSelectedOfferId: (id: string) => void;

  // Admin Notification helper
  newOrderAlert: Order | null;
  dismissOrderAlert: () => void;

  // Supabase Database Status
  isSupabaseConnected: boolean;
  isLoadingFromSupabase: boolean;
  syncWithSupabase: () => Promise<void>;
  saveAllSettingsToSupabase: (overrideSettings?: StoreSettings) => Promise<boolean>;
}

const getCachedSettings = (): StoreSettings => {
  try {
    const saved = localStorage.getItem('sanambio_cached_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...INITIAL_SETTINGS, ...parsed };
    }
  } catch (err) {
    console.warn('Error reading cached settings:', err);
  }
  return INITIAL_SETTINGS;
};

const getCachedOffers = (): ProductOffer[] => {
  try {
    const saved = localStorage.getItem('sanambio_cached_offers');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Error reading cached offers:', err);
  }
  return INITIAL_OFFERS;
};

const getCachedReviews = (): CustomerReview[] => {
  try {
    const saved = localStorage.getItem('sanambio_cached_reviews');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Error reading cached reviews:', err);
  }
  return INITIAL_REVIEWS;
};

const getCachedCoupons = (): Coupon[] => {
  try {
    const saved = localStorage.getItem('sanambio_cached_coupons');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Error reading cached coupons:', err);
  }
  return INITIAL_COUPONS;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(getCachedSettings);
  const [offers, setOffers] = useState<ProductOffer[]>(getCachedOffers);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<CustomerReview[]>(getCachedReviews);
  const [coupons, setCoupons] = useState<Coupon[]>(getCachedCoupons);

  const [viewMode, setViewMode] = useState<'landing' | 'admin'>('landing');
  const [selectedOfferId, setSelectedOfferId] = useState<string>('offer-3');
  const [newOrderAlert, setNewOrderAlert] = useState<Order | null>(null);

  // Supabase State
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(true);
  const [isLoadingFromSupabase, setIsLoadingFromSupabase] = useState<boolean>(true);

  // Function to load all data from Supabase
  const syncWithSupabase = useCallback(async () => {
    setIsLoadingFromSupabase(true);
    try {
      // 1. Fetch Orders directly from Supabase (never fallback to hardcoded mock orders)
      const remoteOrders = await fetchOrdersFromSupabase();
      setOrders(remoteOrders);

      // 2. Fetch Settings from Supabase
      const remoteSettingsResult = await fetchSettingsFromSupabase(INITIAL_SETTINGS);
      if (remoteSettingsResult) {
        setSettings(prev => {
          const nextSettings = {
            ...prev,
            ...remoteSettingsResult.settings
          };
          try {
            localStorage.setItem('sanambio_cached_settings', JSON.stringify(nextSettings));
          } catch {}
          return nextSettings;
        });

        if (Array.isArray(remoteSettingsResult.extraState?.offers) && remoteSettingsResult.extraState.offers.length > 0) {
          setOffers(remoteSettingsResult.extraState.offers);
          try {
            localStorage.setItem('sanambio_cached_offers', JSON.stringify(remoteSettingsResult.extraState.offers));
          } catch {}
        }

        if (Array.isArray(remoteSettingsResult.extraState?.reviews)) {
          setReviews(remoteSettingsResult.extraState.reviews);
          try {
            localStorage.setItem('sanambio_cached_reviews', JSON.stringify(remoteSettingsResult.extraState.reviews));
          } catch {}
        }

        if (Array.isArray(remoteSettingsResult.extraState?.coupons)) {
          setCoupons(remoteSettingsResult.extraState.coupons);
          try {
            localStorage.setItem('sanambio_cached_coupons', JSON.stringify(remoteSettingsResult.extraState.coupons));
          } catch {}
        } else {
          setCoupons([]);
          try {
            localStorage.setItem('sanambio_cached_coupons', JSON.stringify([]));
          } catch {}
        }
      }
      setIsSupabaseConnected(true);
    } catch (err) {
      console.warn('Sync with Supabase encountered issue:', err);
    } finally {
      setIsLoadingFromSupabase(false);
    }
  }, []);

  // Initialize and subscribe to Supabase Realtime
  useEffect(() => {
    syncWithSupabase();

    // Listen to Supabase Realtime changes on orders, store_settings, coupons, admin_auth
    const channel = supabase
      .channel('public_store_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            const incomingOrder = mapSupabaseToOrder(payload.new);
            setOrders(prev => {
              if (prev.some(o => o.id === incomingOrder.id)) return prev;
              return [incomingOrder, ...prev];
            });
            setNewOrderAlert(incomingOrder);
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            const updated = mapSupabaseToOrder(payload.new);
            setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
          } else if (payload.eventType === 'DELETE' && payload.old) {
            setOrders(prev => prev.filter(o => o.id !== payload.old.id));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'coupons' },
        async () => {
          try {
            const { data } = await supabase.from('coupons').select('*');
            if (Array.isArray(data)) {
              setCoupons(data.map(row => ({
                id: row.id,
                code: row.code,
                discountPercent: row.discount_type === 'percentage' ? Number(row.discount_value) : undefined,
                discountFixed: row.discount_type === 'fixed' ? Number(row.discount_value) : undefined,
                minOrder: Number(row.min_order_amount || 0),
                active: row.is_active !== false,
                usageCount: row.usage_count || 0
              })));
            }
          } catch {
            // Ignore
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'admin_auth' },
        (payload) => {
          if (payload.new && (payload.new as any).pin_code) {
            const remotePin = String((payload.new as any).pin_code).trim();
            setSettings(prev => ({ ...prev, adminPin: remotePin }));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'store_settings' },
        (payload) => {
          if (payload.new) {
            const raw = payload.new as any;
            let extra: any = {};
            if (raw.about_story_p1) {
              try {
                extra = JSON.parse(raw.about_story_p1);
              } catch {
                extra = {};
              }
            }

            const mediaFromExtra = extra.settings?.media || {};
            const mediaFromAiBot = raw.ai_bot_settings?.media || {};
            const mergedMedia = {
              ...(raw.media || {}),
              ...(mediaFromAiBot || {}),
              ...(raw.video_url ? { doctorVideoUrl: raw.video_url } : {}),
              ...(raw.anatomy_image_url ? { anatomicalImage: raw.anatomy_image_url } : {}),
              ...(raw.desert_bg_image_url ? { lifestyleImage: raw.desert_bg_image_url } : {}),
              ...(mediaFromExtra || {})
            };

            setSettings(prev => {
              const nextSettings = {
                ...prev,
                ...(extra.settings || {}),
                storeName: raw.store_name || prev.storeName,
                brandTagline: raw.store_slogan || prev.brandTagline,
                heroHeadline: raw.hero_headline || extra.settings?.heroHeadline || prev.heroHeadline,
                heroSubheadline: raw.hero_subheadline || extra.settings?.heroSubheadline || prev.heroSubheadline,
                phone: raw.phone || prev.phone,
                whatsappNumber: raw.whatsapp || prev.whatsappNumber,
                whatsappSupportUrl: formatWhatsAppUrl(raw.whatsapp || prev.whatsappNumber),
                announcementText: raw.announcement_text || prev.announcementText,
                currency: raw.currency || prev.currency,
                freeShippingThreshold: Number(raw.free_shipping_threshold ?? prev.freeShippingThreshold),
                adminPin: raw.admin_pin || extra.settings?.adminPin || prev.adminPin,
                media: mergedMedia
              };
              try {
                localStorage.setItem('sanambio_cached_settings', JSON.stringify(nextSettings));
              } catch {}
              return nextSettings;
            });

            if (Array.isArray(extra.offers) && extra.offers.length > 0) {
              setOffers(extra.offers);
              try {
                localStorage.setItem('sanambio_cached_offers', JSON.stringify(extra.offers));
              } catch {}
            }
            if (Array.isArray(extra.reviews)) {
              setReviews(extra.reviews);
              try {
                localStorage.setItem('sanambio_cached_reviews', JSON.stringify(extra.reviews));
              } catch {}
            }
            if (Array.isArray(extra.coupons)) {
              setCoupons(extra.coupons);
              try {
                localStorage.setItem('sanambio_cached_coupons', JSON.stringify(extra.coupons));
              } catch {}
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [syncWithSupabase]);

  // Debounced background auto-save to prevent Supabase request congestion
  const debouncedSaveRef = React.useRef<any>(null);
  const triggerBackgroundSave = (updatedSettings: StoreSettings, extraState?: { offers?: ProductOffer[]; reviews?: CustomerReview[]; coupons?: Coupon[] }) => {
    try {
      localStorage.setItem('sanambio_cached_settings', JSON.stringify(updatedSettings));
      if (extraState?.offers) localStorage.setItem('sanambio_cached_offers', JSON.stringify(extraState.offers));
      if (extraState?.reviews) localStorage.setItem('sanambio_cached_reviews', JSON.stringify(extraState.reviews));
      if (extraState?.coupons) localStorage.setItem('sanambio_cached_coupons', JSON.stringify(extraState.coupons));
    } catch (err) {
      console.warn('Error caching to localStorage:', err);
    }

    if (debouncedSaveRef.current) {
      clearTimeout(debouncedSaveRef.current);
    }
    debouncedSaveRef.current = setTimeout(() => {
      saveSettingsToSupabase(updatedSettings, extraState).catch(() => {});
    }, 600);
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    // Persist to Supabase debounced in background
    triggerBackgroundSave(updated, { offers, reviews, coupons });
  };

  const updateOffer = (id: string, updated: Partial<ProductOffer>) => {
    const updatedOffers = offers.map(o => o.id === id ? { ...o, ...updated } : o);
    setOffers(updatedOffers);
    triggerBackgroundSave(settings, { offers: updatedOffers, reviews, coupons });
  };

  const addOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>): Promise<Order> => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `SNB-${randomNum}`;
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      orderNumber: orderId,
      status: 'new',
      createdAt: new Date().toISOString(),
      trackingCode: `MA-EXP-${Math.floor(1000 + Math.random() * 9000)}`
    };

    // Update state locally immediately
    setOrders(prev => [newOrder, ...prev]);

    // Decrement stock count
    const updatedSettings = {
      ...settings,
      remainingStock: Math.max(1, settings.remainingStock - orderData.quantity)
    };
    setSettings(updatedSettings);

    setNewOrderAlert(newOrder);

    // Save directly to Supabase
    await insertOrderToSupabase(newOrder);
    saveSettingsToSupabase(updatedSettings, { offers, reviews, coupons });

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, trackingCode?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status,
          trackingCode: trackingCode || o.trackingCode,
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    }));

    // Update in Supabase
    await updateOrderStatusInSupabase(orderId, status, trackingCode);
  };

  const deleteOrder = async (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    // Delete in Supabase
    await deleteOrderFromSupabase(orderId);
  };

  const addReview = (review: Omit<CustomerReview, 'id' | 'date' | 'helpfulCount' | 'status'>) => {
    const newRev: CustomerReview = {
      ...review,
      id: `rev-${Date.now()}`,
      date: 'الآن',
      helpfulCount: 0,
      status: 'approved'
    };
    const updatedReviews = [newRev, ...reviews];
    setReviews(updatedReviews);
    triggerBackgroundSave(settings, { offers, reviews: updatedReviews, coupons });
    insertReviewToSupabase(newRev).catch(() => {});
  };

  const updateReviewStatus = (reviewId: string, status: 'approved' | 'pending') => {
    const updatedReviews = reviews.map(r => r.id === reviewId ? { ...r, status } : r);
    setReviews(updatedReviews);
    triggerBackgroundSave(settings, { offers, reviews: updatedReviews, coupons });
  };

  const deleteReview = async (reviewId: string) => {
    const updatedReviews = reviews.filter(r => r.id !== reviewId);
    setReviews(updatedReviews);
    await deleteReviewFromSupabase(reviewId);
    triggerBackgroundSave(settings, { offers, reviews: updatedReviews, coupons });
  };

  const voteHelpful = (reviewId: string) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r));
  };

  const applyCoupon = (code: string, currentTotal: number) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === cleanCode && c.active);

    if (!found) {
      return { valid: false, discountAmount: 0, message: 'رمز القسيمة غير صالح أو منتهي الصلاحية' };
    }

    if (found.minOrder && currentTotal < found.minOrder) {
      return { valid: false, discountAmount: 0, message: `الحد الأدنى لتطبيق هذا الكود هو ${found.minOrder} درهم` };
    }

    let discount = 0;
    if (found.discountPercent) {
      discount = Math.round((currentTotal * found.discountPercent) / 100);
    } else if (found.discountFixed) {
      discount = found.discountFixed;
    }

    return { valid: true, discountAmount: discount, message: `تم تفعيل الخصم بنجاح! (-${discount} درهم)` };
  };

  const addCoupon = (coupon: Omit<Coupon, 'id' | 'usageCount'>) => {
    const newCoupon: Coupon = {
      ...coupon,
      id: `cp-${Date.now()}`,
      code: coupon.code.toUpperCase().trim(),
      usageCount: 0
    };
    const updatedCoupons = [newCoupon, ...coupons];
    setCoupons(updatedCoupons);
    triggerBackgroundSave(settings, { offers, reviews, coupons: updatedCoupons });
  };

  const toggleCoupon = (id: string) => {
    const updatedCoupons = coupons.map(c => c.id === id ? { ...c, active: !c.active } : c);
    setCoupons(updatedCoupons);
    triggerBackgroundSave(settings, { offers, reviews, coupons: updatedCoupons });
  };

  const deleteCoupon = async (id: string) => {
    const updatedCoupons = coupons.filter(c => c.id !== id);
    setCoupons(updatedCoupons);
    await deleteCouponFromSupabase(id);
    triggerBackgroundSave(settings, { offers, reviews, coupons: updatedCoupons });
  };

  const deleteAllCoupons = async () => {
    setCoupons([]);
    await deleteAllCouponsFromSupabase();
    triggerBackgroundSave(settings, { offers, reviews, coupons: [] });
  };

  const updateAdminPin = async (newPin: string): Promise<boolean> => {
    const cleanPin = String(newPin).trim();
    if (!cleanPin) return false;
    const updatedSettings = { ...settings, adminPin: cleanPin };
    setSettings(updatedSettings);
    const ok = await saveAdminPinToSupabase(cleanPin);
    triggerBackgroundSave(updatedSettings, { offers, reviews, coupons });
    return ok;
  };

  const saveAllSettingsToSupabase = async (overrideSettings?: StoreSettings): Promise<boolean> => {
    if (debouncedSaveRef.current) {
      clearTimeout(debouncedSaveRef.current);
    }
    let currentSettings = overrideSettings || settings;
    try {
      if (currentSettings.media) {
        const syncedMedia = await uploadAndSyncMediaSettings(currentSettings.media);
        if (syncedMedia) {
          currentSettings = { ...currentSettings, media: syncedMedia };
          setSettings(currentSettings);
        }
      }
    } catch (err) {
      console.warn('Pre-sync media to Supabase Storage warning:', err);
    }

    try {
      localStorage.setItem('sanambio_cached_settings', JSON.stringify(currentSettings));
    } catch {}

    return await saveSettingsToSupabase(currentSettings, { offers, reviews, coupons });
  };

  const dismissOrderAlert = () => setNewOrderAlert(null);

  return (
    <StoreContext.Provider
      value={{
        settings,
        updateSettings,
        updateAdminPin,
        offers,
        updateOffer,
        orders,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        reviews,
        addReview,
        updateReviewStatus,
        deleteReview,
        voteHelpful,
        coupons,
        applyCoupon,
        addCoupon,
        toggleCoupon,
        deleteCoupon,
        deleteAllCoupons,
        viewMode,
        setViewMode,
        selectedOfferId,
        setSelectedOfferId,
        newOrderAlert,
        dismissOrderAlert,
        isSupabaseConnected,
        isLoadingFromSupabase,
        syncWithSupabase,
        saveAllSettingsToSupabase
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
