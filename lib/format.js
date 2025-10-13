const formatterCache = new Map();

export function formatCurrency(value, { currency = "USD", compact = true } = {}) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "-";
  }

  const cacheKey = `${currency}-${compact}`;
  if (!formatterCache.has(cacheKey)) {
    formatterCache.set(
      cacheKey,
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        notation: compact ? "compact" : "standard",
        maximumFractionDigits: compact ? 1 : 2,
      })
    );
  }

  return formatterCache.get(cacheKey).format(Number(value));
}

export function formatPercent(value, { sign = true, decimals = 2 } = {}) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "-";
  }

  const formatted = Number(value).toFixed(decimals);
  return sign && value > 0 ? `+${formatted}%` : `${formatted}%`;
}

export function formatNumber(value, { decimals = 0 } = {}) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "-";
  }

  return Number(value).toLocaleString("en-US", {
    maximumFractionDigits: decimals,
  });
}
