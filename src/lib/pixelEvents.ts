/**
 * Pixel Events Dispatcher for Facebook (Meta) and TikTok Pixel
 * Built for direct-response e-commerce & Moroccan COD media buyers.
 */
import { PixelSettings } from '../types/store';

// Extend window interface for Facebook fbq, TikTok ttq, and Google Tag Manager
declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
    ttq?: any;
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export interface PixelLogEntry {
  id: string;
  timestamp: string;
  platform: 'facebook' | 'tiktok' | 'google';
  eventName: string;
  data: Record<string, any>;
  status: 'dispatched' | 'skipped_no_id' | 'skipped_disabled' | 'error';
  message?: string;
}

// In-memory event log ring buffer for Admin live inspection
const eventLogHistory: PixelLogEntry[] = [];
type PixelListener = (entry: PixelLogEntry) => void;
const listeners: Set<PixelListener> = new Set();

export function subscribeToPixelEvents(listener: PixelListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getPixelLogHistory(): PixelLogEntry[] {
  return [...eventLogHistory];
}

function notifyLog(entry: PixelLogEntry) {
  eventLogHistory.unshift(entry);
  if (eventLogHistory.length > 50) {
    eventLogHistory.pop();
  }
  listeners.forEach((fn) => {
    try {
      fn(entry);
    } catch (e) {
      console.warn('Listener error:', e);
    }
  });
}

// Track initialization states
let fbInitializedId: string | null = null;
let ttInitializedId: string | null = null;
let gaInitializedId: string | null = null;

/**
 * Dynamically injects and initializes Meta (Facebook) Pixel
 */
export function initFacebookPixel(pixelId: string): boolean {
  if (!pixelId || !pixelId.trim()) return false;
  const cleanId = pixelId.trim();

  try {
    if (!window.fbq) {
      /* eslint-disable */
      (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = true;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        if (s && s.parentNode) {
          s.parentNode.insertBefore(t, s);
        } else {
          b.head.appendChild(t);
        }
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */
    }

    if (fbInitializedId !== cleanId) {
      window.fbq('init', cleanId);
      fbInitializedId = cleanId;
      console.log(`%c[Meta Pixel] Initialized Pixel ID: ${cleanId}`, 'color: #1877F2; font-weight: bold;');
    }
    return true;
  } catch (err: any) {
    console.warn('Failed to init Facebook Pixel:', err);
    return false;
  }
}

/**
 * Dynamically injects and initializes TikTok Pixel
 */
export function initTiktokPixel(pixelId: string): boolean {
  if (!pixelId || !pixelId.trim()) return false;
  const cleanId = pixelId.trim();

  try {
    if (!window.ttq) {
      /* eslint-disable */
      (function (w: any, d: any, t: any) {
        w.TiktokAnalyticsObject = t;
        var ttq = (w[t] = w[t] || []);
        ttq.methods = [
          'page',
          'track',
          'identify',
          'instances',
          'debug',
          'on',
          'off',
          'once',
          'ready',
          'alias',
          'group',
          'enableCookie',
          'disableCookie'
        ];
        ttq.setAndDefer = function (t: any, e: any) {
          t[e] = function () {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
          };
        };
        for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
        ttq.instance = function (t: any) {
          for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]);
          return e;
        };
        ttq.load = function (e: any, n: any) {
          var i = 'https://analytics.tiktok.com/i18n/pixel/events.js';
          (ttq._i = ttq._i || {}), (ttq._i[e] = []), (ttq._i[e]._u = i), (ttq._t = ttq._t || {}), (ttq._t[e] = +new Date()), (ttq._o = ttq._o || {}), (ttq._o[e] = n || {});
          var o = document.createElement('script');
          (o.type = 'text/javascript'), (o.async = true), (o.src = i + '?sdkid=' + e + '&lib=' + t);
          var a = document.getElementsByTagName('script')[0];
          if (a && a.parentNode) {
            a.parentNode.insertBefore(o, a);
          } else {
            document.head.appendChild(o);
          }
        };
      })(window, document, 'ttq');
      /* eslint-enable */
    }

    if (ttInitializedId !== cleanId) {
      if (window.ttq && typeof window.ttq.load === 'function') {
        window.ttq.load(cleanId);
        ttInitializedId = cleanId;
        console.log(`%c[TikTok Pixel] Initialized Pixel ID: ${cleanId}`, 'color: #EE1D52; font-weight: bold;');
      }
    }
    return true;
  } catch (err: any) {
    console.warn('Failed to init TikTok Pixel:', err);
    return false;
  }
}

/**
 * Dynamically injects Google Analytics 4 (optional)
 */
export function initGoogleAnalytics(gaId: string): boolean {
  if (!gaId || !gaId.trim()) return false;
  const cleanId = gaId.trim();

  try {
    if (gaInitializedId === cleanId) return true;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${cleanId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer?.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', cleanId);
    gaInitializedId = cleanId;
    console.log(`%c[Google Analytics] Initialized ID: ${cleanId}`, 'color: #F9AB00; font-weight: bold;');
    return true;
  } catch (err: any) {
    console.warn('Failed to init Google Analytics:', err);
    return false;
  }
}

/**
 * Synchronizes Pixel scripts based on current store settings
 */
export function syncPixelScripts(settings?: PixelSettings) {
  if (!settings) return;

  if (settings.enableFacebookPixel && settings.facebookPixelId) {
    initFacebookPixel(settings.facebookPixelId);
  }

  if (settings.enableTiktokPixel && settings.tiktokPixelId) {
    initTiktokPixel(settings.tiktokPixelId);
  }

  if (settings.enableGoogleAnalytics && settings.googleAnalyticsId) {
    initGoogleAnalytics(settings.googleAnalyticsId);
  }
}

/**
 * Core event dispatcher
 */
export function dispatchPixelEvent(
  eventType: 'PageView' | 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase' | 'Lead' | 'Contact',
  payload: Record<string, any> = {},
  settings?: PixelSettings
) {
  const timestamp = new Date().toLocaleTimeString('fr-FR');
  const currency = payload.currency || 'MAD';

  // 1. Meta / Facebook Pixel Dispatch
  if (settings?.enableFacebookPixel && settings?.facebookPixelId) {
    try {
      initFacebookPixel(settings.facebookPixelId);

      if (window.fbq) {
        if (eventType === 'PageView') {
          window.fbq('track', 'PageView');
        } else if (eventType === 'ViewContent') {
          window.fbq('track', 'ViewContent', {
            content_name: payload.content_name || 'Sanambio Camel Cream',
            content_type: 'product',
            value: payload.value || 0,
            currency: currency,
            content_ids: [payload.content_id || 'SNB-01']
          });
        } else if (eventType === 'AddToCart') {
          window.fbq('track', 'AddToCart', {
            content_name: payload.content_name,
            content_type: 'product',
            value: payload.value,
            currency: currency,
            num_items: payload.quantity || 1
          });
        } else if (eventType === 'InitiateCheckout') {
          window.fbq('track', 'InitiateCheckout', {
            content_name: payload.content_name,
            value: payload.value,
            currency: currency,
            num_items: payload.quantity || 1
          });
        } else if (eventType === 'Purchase') {
          window.fbq('track', 'Purchase', {
            content_name: payload.content_name,
            content_type: 'product',
            value: payload.value,
            currency: currency,
            num_items: payload.quantity || 1,
            order_id: payload.order_id
          });
          // Also fire Lead event alongside Purchase for Meta ad campaigns optimized on leads
          window.fbq('track', 'Lead', {
            content_name: payload.content_name,
            value: payload.value,
            currency: currency
          });
        } else if (eventType === 'Lead') {
          window.fbq('track', 'Lead', {
            content_name: payload.content_name,
            value: payload.value || 0,
            currency: currency
          });
        } else if (eventType === 'Contact') {
          window.fbq('track', 'Contact', {
            content_name: payload.content_name || 'WhatsApp Contact'
          });
        }

        notifyLog({
          id: `fb-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          timestamp,
          platform: 'facebook',
          eventName: eventType,
          data: payload,
          status: 'dispatched'
        });

        console.log(
          `%c[Meta Pixel] Dispatched %c${eventType}`,
          'background: #1877F2; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
          'color: #0c4a6e; font-weight: bold;',
          payload
        );
      } else {
        notifyLog({
          id: `fb-${Date.now()}`,
          timestamp,
          platform: 'facebook',
          eventName: eventType,
          data: payload,
          status: 'error',
          message: 'fbq function not available yet'
        });
      }
    } catch (err: any) {
      console.warn('Facebook Pixel dispatch error:', err);
    }
  }

  // 2. TikTok Pixel Dispatch
  if (settings?.enableTiktokPixel && settings?.tiktokPixelId) {
    try {
      initTiktokPixel(settings.tiktokPixelId);

      if (window.ttq && typeof window.ttq.track === 'function') {
        if (eventType === 'PageView') {
          window.ttq.page();
        } else if (eventType === 'ViewContent') {
          window.ttq.track('ViewContent', {
            contents: [
              {
                content_id: payload.content_id || 'SNB-01',
                content_type: 'product',
                content_name: payload.content_name || 'Sanambio Camel Cream'
              }
            ],
            value: payload.value || 0,
            currency: currency
          });
        } else if (eventType === 'AddToCart') {
          window.ttq.track('AddToCart', {
            contents: [
              {
                content_id: payload.content_id || 'SNB-01',
                content_type: 'product',
                content_name: payload.content_name,
                quantity: payload.quantity || 1,
                price: payload.value
              }
            ],
            value: payload.value,
            currency: currency
          });
        } else if (eventType === 'InitiateCheckout') {
          window.ttq.track('InitiateCheckout', {
            contents: [
              {
                content_id: payload.content_id || 'SNB-01',
                content_type: 'product',
                content_name: payload.content_name,
                quantity: payload.quantity || 1,
                price: payload.value
              }
            ],
            value: payload.value,
            currency: currency
          });
        } else if (eventType === 'Purchase') {
          // TikTok standard purchase events: CompletePayment & PlaceAnOrder
          window.ttq.track('CompletePayment', {
            contents: [
              {
                content_id: payload.order_id || 'SNB-ORDER',
                content_type: 'product',
                content_name: payload.content_name,
                quantity: payload.quantity || 1,
                price: payload.value
              }
            ],
            value: payload.value,
            currency: currency
          });
          window.ttq.track('PlaceAnOrder', {
            contents: [
              {
                content_id: payload.order_id || 'SNB-ORDER',
                content_type: 'product',
                content_name: payload.content_name,
                quantity: payload.quantity || 1,
                price: payload.value
              }
            ],
            value: payload.value,
            currency: currency
          });
        } else if (eventType === 'Lead') {
          window.ttq.track('SubmitForm', {
            value: payload.value || 0,
            currency: currency
          });
        } else if (eventType === 'Contact') {
          window.ttq.track('Contact', {
            contents: [{ content_name: payload.content_name || 'WhatsApp' }]
          });
        }

        notifyLog({
          id: `tt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          timestamp,
          platform: 'tiktok',
          eventName: eventType,
          data: payload,
          status: 'dispatched'
        });

        console.log(
          `%c[TikTok Pixel] Dispatched %c${eventType}`,
          'background: #000; color: #EE1D52; padding: 2px 6px; border-radius: 4px; font-weight: bold; border: 1px solid #EE1D52;',
          'color: #991b1b; font-weight: bold;',
          payload
        );
      } else {
        notifyLog({
          id: `tt-${Date.now()}`,
          timestamp,
          platform: 'tiktok',
          eventName: eventType,
          data: payload,
          status: 'error',
          message: 'ttq track function not available yet'
        });
      }
    } catch (err: any) {
      console.warn('TikTok Pixel dispatch error:', err);
    }
  }

  // 3. Google Tag Manager / Analytics dataLayer push
  try {
    const dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer = dataLayer;
    
    dataLayer.push({
      event: eventType,
      ecommerce: {
        currency: currency,
        value: payload.value,
        transaction_id: payload.order_id,
        items: payload.content_name ? [{ item_name: payload.content_name, price: payload.value, quantity: payload.quantity || 1 }] : []
      },
      ...payload
    });

    if (settings?.enableGoogleAnalytics && settings?.googleAnalyticsId && (window as any).gtag) {
      if (eventType === 'Purchase') {
        (window as any).gtag('event', 'purchase', {
          transaction_id: payload.order_id,
          value: payload.value,
          currency: currency,
          items: [{ item_name: payload.content_name, quantity: payload.quantity || 1, price: payload.value }]
        });
      } else if (eventType === 'InitiateCheckout') {
        (window as any).gtag('event', 'begin_checkout', {
          value: payload.value,
          currency: currency
        });
      } else if (eventType === 'AddToCart') {
        (window as any).gtag('event', 'add_to_cart', {
          value: payload.value,
          currency: currency
        });
      }
    }

    notifyLog({
      id: `gtm-${Date.now()}`,
      timestamp,
      platform: 'google',
      eventName: eventType,
      data: payload,
      status: 'dispatched'
    });
  } catch (err) {
    console.warn('GTM dataLayer dispatch error:', err);
  }
}

/**
 * Convenient typed helpers
 */
export function trackPageViewEvent(settings?: PixelSettings) {
  if (settings?.trackPageView !== false) {
    dispatchPixelEvent('PageView', {}, settings);
  }
}

export function trackViewContentEvent(data: { name: string; price: number; currency?: string; id?: string }, settings?: PixelSettings) {
  if (settings?.trackViewContent !== false) {
    dispatchPixelEvent('ViewContent', {
      content_name: data.name,
      value: data.price,
      currency: data.currency || 'MAD',
      content_id: data.id || 'SNB-01'
    }, settings);
  }
}

export function trackAddToCartEvent(data: { name: string; price: number; quantity?: number; id?: string }, settings?: PixelSettings) {
  if (settings?.trackAddToCart !== false) {
    dispatchPixelEvent('AddToCart', {
      content_name: data.name,
      value: data.price,
      quantity: data.quantity || 1,
      currency: 'MAD',
      content_id: data.id || 'SNB-01'
    }, settings);
  }
}

export function trackInitiateCheckoutEvent(data: { name?: string; price: number; quantity?: number }, settings?: PixelSettings) {
  if (settings?.trackInitiateCheckout !== false) {
    dispatchPixelEvent('InitiateCheckout', {
      content_name: data.name || 'باقة سنام بيو الأصلية',
      value: data.price,
      quantity: data.quantity || 1,
      currency: 'MAD'
    }, settings);
  }
}

export function trackPurchaseEvent(order: {
  orderNumber: string;
  offerTitle: string;
  totalAmount: number;
  quantity?: number;
  customerName?: string;
  phone?: string;
  city?: string;
}, settings?: PixelSettings) {
  if (settings?.trackPurchase !== false) {
    dispatchPixelEvent('Purchase', {
      order_id: order.orderNumber,
      content_name: order.offerTitle,
      value: order.totalAmount,
      quantity: order.quantity || 1,
      customer_name: order.customerName,
      customer_city: order.city,
      currency: 'MAD'
    }, settings);
  }
}

export function trackContactEvent(method: 'whatsapp' | 'phone', label?: string, settings?: PixelSettings) {
  if (settings?.trackContact !== false) {
    dispatchPixelEvent('Contact', {
      content_name: label || (method === 'whatsapp' ? 'WhatsApp Click' : 'Phone Call Click')
    }, settings);
  }
}

/**
 * Fires an immediate live test event to verify Pixel setup
 */
export function fireTestPixelEvent(settings?: PixelSettings): { success: boolean; message: string } {
  if (!settings) {
    return { success: false, message: 'لا توجد إعدادات بكسل' };
  }

  const fbActive = Boolean(settings.enableFacebookPixel && settings.facebookPixelId?.trim());
  const ttActive = Boolean(settings.enableTiktokPixel && settings.tiktokPixelId?.trim());

  if (!fbActive && !ttActive) {
    return {
      success: false,
      message: 'يرجى إدخال وتفعيل معرف Facebook Pixel أو TikTok Pixel أولاً.'
    };
  }

  // Dispatch Test ViewContent & InitiateCheckout
  dispatchPixelEvent('ViewContent', {
    content_name: 'تجربة بكسل سنام بيو (Test Event)',
    value: 299,
    currency: 'MAD',
    content_id: 'TEST-SNB'
  }, settings);

  dispatchPixelEvent('InitiateCheckout', {
    content_name: 'تجربة بدء الطلب (Test Checkout)',
    value: 299,
    quantity: 1,
    currency: 'MAD'
  }, settings);

  return {
    success: true,
    message: `تم إرسال حدث تجريبي بنجاح إلى: ${fbActive ? 'Facebook Pixel ' : ''}${ttActive ? 'TikTok Pixel' : ''}`
  };
}
