/**
 * Moroccan E-Commerce Anti-Spam & Duplicate Order Protection
 * Designed for Direct Response COD Landing Pages in Morocco.
 */

export interface PhoneValidationResult {
  isValid: boolean;
  formatted: string;
  error?: string;
}

/**
 * Validates Moroccan phone numbers strictly.
 * Accepts formats: 06XXXXXXXX, 07XXXXXXXX, 05XXXXXXXX, +2126..., +2127..., +2125...
 * Rejects non-Moroccan prefixes, incorrect digit counts, and repetitive/fake sequences.
 */
export function validateMoroccanPhone(phone: string): PhoneValidationResult {
  if (!phone || !phone.trim()) {
    return {
      isValid: false,
      formatted: '',
      error: 'يرجى إدخال رقم الهاتف'
    };
  }

  // Clean spaces, dashes, dots, parentheses, and leading plus
  let cleaned = phone.trim().replace(/[^0-9+]/g, '').replace(/^\+/, '');

  // Handle leading 00212
  if (cleaned.startsWith('00212')) {
    cleaned = cleaned.substring(2);
  }

  // Handle common typo 21206..., 21207..., 21205...
  if (cleaned.startsWith('2120')) {
    cleaned = '212' + cleaned.substring(4);
  }

  // Normalize to 10-digit local format starting with 0
  let localNumber = '';
  if (cleaned.startsWith('0')) {
    localNumber = cleaned;
  } else if (cleaned.startsWith('212')) {
    localNumber = '0' + cleaned.substring(3);
  } else if (cleaned.length === 9 && (cleaned.startsWith('6') || cleaned.startsWith('7') || cleaned.startsWith('5'))) {
    localNumber = '0' + cleaned;
  } else {
    localNumber = cleaned;
  }

  // 1. Must be exactly 10 digits
  if (localNumber.length !== 10) {
    return {
      isValid: false,
      formatted: localNumber,
      error: 'رقم الهاتف يجب أن يتكون من 10 أرقام (مثال: 0612345678 أو 0712345678)'
    };
  }

  // 2. Must start with 06, 07, or 05
  const validPrefixes = ['06', '07', '05'];
  const prefix = localNumber.substring(0, 2);
  if (!validPrefixes.includes(prefix)) {
    return {
      isValid: false,
      formatted: localNumber,
      error: 'رقم الهاتف المغربي يجب أن يبدأ بـ 06 أو 07 أو 05'
    };
  }

  // 3. Reject repetitive dummy patterns (e.g. 0600000000, 0666666666, 0711111111)
  const digitsAfterPrefix = localNumber.substring(2);
  const firstDigit = digitsAfterPrefix[0];
  const isAllSameDigit = digitsAfterPrefix.split('').every(d => d === firstDigit);
  if (isAllSameDigit) {
    return {
      isValid: false,
      formatted: localNumber,
      error: 'يرجى إدخال رقم هاتف حقيقي وليس أرقاماً مكررة'
    };
  }

  // 4. Reject sequential dummy patterns (e.g. 0612345678, 0712345678, 0512345678, 0698765432)
  if (localNumber === '0612345678' || localNumber === '0712345678' || localNumber === '0512345678' ||
      localNumber === '0698765432' || localNumber === '0798765432' || localNumber === '0598765432') {
    return {
      isValid: false,
      formatted: localNumber,
      error: 'يرجى إدخال رقم هاتفك الشخصي الفعلي لتأكيد الطلب'
    };
  }

  return {
    isValid: true,
    formatted: localNumber
  };
}

const STORAGE_KEY_RECENT = 'sanambio_recent_submitted_phones_v1';

interface RecentSubmitRecord {
  phone: string;
  timestamp: number;
  orderNumber: string;
}

/**
 * Checks if an order was recently submitted from the same phone number within cooldown window (e.g. 1 minute).
 */
export function checkDuplicatePhoneOrder(phone: string, cooldownMinutes = 1): {
  isDuplicate: boolean;
  secondsLeft: number;
  orderNumber?: string;
} {
  const norm = validateMoroccanPhone(phone).formatted || phone.replace(/\D/g, '');
  if (!norm) return { isDuplicate: false, secondsLeft: 0 };

  try {
    const raw = localStorage.getItem(STORAGE_KEY_RECENT);
    if (!raw) return { isDuplicate: false, secondsLeft: 0 };

    const records: RecentSubmitRecord[] = JSON.parse(raw);
    const now = Date.now();
    const cooldownMs = cooldownMinutes * 60 * 1000;

    const existing = records.find(
      r => r.phone === norm && now - r.timestamp < cooldownMs
    );

    if (existing) {
      const elapsedMs = now - existing.timestamp;
      const remainingSec = Math.max(1, Math.ceil((cooldownMs - elapsedMs) / 1000));
      return {
        isDuplicate: true,
        secondsLeft: remainingSec,
        orderNumber: existing.orderNumber
      };
    }
  } catch (e) {
    console.warn('Could not read recent submit records:', e);
  }

  return { isDuplicate: false, secondsLeft: 0 };
}

/**
 * Records a phone number upon successful order submission to prevent duplicates for 1 minute.
 */
export function recordSubmittedPhone(phone: string, orderNumber: string): void {
  const norm = validateMoroccanPhone(phone).formatted || phone.replace(/\D/g, '');
  if (!norm) return;

  try {
    const raw = localStorage.getItem(STORAGE_KEY_RECENT);
    let records: RecentSubmitRecord[] = raw ? JSON.parse(raw) : [];
    const now = Date.now();

    // Clean records older than 1 hour
    records = records.filter(r => now - r.timestamp < 3600 * 1000);

    records.unshift({
      phone: norm,
      timestamp: now,
      orderNumber
    });

    localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(records));
  } catch (e) {
    console.warn('Could not save recent submit record:', e);
  }
}
