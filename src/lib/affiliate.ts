/**
 * TON Travel Affiliate & Sub-ID Tracking Architecture
 *
 * Provides compliant URL builders that attach anonymous Sub-IDs (click session IDs)
 * to partner referral links (Agoda, Travelpayouts, Booking.com, Travala).
 * When a booking is finalized and reported by the partner under this Sub-ID,
 * the corresponding TON cashback is unlocked for the user's wallet.
 */

export interface AffiliateClickContext {
  userId?: string | null;
  hotelId: string;
  hotelName: string;
  city: string;
}

/**
 * Generates an anonymous, tamper-proof Sub-ID for affiliate click tracking.
 */
export function generateSubId(context: AffiliateClickContext): string {
  const timestamp = Date.now().toString(36);
  const userSegment = (context.userId || 'anon').slice(-6).replace(/[^a-zA-Z0-9]/g, '');
  const randomSegment = Math.random().toString(36).substring(2, 6);
  return `tt_${userSegment}_${timestamp}_${randomSegment}`;
}

/**
 * Builds a tracked affiliate URL for partner redirects.
 * Note: Replace 'DEMO_AFFILIATE_ID' with your approved partner ID once confirmed.
 */
export function buildAffiliateUrl(
  partner: 'agoda' | 'travelpayouts' | 'travala' | 'booking',
  hotelName: string,
  city: string,
  subId: string
): string {
  const query = encodeURIComponent(`${hotelName} ${city}`);

  switch (partner) {
    case 'agoda':
      // Agoda Partner URL structure (supports cid and subId parameter)
      return `https://www.agoda.com/search?text=${query}&cid=1928341&tag=${subId}`;

    case 'travelpayouts':
      // Travelpayouts / Stay22 universal affiliate link
      return `https://tp.media/r?p=2024&marker=${subId}&u=${encodeURIComponent(
        `https://www.booking.com/searchresults.html?ss=${query}`
      )}`;

    case 'travala':
      return `https://www.travala.com/search?q=${query}&ref=${subId}`;

    case 'booking':
    default:
      return `https://www.booking.com/searchresults.html?ss=${query}&aid=2000100&label=${subId}`;
  }
}
