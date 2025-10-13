/**
 * Arbitrage scanning module (SIMULATION ONLY - Educational purposes)
 * Scans for price differentials between venues
 * 
 * ⚠️ DISCLAIMER: This is for educational purposes only.
 * No actual trading execution. No financial advice.
 */

/**
 * Scans for arbitrage opportunities between different venues
 * @param {Object} quotesByVenue - Object with venue names as keys and quotes as values
 *        Each quote: { bid, ask, volume, timestamp }
 * @param {Object} options - Scan options
 * @param {number} options.minSpread - Minimum spread to consider (default: 0.004 = 0.4%)
 * @param {number} options.feeModel - Fee model: 'conservative' or 'optimistic' (default: 'conservative')
 * @param {number} options.maxSize - Maximum trade size to simulate (default: 1000 USD)
 * @returns {Array} Array of arbitrage opportunities
 */
export function scanPairs(quotesByVenue, options = {}) {
  const {
    minSpread = 0.004,
    feeModel = 'conservative',
    maxSize = 1000,
  } = options;

  // Fee assumptions
  const fees = feeModel === 'conservative' 
    ? { maker: 0.002, taker: 0.004, withdrawal: 0.001 }  // 0.2% maker, 0.4% taker, 0.1% withdrawal
    : { maker: 0.001, taker: 0.002, withdrawal: 0.0005 }; // 0.1% maker, 0.2% taker, 0.05% withdrawal

  const totalFees = fees.taker * 2 + fees.withdrawal; // Buy at one venue, sell at another, plus withdrawal

  const opportunities = [];
  const venues = Object.keys(quotesByVenue);

  // Compare all venue pairs
  for (let i = 0; i < venues.length; i++) {
    for (let j = i + 1; j < venues.length; j++) {
      const venue1 = venues[i];
      const venue2 = venues[j];

      const quote1 = quotesByVenue[venue1];
      const quote2 = quotesByVenue[venue2];

      // Validate quotes
      if (!isValidQuote(quote1) || !isValidQuote(quote2)) {
        continue;
      }

      // Calculate spreads in both directions
      // Direction 1: Buy at venue1, sell at venue2
      const spread1 = (quote2.bid - quote1.ask) / quote1.ask;
      
      // Direction 2: Buy at venue2, sell at venue1
      const spread2 = (quote1.bid - quote2.ask) / quote2.ask;

      // Check if profitable after fees
      const netSpread1 = spread1 - totalFees;
      const netSpread2 = spread2 - totalFees;

      if (netSpread1 > minSpread) {
        const size = Math.min(maxSize, quote1.volume || maxSize, quote2.volume || maxSize);
        
        opportunities.push({
          buyVenue: venue1,
          sellVenue: venue2,
          buyPrice: quote1.ask,
          sellPrice: quote2.bid,
          grossSpread: spread1,
          netSpread: netSpread1,
          estimatedProfit: size * netSpread1,
          size,
          timestamp: Math.max(quote1.timestamp || 0, quote2.timestamp || 0),
          simulated: true,
        });
      }

      if (netSpread2 > minSpread) {
        const size = Math.min(maxSize, quote1.volume || maxSize, quote2.volume || maxSize);
        
        opportunities.push({
          buyVenue: venue2,
          sellVenue: venue1,
          buyPrice: quote2.ask,
          sellPrice: quote1.bid,
          grossSpread: spread2,
          netSpread: netSpread2,
          estimatedProfit: size * netSpread2,
          size,
          timestamp: Math.max(quote1.timestamp || 0, quote2.timestamp || 0),
          simulated: true,
        });
      }
    }
  }

  // Sort by net spread descending
  opportunities.sort((a, b) => b.netSpread - a.netSpread);

  return opportunities;
}

/**
 * Scans for triangular arbitrage opportunities (if orderbook data available)
 * @param {Object} orderbook - Orderbook with multiple trading pairs
 * @param {Object} options - Scan options
 * @returns {Array} Array of triangular arbitrage opportunities
 */
export function triangularScan(orderbook, options = {}) {
  const {
    minProfit = 0.005,
    feeModel = 'conservative',
  } = options;

  // Fee assumptions
  const fees = feeModel === 'conservative' 
    ? { taker: 0.004 }  // 0.4% taker fee per trade
    : { taker: 0.002 }; // 0.2% taker fee per trade

  const opportunities = [];

  // Example: BTC/USD, ETH/USD, ETH/BTC
  // Path: USD -> BTC -> ETH -> USD
  
  // This is a simplified version - real triangular arb requires complex orderbook analysis
  // For educational purposes, we'll return a placeholder
  
  console.warn('triangularScan: Basic implementation - requires detailed orderbook data');
  
  return opportunities;
}

/**
 * Validates a price quote
 * @param {Object} quote - Quote object
 * @returns {boolean} True if valid
 */
function isValidQuote(quote) {
  if (!quote || typeof quote !== 'object') {
    return false;
  }

  if (typeof quote.bid !== 'number' || typeof quote.ask !== 'number') {
    return false;
  }

  if (quote.bid <= 0 || quote.ask <= 0) {
    return false;
  }

  if (quote.bid >= quote.ask) {
    return false; // Invalid quote (bid should be lower than ask)
  }

  return true;
}

/**
 * Calculates slippage impact on trade
 * @param {number} size - Trade size
 * @param {number} liquidity - Available liquidity
 * @param {number} basePrice - Base price
 * @returns {number} Price after slippage
 */
export function calculateSlippage(size, liquidity, basePrice) {
  if (liquidity === 0) {
    return basePrice;
  }

  // Simple linear slippage model
  const slippageRate = Math.min(size / liquidity, 0.05); // Max 5% slippage
  return basePrice * (1 + slippageRate);
}

/**
 * Formats arbitrage opportunity for display
 * @param {Object} opp - Opportunity object
 * @returns {string} Formatted string
 */
export function formatOpportunity(opp) {
  const pctSpread = (opp.netSpread * 100).toFixed(2);
  const profit = opp.estimatedProfit.toFixed(2);
  
  return `Buy @${opp.buyVenue} $${opp.buyPrice.toFixed(2)}, Sell @${opp.sellVenue} $${opp.sellPrice.toFixed(2)} | Spread: ${pctSpread}% | Est. Profit: $${profit} (SIMULATED)`;
}
