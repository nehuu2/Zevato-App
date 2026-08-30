/**
 * Validation utility functions
 */

export function isValidEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  if (!phone) return false;
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length === 10;
}

export function isValidPincode(pincode: string): boolean {
  if (!pincode) return false;
  const digitsOnly = pincode.replace(/\D/g, '');
  return digitsOnly.length === 6;
}

export function isNotEmpty(value: string | null | undefined): boolean {
  return Boolean(value && value.trim().length > 0);
}

export function isValidPassword(password: string): { isValid: boolean; message?: string } {
  if (!password || password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must include at least one uppercase letter.' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must include at least one number.' };
  }
  return { isValid: true };
}

export default {
  isValidEmail,
  isValidPhone,
  isValidPincode,
  isNotEmpty,
  isValidPassword,
};
