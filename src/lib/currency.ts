import { TON_USD_RATE } from '../data/hotels';

export type PreferredCurrency = 'TON' | 'USD' | 'EUR' | 'BDT';

export interface CurrencyDetails {
  code: PreferredCurrency;
  symbol: string;
  name: string;
  rateFromUsd: number;
  flag: string;
}

export const CURRENCY_CONFIG: Record<PreferredCurrency, CurrencyDetails> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rateFromUsd: 1,
    flag: '💵',
  },
  TON: {
    code: 'TON',
    symbol: 'TON',
    name: 'Telegram Open Network',
    rateFromUsd: 1 / TON_USD_RATE,
    flag: '💎',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    rateFromUsd: 0.92,
    flag: '💶',
  },
  BDT: {
    code: 'BDT',
    symbol: '৳',
    name: 'Bangladeshi Taka',
    rateFromUsd: 118.0,
    flag: '৳',
  },
};

/**
 * Converts a USD price to the user's preferred currency.
 */
export function convertFromUsd(
  amountUsd: number,
  targetCurrency?: PreferredCurrency | string | null
): { formatted: string; amount: number; symbol: string; code: PreferredCurrency; flag: string } {
  const validCode: PreferredCurrency =
    targetCurrency && targetCurrency in CURRENCY_CONFIG
      ? (targetCurrency as PreferredCurrency)
      : 'USD';

  const config = CURRENCY_CONFIG[validCode];
  const converted = amountUsd * config.rateFromUsd;

  let formatted = '';
  if (validCode === 'TON') {
    formatted = `${converted.toFixed(2)} TON`;
  } else if (validCode === 'BDT') {
    formatted = `${config.symbol}${Math.round(converted).toLocaleString('en-US')} BDT`;
  } else if (validCode === 'EUR') {
    formatted = `${config.symbol}${converted.toFixed(2)} EUR`;
  } else {
    formatted = `${config.symbol}${amountUsd.toFixed(2)} USD`;
  }

  return {
    formatted,
    amount: converted,
    symbol: config.symbol,
    code: config.code,
    flag: config.flag,
  };
}
