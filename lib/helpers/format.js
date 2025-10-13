/**
 * Format helper utilities for numbers and percentages
 * Handles edge cases like undefined, null, NaN, infinity, and extreme outliers
 */

/**
 * Returns CSS class for delta values (positive, negative, or neutral)
 * @param {number|null|undefined} delta - The delta value to classify
 * @returns {string} CSS class name
 */
export function getDeltaClass(delta) {
  if (delta === null || delta === undefined || isNaN(delta) || !isFinite(delta)) {
    return 'delta-neutral';
  }
  if (delta > 0) return 'delta-positive';
  if (delta < 0) return 'delta-negative';
  return 'delta-neutral';
}

/**
 * Formats a percentage with Italian locale and handles outliers
 * @param {number|null|undefined} value - The percentage value (e.g., 0.15 for 15%)
 * @param {number} decimals - Number of decimal places (default: 2)
 * @param {boolean} asDecimal - If true, treats value as decimal (0.15 = 15%), else as percentage (15 = 15%)
 * @returns {string} Formatted percentage string
 */
export function formatPercent(value, decimals = 2, asDecimal = false) {
  // Handle invalid values
  if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
    return '0,00%';
  }

  // Convert to percentage if needed
  const pct = asDecimal ? value * 100 : value;

  // Handle extreme outliers
  if (Math.abs(pct) > 1000) {
    const sign = pct > 0 ? '+' : '';
    return `${sign}>1000%`;
  }

  // Format with Italian locale
  return new Intl.NumberFormat('it-IT', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(asDecimal ? value : value / 100);
}

/**
 * Formats a number with Italian locale and handles outliers
 * @param {number|null|undefined} value - The number to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted number string
 */
export function formatNumber(value, decimals = 2) {
  // Handle invalid values
  if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
    return '0,00';
  }

  // Handle extreme outliers
  if (Math.abs(value) > 1e15) {
    const sign = value > 0 ? '+' : '';
    return `${sign}>1e15`;
  }

  // Format with Italian locale
  return new Intl.NumberFormat('it-IT', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formats currency with Italian locale (compact for large numbers)
 * @param {number|null|undefined} value - The currency value
 * @param {string} currency - Currency code (default: 'USD')
 * @param {boolean} compact - Use compact notation for large numbers (default: true)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value, currency = 'USD', compact = true) {
  // Handle invalid values
  if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
    return '$0,00';
  }

  // Compact format for large numbers
  if (compact) {
    if (Math.abs(value) >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(2)}B`;
    } else if (Math.abs(value) >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(2)}M`;
    } else if (Math.abs(value) >= 1_000) {
      return `$${(value / 1_000).toFixed(2)}K`;
    }
  }

  // Standard format
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value).replace(/\s/g, '');
}
