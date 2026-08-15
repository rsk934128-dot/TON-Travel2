export type Language = 'en' | 'bn';

export interface Hotel {
  id: string;
  name: string;
  location: string;
  country: string;
  image: string;
  pricePerNightUsd: number;
  rating: number;
  reviewsCount: number;
  roomCategory: string;
  description: string;
  amenities: string[];
}

export interface Booking {
  reference: string;
  hotelId: string;
  hotelName: string;
  location: string;
  roomCategory: string;
  guests: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPaidUsd: number;
  totalPaidTon: number;
  cashbackPercent: number;
  cashbackTon: number;
  cashbackUsd: number;
  payoutWallet: string;
  primaryGuestName: string;
  primaryGuestEmail: string;
  telegramUsername: string;
  status: 'Guaranteed' | 'Pending' | 'Completed';
  createdAt: string;
  txHash?: string;
}

export interface TonWalletState {
  isConnected: boolean;
  address: string;
  walletName: string;
  balanceTon: number;
  balanceUsd: number;
  isPremium: boolean;
}

export interface QAItem {
  id: string;
  question: string;
  tgLink: string;
  views: string;
  answerSummary: string;
  videoDuration: string;
  transcript: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  preferredCurrency: 'TON' | 'USD' | 'EUR' | 'BDT';
  updatedAt: string;
}

export interface HotelReview {
  id: string;
  hotelId: string;
  authorName: string;
  rating: number;
  comment: string;
  stayDate: string;
  verifiedGuest: boolean;
  createdAt: string;
  userId?: string;
}

