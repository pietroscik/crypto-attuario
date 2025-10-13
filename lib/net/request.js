/**
 * Request helper with retry logic, timeout, and rate limiting
 * Provides a unified interface for API calls with resilience features
 */

// Rate limiting state
const lastRequestTimes = new Map();
const MIN_REQUEST_INTERVAL = 500; // 500ms minimum between requests to same endpoint

/**
 * Sleep utility for delays
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetches data from a URL with retry logic, timeout, and rate limiting
 * @param {string} url - The URL to fetch from
 * @param {Object} options - Fetch options
 * @param {number} options.timeout - Timeout in milliseconds (default: 10000)
 * @param {number} options.maxRetries - Maximum number of retries (default: 3)
 * @param {number} options.retryDelay - Initial retry delay in ms (default: 1000)
 * @param {Object} options.headers - Additional headers
 * @returns {Promise<any>} Parsed JSON response
 */
export async function fetchWithRetry(url, options = {}) {
  const {
    timeout = 10000,
    maxRetries = 3,
    retryDelay = 1000,
    headers = {},
    ...fetchOptions
  } = options;

  // Rate limiting: ensure minimum interval between requests
  const lastRequestTime = lastRequestTimes.get(url) || 0;
  const timeSinceLastRequest = Date.now() - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await sleep(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
  }
  lastRequestTimes.set(url, Date.now());

  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'crypto-attuario',
          ...headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      lastError = error;

      // Don't retry on abort (timeout) or client errors (4xx)
      if (error.name === 'AbortError' || (error.message && error.message.includes('HTTP 4'))) {
        throw new Error(`Request failed for ${url}: ${error.message || 'Timeout'}`);
      }

      // Exponential backoff for retries
      if (attempt < maxRetries) {
        const delay = retryDelay * Math.pow(2, attempt);
        console.warn(`Request to ${url} failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  throw new Error(`Request failed after ${maxRetries + 1} attempts: ${lastError?.message || 'Unknown error'}`);
}
