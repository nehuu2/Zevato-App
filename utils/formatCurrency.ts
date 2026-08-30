/**
 * Formats a numeric amount into Indian Rupee currency format (₹).
 * @param amount - The number or numeric string to format
 * @param showDecimals - Whether to show paise/decimals (default false)
 * @returns Formatted currency string, e.g. "₹499" or "₹1,499.50"
 */
export function formatCurrency(amount: number | string | undefined | null, showDecimals = false): string {
  if (amount === undefined || amount === null) return '₹0';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '₹0';

  if (!showDecimals) {
    return `₹${Math.round(num).toLocaleString('en-IN')}`;
  }

  return `₹${num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default formatCurrency;
