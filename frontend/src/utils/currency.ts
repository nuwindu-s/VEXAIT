export type SupportedCurrency = 'USD' | 'LKR' | 'EUR' | 'GBP' | 'AUD' | 'CAD' | 'AED' | 'SGD';

export interface CurrencyOption {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  flag: string;
  rateFromUSD: number; // 1 USD = X in this currency
}

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', rateFromUSD: 1.0 },
  { code: 'LKR', symbol: 'Rs.', name: 'Sri Lankan Rupee', flag: '🇱🇰', rateFromUSD: 300.0 },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', rateFromUSD: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', rateFromUSD: 0.79 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺', rateFromUSD: 1.54 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦', rateFromUSD: 1.39 },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', flag: '🇦🇪', rateFromUSD: 3.67 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬', rateFromUSD: 1.34 },
];

export const DEFAULT_CURRENCY: SupportedCurrency = 'USD';

export interface FormatPriceOptions {
  startingPrefix?: boolean; // If true, adds "From " if not already present
  hideSuffix?: boolean;     // If true, suppresses + or / month
}

/**
 * Converts a price string (e.g., "Rs. 35,000", "Rs. 110,000+", "Rs. 20,000 / month", "$120")
 * to the target currency.
 */
export function formatPriceInCurrency(
  priceStr: string | undefined | null,
  targetCurrency: SupportedCurrency = DEFAULT_CURRENCY,
  options: FormatPriceOptions = {}
): string {
  if (!priceStr) return '';

  const hasStartingFrom = /starting from|from/i.test(priceStr);
  const hasPlus = priceStr.includes('+');
  const hasPerMonth = /\/\s*(month|mo)/i.test(priceStr);

  // Extract digits and optional decimal
  const cleaned = priceStr.replace(/,/g, '').match(/\d+(\.\d+)?/);
  if (!cleaned) {
    return priceStr;
  }

  const rawNum = parseFloat(cleaned[0]);
  if (isNaN(rawNum) || rawNum === 0) {
    return priceStr;
  }

  // Determine source currency
  let sourceCurrency: SupportedCurrency = 'LKR';
  if (priceStr.includes('$')) {
    sourceCurrency = 'USD';
  } else if (priceStr.includes('€')) {
    sourceCurrency = 'EUR';
  } else if (priceStr.includes('£')) {
    sourceCurrency = 'GBP';
  } else if (priceStr.includes('Rs') || priceStr.includes('LKR')) {
    sourceCurrency = 'LKR';
  } else {
    sourceCurrency = rawNum > 1000 ? 'LKR' : 'USD';
  }

  // Convert to USD first
  const sourceRate = SUPPORTED_CURRENCIES.find((c) => c.code === sourceCurrency)?.rateFromUSD || 1.0;
  const amountInUSD = rawNum / sourceRate;

  // Convert USD to target currency
  const targetOption = SUPPORTED_CURRENCIES.find((c) => c.code === targetCurrency) || SUPPORTED_CURRENCIES[0];
  const targetRate = targetOption.rateFromUSD;
  const convertedAmount = amountInUSD * targetRate;

  // Formatting based on target currency
  let formattedNumber: string;
  if (targetCurrency === 'LKR') {
    const rounded = Math.round(convertedAmount / 500) * 500;
    formattedNumber = rounded.toLocaleString('en-LK');
  } else if (targetCurrency === 'USD' || targetCurrency === 'EUR' || targetCurrency === 'GBP') {
    let rounded: number;
    if (convertedAmount >= 100) {
      rounded = Math.round(convertedAmount / 5) * 5;
    } else {
      rounded = Math.round(convertedAmount);
    }
    formattedNumber = rounded.toLocaleString('en-US');
  } else {
    let rounded: number;
    if (convertedAmount >= 100) {
      rounded = Math.round(convertedAmount / 5) * 5;
    } else {
      rounded = Math.round(convertedAmount);
    }
    formattedNumber = rounded.toLocaleString('en-US');
  }

  const symbolFormatted = (targetOption.symbol.endsWith('.') || targetOption.symbol.length > 1)
    ? `${targetOption.symbol} `
    : targetOption.symbol;

  const prefix = (options.startingPrefix && !hasStartingFrom) ? 'From ' : (hasStartingFrom && options.startingPrefix !== false ? 'From ' : '');
  const suffix = options.hideSuffix ? '' : `${hasPlus ? '+' : ''}${hasPerMonth ? ' / month' : ''}`;

  return `${prefix}${symbolFormatted}${formattedNumber}${suffix}`.trim();
}
