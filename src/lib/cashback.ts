import { UserProfile } from '../types';
import { TON_USD_RATE } from '../data/hotels';

export type LoyaltyTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface CashbackCalculationResult {
  tier: LoyaltyTier;
  cashbackPercent: number;
  cashbackTon: number;
  cashbackUsd: number;
  bonusApplied: boolean;
}

export const LOYALTY_TIER_RATES: Record<LoyaltyTier, number> = {
  Bronze: 2,
  Silver: 5,
  Gold: 8,
  Platinum: 12,
};

/**
 * Calculates potential TON cashback rewards for a user based on their loyalty tier,
 * Telegram Premium status, and the booking total amount.
 *
 * @param bookingTotalUsd Total booking cost in USD
 * @param loyaltyTier User loyalty tier from profile ('Bronze' | 'Silver' | 'Gold' | 'Platinum')
 * @param isPremium Whether the user has Telegram Premium (+2% bonus boost)
 * @param tonUsdRate Exchange rate for TON/USD (defaults to TON_USD_RATE)
 */
export function calculateTonCashback(
  bookingTotalUsd: number,
  loyaltyTier?: LoyaltyTier | string | null,
  isPremium?: boolean,
  tonUsdRate: number = TON_USD_RATE
): CashbackCalculationResult {
  const normalizedTier: LoyaltyTier =
    loyaltyTier && loyaltyTier in LOYALTY_TIER_RATES
      ? (loyaltyTier as LoyaltyTier)
      : isPremium
      ? 'Gold'
      : 'Bronze';

  let basePercent = LOYALTY_TIER_RATES[normalizedTier] ?? 3;
  let bonusApplied = false;

  if (isPremium) {
    basePercent = Math.min(12, basePercent + 2);
    bonusApplied = true;
  }

  const bookingTotalTon = bookingTotalUsd / (tonUsdRate || 1);
  const cashbackTon = (bookingTotalTon * basePercent) / 100;
  const cashbackUsd = (bookingTotalUsd * basePercent) / 100;

  return {
    tier: normalizedTier,
    cashbackPercent: basePercent,
    cashbackTon,
    cashbackUsd,
    bonusApplied,
  };
}
