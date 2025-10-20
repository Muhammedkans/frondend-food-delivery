// src/utils/formatPrice.js

/**
 * Format a number into a price string
 * @param {number} amount - The numeric value to format
 * @param {string} currency - Currency code (default: INR)
 * @param {string} locale - Locale code (default: 'en-IN')
 * @returns {string} Formatted price string
 */
export const formatPrice = (amount, currency = 'INR', locale = 'en-IN') => {
  if (typeof amount !== 'number') return '₹0';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Example Usage:
 * formatPrice(250);           // ₹250
 * formatPrice(1250.5);        // ₹1,250.50
 * formatPrice(50, 'USD');     // $50
 * formatPrice(12345.678, 'EUR', 'de-DE'); // 12.345,68 €
 */
