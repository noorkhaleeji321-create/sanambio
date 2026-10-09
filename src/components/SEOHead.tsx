import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';

/**
 * SEOHead: Injects and manages dynamic meta tags, canonical URL,
 * Google Search Console verification, and OpenGraph tags in the document head.
 */
export const SEOHead: React.FC = () => {
  const { settings } = useStore();

  useEffect(() => {
    const seo = settings.seo;

    // 1. Dynamic Page Title
    const title = seo?.metaTitle || `${settings.storeName} | ${settings.brandTagline || 'علاج طبيعي لآلام المفاصل والظهر'}`;
    document.title = title;

    // Helper to set or update meta tag
    const setMetaTag = (attrName: 'name' | 'property', attrValue: string, content: string) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 2. Meta Description
    const desc = seo?.metaDescription || settings.heroSubheadline || 'دهن سنام الجمل الطبيعي الخالص لعلاج آلام المفاصل والركبة والظهر وعرق النسا.';
    setMetaTag('name', 'description', desc);
    setMetaTag('property', 'og:description', desc);
    setMetaTag('name', 'twitter:description', desc);

    // 3. Keywords
    const keywords = seo?.keywords || 'دهن سنام الجمل, علاج المفاصل, علاج خشونة الركبة, دهن سنام الجمل المغرب, عرق النسا, سياتيك';
    setMetaTag('name', 'keywords', keywords);

    // 4. OpenGraph & Twitter Titles
    setMetaTag('property', 'og:title', title);
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('property', 'og:site_name', settings.storeName || 'Sanambio Maroc');

    // 5. Canonical URL
    const canonical = seo?.canonicalUrl || (typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : 'https://sanambio.ma/');
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);
    setMetaTag('property', 'og:url', canonical);

    // 6. Google Search Console Verification Meta Tag
    if (seo?.googleSiteVerification && seo.googleSiteVerification.trim()) {
      setMetaTag('name', 'google-site-verification', seo.googleSiteVerification.trim());
    }

  }, [settings.seo, settings.storeName, settings.brandTagline, settings.heroSubheadline]);

  return null;
};
