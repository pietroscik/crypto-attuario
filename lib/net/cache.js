/**
 * Simple in-memory cache with TTL support
 * Optionally persists to localStorage for client-side caching
 */

// In-memory cache
const cache = new Map();

// Counters for monitoring (imported from request module)
let counters = null;
if (typeof window !== 'undefined') {
  // Dynamically import to track cached requests
  import('./request.js').then(module => {
    counters = module.counters;
  }).catch(() => {
    // Ignore import errors
  });
}

/**
 * Emits a network status event (browser only)
 */
function emitCachedEvent() {
  if (typeof window !== 'undefined' && counters) {
    counters.cached++;
    window.dispatchEvent(new CustomEvent('network-status', {
      detail: { ...counters }
    }));
  }
}

/**
 * Cache entry structure
 * @typedef {Object} CacheEntry
 * @property {*} value - Cached value
 * @property {number} expiresAt - Expiration timestamp
 */

/**
 * Gets a value from cache if not expired
 * @param {string} key - Cache key
 * @param {number} ttlMs - Time-to-live in milliseconds (optional, uses stored TTL if not provided)
 * @returns {*|null} Cached value or null if not found/expired
 */
export function get(key, ttlMs) {
  const entry = cache.get(key);
  
  if (!entry) {
    // Try localStorage as fallback (client-side only)
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem(`cache:${key}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.expiresAt > Date.now()) {
            // Restore to in-memory cache
            cache.set(key, parsed);
            emitCachedEvent();
            return parsed.value;
          } else {
            // Expired, remove from localStorage
            localStorage.removeItem(`cache:${key}`);
          }
        }
      } catch (err) {
        console.warn('Cache localStorage read error:', err);
      }
    }
    return null;
  }

  // Check expiration
  if (entry.expiresAt < Date.now()) {
    cache.delete(key);
    // Remove from localStorage if exists
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem(`cache:${key}`);
      } catch (err) {
        // Ignore errors
      }
    }
    return null;
  }

  // Track that we used cached data
  emitCachedEvent();
  
  return entry.value;
}

/**
 * Sets a value in cache with TTL
 * @param {string} key - Cache key
 * @param {*} value - Value to cache
 * @param {number} ttlMs - Time-to-live in milliseconds (default: 60000)
 * @param {boolean} persist - Whether to persist to localStorage (default: false)
 */
export function set(key, value, ttlMs = 60000, persist = false) {
  const entry = {
    value,
    expiresAt: Date.now() + ttlMs,
  };

  cache.set(key, entry);

  // Optionally persist to localStorage
  if (persist && typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(`cache:${key}`, JSON.stringify(entry));
    } catch (err) {
      console.warn('Cache localStorage write error:', err);
    }
  }
}

/**
 * Removes a value from cache
 * @param {string} key - Cache key
 */
export function remove(key) {
  cache.delete(key);
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.removeItem(`cache:${key}`);
    } catch (err) {
      // Ignore errors
    }
  }
}

/**
 * Clears all cache entries
 * @param {boolean} clearLocalStorage - Also clear localStorage cache entries
 */
export function clear(clearLocalStorage = false) {
  cache.clear();
  
  if (clearLocalStorage && typeof window !== 'undefined' && window.localStorage) {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('cache:')) {
          localStorage.removeItem(key);
        }
      });
    } catch (err) {
      console.warn('Cache localStorage clear error:', err);
    }
  }
}

/**
 * Gets or fetches a value with caching
 * @param {string} key - Cache key
 * @param {Function} fetchFn - Function that returns a Promise with the value
 * @param {number} ttlMs - Time-to-live in milliseconds (default: 60000)
 * @param {boolean} persist - Whether to persist to localStorage (default: false)
 * @returns {Promise<*>} Cached or fetched value
 */
export async function getOrFetch(key, fetchFn, ttlMs = 60000, persist = false) {
  const cached = get(key, ttlMs);
  if (cached !== null) {
    return cached;
  }

  const value = await fetchFn();
  set(key, value, ttlMs, persist);
  return value;
}
