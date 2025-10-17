/**
 * Shared utilities for metrics modules
 */

/**
 * Filters out non-finite values from a numeric series
 * @param {number[]|null|undefined} series - Input series
 * @returns {number[]} Sanitised numeric array
 */
export function sanitizeSeries(series) {
  if (!Array.isArray(series)) {
    return [];
  }

  return series.filter((value) => Number.isFinite(value));
}

/**
 * Clamps a confidence level between sensible bounds
 * @param {number} alpha - Confidence level (0 < alpha < 1)
 * @param {number} fallback - Fallback value if alpha is invalid
 * @returns {number} Clamped confidence level
 */
export function clampAlpha(alpha, fallback = 0.95) {
  if (!Number.isFinite(alpha)) {
    return fallback;
  }

  const minAlpha = 0.001;
  const maxAlpha = 0.999;
  return Math.min(maxAlpha, Math.max(minAlpha, alpha));
}

/**
 * Inverse of the standard normal cumulative distribution function
 * Implementation based on the approximation by Peter John Acklam
 * @param {number} p - Probability (0 < p < 1)
 * @returns {number} Z-score corresponding to the probability
 */
export function inverseStandardNormal(p) {
  const clampedP = clampAlpha(p, 0.5);

  // Coefficients in rational approximations
  const a = [
    -3.969683028665376e+01,
    2.209460984245205e+02,
    -2.759285104469687e+02,
    1.383577518672690e+02,
    -3.066479806614716e+01,
    2.506628277459239e+00,
  ];

  const b = [
    -5.447609879822406e+01,
    1.615858368580409e+02,
    -1.556989798598866e+02,
    6.680131188771972e+01,
    -1.328068155288572e+01,
  ];

  const c = [
    -7.784894002430293e-03,
    -3.223964580411365e-01,
    -2.400758277161838e+00,
    -2.549732539343734e+00,
    4.374664141464968e+00,
    2.938163982698783e+00,
  ];

  const d = [
    7.784695709041462e-03,
    3.224671290700398e-01,
    2.445134137142996e+00,
    3.754408661907416e+00,
  ];

  // Define break-points
  const plow = 0.02425;
  const phigh = 1 - plow;

  let q;
  let r;

  if (clampedP < plow) {
    // Rational approximation for lower region
    q = Math.sqrt(-2 * Math.log(clampedP));
    return (
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }

  if (clampedP > phigh) {
    // Rational approximation for upper region
    q = Math.sqrt(-2 * Math.log(1 - clampedP));
    return -(
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }

  // Rational approximation for central region
  q = clampedP - 0.5;
  r = q * q;
  return (
    (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
    (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
  );
}

/**
 * Computes annualised statistics from a return series
 * @param {number[]} returns - Return series (per-period)
 * @param {number} periodsPerYear - Number of periods per year
 * @returns {{
 *   sanitized: number[],
 *   meanReturn: number,
 *   cumulativeReturn: number,
 *   annualizedReturn: number,
 *   growthFactor: number,
 *   periodsCount: number
 * }} Annualised statistics
 */
export function computeAnnualizedStats(returns, periodsPerYear = 252) {
  const sanitized = sanitizeSeries(returns);

  if (sanitized.length === 0 || !Number.isFinite(periodsPerYear) || periodsPerYear <= 0) {
    return {
      sanitized: [],
      meanReturn: 0,
      cumulativeReturn: 0,
      annualizedReturn: 0,
      growthFactor: 1,
      periodsCount: 0,
    };
  }

  const periodsCount = sanitized.length;
  const meanReturn = sanitized.reduce((sum, value) => sum + value, 0) / periodsCount;
  const growthFactor = sanitized.reduce((product, value) => product * (1 + value), 1);
  const cumulativeReturn = growthFactor - 1;

  let annualizedReturn = 0;
  if (growthFactor > 0) {
    const scale = periodsPerYear / periodsCount;
    annualizedReturn = Math.pow(growthFactor, scale) - 1;
  } else {
    annualizedReturn = -1;
  }

  return {
    sanitized,
    meanReturn,
    cumulativeReturn,
    annualizedReturn,
    growthFactor,
    periodsCount,
  };
}

