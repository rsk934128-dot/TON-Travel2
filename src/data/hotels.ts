import { Hotel, Booking } from '../types';

export const TON_USD_RATE = 5.42; // 1 TON = $5.42 USD

export const HOTELS: Hotel[] = [
  {
    id: 'standard-highline-ny',
    name: 'The Standard High Line',
    location: 'New York, USA',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    pricePerNightUsd: 340,
    rating: 4.8,
    reviewsCount: 1420,
    roomCategory: 'Standard Queen Hudson View',
    description: 'Rising above a former elevated train line turn-of-the-century park in Manhattan Meatpacking District, offering sweeping 360-degree views of New York City and Hudson River.',
    amenities: ['Hudson River View', 'High-Speed Wi-Fi', 'TON Cashback 8%', '24/7 Room Service', 'Rooftop Lounge']
  },
  {
    id: 'burj-al-arab-dubai',
    name: 'Burj Al Arab Jumeirah',
    location: 'Dubai, UAE',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    pricePerNightUsd: 850,
    rating: 4.95,
    reviewsCount: 3890,
    roomCategory: 'Deluxe Marina Suite',
    description: 'World landmark of Arabian luxury. Experience ultimate hospitality with butler service, private beach access, and signature TON Telegram Premium benefits.',
    amenities: ['Helipad Access', 'Private Beach', 'Infinity Pool', 'Underwater Dining', 'TON Cashback 10%']
  },
  {
    id: 'the-ritz-london',
    name: 'The Ritz London',
    location: 'London, UK',
    country: 'UK',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    pricePerNightUsd: 520,
    rating: 4.9,
    reviewsCount: 2150,
    roomCategory: 'Executive King Green Park View',
    description: 'An iconic 5-star hotel in Piccadilly overlooking Green Park. Louis XVI style interiors, Michelin-starred cuisine, and instant crypto voucher verification.',
    amenities: ['Afternoon Tea', 'Michelin Star Restaurant', 'Valet Parking', 'Green Park View', 'TON Cashback 8%']
  },
  {
    id: 'park-hyatt-tokyo',
    name: 'Park Hyatt Tokyo',
    location: 'Shinjuku, Tokyo, Japan',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    pricePerNightUsd: 460,
    rating: 4.88,
    reviewsCount: 1840,
    roomCategory: 'Park Deluxe Room Mount Fuji View',
    description: 'Occupying the top 14 floors of a 52-story tower in Shinjuku, featuring breathtaking views of Mount Fuji and Tokyo skyline.',
    amenities: ['Mt Fuji Views', 'New York Bar', 'Spa & Pool', 'Subway Access', 'TON Cashback 8%']
  },
  {
    id: 'hotel-plaza-athenee-paris',
    name: 'Hôtel Plaza Athénée',
    location: 'Paris, France',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
    pricePerNightUsd: 680,
    rating: 4.92,
    reviewsCount: 1670,
    roomCategory: 'Eiffel Tower View Deluxe',
    description: 'Situated on the prestigious avenue Montaigne, near the Champs-Élysées. Renowned for signature red geraniums and unmatched Eiffel Tower balconies.',
    amenities: ['Eiffel Tower View', 'Dior Spa', 'Haute Cuisine', 'Luxury Boutique Access', 'TON Cashback 8%']
  }
];

export const INITIAL_VOUCHER: Booking = {
  reference: '#TON-143628',
  hotelId: 'standard-highline-ny',
  hotelName: 'The Standard High Line',
  location: 'New York, USA',
  roomCategory: 'Standard Queen Hudson View',
  guests: 2,
  checkIn: '2026-08-15',
  checkOut: '2026-08-18',
  nights: 3,
  totalPaidUsd: 1020.00,
  totalPaidTon: 188.19,
  cashbackPercent: 8,
  cashbackTon: 15.055,
  cashbackUsd: 81.60,
  payoutWallet: 'EQBvW839_TonSpace_cX92',
  primaryGuestName: 'Alex Morgan',
  primaryGuestEmail: 'alex.morgan@telegram.me',
  telegramUsername: '@alex_morgan_ton',
  status: 'Guaranteed',
  createdAt: '2026-08-14T22:22:00Z',
  txHash: '0x7f3a9b1c8e5d2f4a6c8b0d2e4f6a8c0b2d4e6f8a'
};
