import { TON_USD_RATE } from '../data/hotels';

export type LoyaltyTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface CashbackCalculationResult {
  tier: LoyaltyTier;
  cashbackPercent: number;
  cashbackTon: number;
  cashbackUsd: number;
  bonusApplied: boolean;
}

export const MAX_CASHBACK_PERCENT = 4.0;

export const LOYALTY_TIER_RATES: Record<LoyaltyTier, number> = {
  Bronze: 1.5,
  Silver: 2.5,
  Gold: 3.5,
  Platinum: 4.0,
};

const isTier = (t: unknown): t is LoyaltyTier =>
  typeof t === 'string' &&
  Object.prototype.hasOwnProperty.call(LOYALTY_TIER_RATES, t);

/**
 * Calculates potential TON cashback rewards for a user based on their loyalty tier,
 * Telegram Premium status, and the booking total amount.
 * Cashback is funded from confirmed affiliate commissions and credited
 * after completed stay verification by the hotel provider.
 *
 * @param bookingTotalUsd Total booking cost in USD
 * @param loyaltyTier User loyalty tier from profile ('Bronze' | 'Silver' | 'Gold' | 'Platinum')
 * @param isPremium Whether the user has Telegram Premium (+0.5% bonus boost)
 * @param tonUsdRate Exchange rate for TON/USD (defaults to TON_USD_RATE)
 */
export function calculateTonCashback(
  bookingTotalUsd: number,
  loyaltyTier?: LoyaltyTier | string | null,
  isPremium?: boolean,
  tonUsdRate: number = TON_USD_RATE
): CashbackCalculationResult {
  // Input validation - return zero cashback safely on invalid or zero amounts
  if (
    !Number.isFinite(bookingTotalUsd) ||
    bookingTotalUsd <= 0 ||
    !Number.isFinite(tonUsdRate) ||
    tonUsdRate <= 0
  ) {
    const fallbackTier: LoyaltyTier = isTier(loyaltyTier) ? loyaltyTier : 'Bronze';
    return {
      tier: fallbackTier,
      cashbackPercent: LOYALTY_TIER_RATES[fallbackTier],
      cashbackTon: 0,
      cashbackUsd: 0,
      bonusApplied: false,
    };
  }

  const tier: LoyaltyTier = isTier(loyaltyTier) ? loyaltyTier : 'Bronze';
  let percent = LOYALTY_TIER_RATES[tier];
  let bonusApplied = false;

  if (isPremium) {
    percent = Math.min(MAX_CASHBACK_PERCENT, percent + 0.5);
    bonusApplied = true;
  }

  const cashbackUsd = (bookingTotalUsd * percent) / 100;
  const cashbackTon = cashbackUsd / tonUsdRate;

  return {
    tier,
    cashbackPercent: percent,
    cashbackTon,
    cashbackUsd,
    bonusApplied,
  };
}
