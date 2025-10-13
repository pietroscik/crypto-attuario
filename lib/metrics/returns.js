/**
 * Returns calculations module
 * Functions for calculating percentage and log returns
 */

/**
 * Converts a price series to percentage returns (arithmetic)
 * @param {number[]} series - Array of prices
 * @returns {number[]} Array of percentage returns
 */
export function toPctReturns(series) {
  if (!Array.isArray(series) || series.length < 2) {
    return [];
  }

  const returns = [];
  for (let i = 1; i < series.length; i++) {
    if (series[i - 1] > 0 && Number.isFinite(series[i]) && Number.isFinite(series[i - 1])) {
      const r = (series[i] / series[i - 1]) - 1;
      if (Number.isFinite(r)) {
        returns.push(r);
      }
    }
  }
  return returns;
}

/**
 * Converts a price series to log returns
 * @param {number[]} series - Array of prices
 * @returns {number[]} Array of log returns
 */
export function toLogReturns(series) {
  if (!Array.isArray(series) || series.length < 2) {
    return [];
  }

  const returns = [];
  for (let i = 1; i < series.length; i++) {
    if (series[i] > 0 && series[i - 1] > 0 && Number.isFinite(series[i]) && Number.isFinite(series[i - 1])) {
      const r = Math.log(series[i] / series[i - 1]);
      if (Number.isFinite(r)) {
        returns.push(r);
      }
    }
  }
  return returns;
}

/**
 * Calculates rolling statistic over a window
 * @param {number[]} series - Data series
 * @param {number} window - Window size
 * @param {Function} fn - Function to apply to each window (receives array, returns number)
 * @returns {number[]} Array of rolling statistics
 */
export function rolling(series, window, fn) {
  if (!Array.isArray(series) || series.length < window || window < 1) {
    return [];
  }

  const result = [];
  for (let i = window - 1; i < series.length; i++) {
    const windowData = series.slice(i - window + 1, i + 1);
    const stat = fn(windowData);
    if (Number.isFinite(stat)) {
      result.push(stat);
    } else {
      result.push(null);
    }
  }
  return result;
}

/**
 * Calculates cumulative returns from a series of returns
 * @param {number[]} returns - Array of returns
 * @param {boolean} logReturns - Whether returns are log returns (default: false)
 * @returns {number[]} Array of cumulative returns
 */
export function cumulativeReturns(returns, logReturns = false) {
  if (!Array.isArray(returns) || returns.length === 0) {
    return [];
  }

  const cumulative = [];
  let cum = 0;

  for (let i = 0; i < returns.length; i++) {
    if (logReturns) {
      cum += returns[i];
      cumulative.push(Math.exp(cum) - 1);
    } else {
      cum = (1 + cum) * (1 + returns[i]) - 1;
      cumulative.push(cum);
    }
  }

  return cumulative;
}

/**
 * Annualizes a return
 * @param {number} ret - Return value
 * @param {number} periods - Number of periods per year (default: 252 for daily)
 * @returns {number} Annualized return
 */
export function annualize(ret, periods = 252) {
  if (!Number.isFinite(ret) || !Number.isFinite(periods) || periods <= 0) {
    return 0;
  }
  return Math.pow(1 + ret, periods) - 1;
}
