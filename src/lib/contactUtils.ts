/**
 * Robust Moroccan Phone & WhatsApp URL formatter
 * Converts any format (06..., 07..., 05..., +212..., with spaces or hyphens)
 * to valid international WhatsApp and Phone formats.
 */

export function formatWhatsAppNumber(phone: string | undefined | null): string {
  if (!phone || phone.trim() === '') return '212661894520';
  
  // 1. Remove all spaces, dashes, parentheses, dots, slashes, letters
  let cleaned = phone.trim().replace(/[^0-9+]/g, '');
  
  // 2. Remove leading +
  cleaned = cleaned.replace(/^\+/, '');
  
  // 3. Remove leading double zeros (e.g. 00212...)
  if (cleaned.startsWith('00')) {
    cleaned = cleaned.substring(2);
  }

  // 4. If someone entered 21206... or 21207... or 21205... (very common Moroccan typo with country code + local 0)
  if (cleaned.startsWith('2120')) {
    cleaned = '212' + cleaned.substring(4);
  }
  
  // 5. If starts with 0 (e.g. 06..., 07..., 05...), replace leading 0 with Moroccan country code 212
  if (cleaned.startsWith('0')) {
    cleaned = '212' + cleaned.substring(1);
  } else if (!cleaned.startsWith('212') && cleaned.length === 9) {
    // 9 digits without 0 (e.g. 661894520)
    cleaned = '212' + cleaned;
  }
  
  return cleaned;
}

export function formatWhatsAppUrl(phone: string | undefined | null, defaultMessage?: string): string {
  const number = formatWhatsAppNumber(phone);
  const msgParam = defaultMessage ? `&text=${encodeURIComponent(defaultMessage)}` : '';
  // api.whatsapp.com works consistently on Android, iOS, and Web without redirect blocks
  return `https://api.whatsapp.com/send?phone=${number}${msgParam}`;
}

export function formatPhoneCallUrl(phone: string | undefined | null): string {
  if (!phone || phone.trim() === '') return 'tel:+212661894520';
  
  let cleaned = phone.trim().replace(/[^0-9+]/g, '');
  cleaned = cleaned.replace(/^\+/, '');
  if (cleaned.startsWith('00')) {
    cleaned = cleaned.substring(2);
  }
  if (cleaned.startsWith('2120')) {
    cleaned = '212' + cleaned.substring(4);
  }
  if (cleaned.startsWith('0')) {
    cleaned = '212' + cleaned.substring(1);
  } else if (!cleaned.startsWith('212') && cleaned.length === 9) {
    cleaned = '212' + cleaned;
  }
  return `tel:+${cleaned}`;
}
