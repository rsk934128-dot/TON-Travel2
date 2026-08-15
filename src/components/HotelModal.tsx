import React, { useState } from 'react';
import { Hotel, TonWalletState, Language, UserProfile, HotelReview } from '../types';
import { TON_USD_RATE } from '../data/hotels';
import { calculateTonCashback } from '../lib/cashback';
import { Calendar, Users, Crown, ShieldCheck, ArrowRight, X, MapPin, Star, Sparkles, Award } from 'lucide-react';
import { HotelReviewsSection } from './HotelReviewsSection';

interface HotelModalProps {
  hotel: Hotel | null;
  isOpen: boolean;
  onClose: () => void;
  wallet: TonWalletState;
  userProfile?: UserProfile | null;
  lang: Language;
  reviews: HotelReview[];
  onAddReview: (review: HotelReview) => Promise<void>;
  onProceedToPayment: (
    hotel: Hotel,
    checkIn: string,
    checkOut: string,
    nights: number,
    guests: number
  ) => void;
}

export const HotelModal: React.FC<HotelModalProps> = ({
  hotel,
  isOpen,
  onClose,
  wallet,
  userProfile,
  lang,
  reviews,
  onAddReview,
  onProceedToPayment,
}) => {
  const [checkIn, setCheckIn] = useState('2026-08-15');
  const [checkOut, setCheckOut] = useState('2026-08-18');
  const [guests, setGuests] = useState(2);

  if (!isOpen || !hotel) return null;

  // Calculate nights
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const totalPriceUsd = hotel.pricePerNightUsd * nights;
  const totalPriceTon = totalPriceUsd / TON_USD_RATE;

  // Calculate potential TON cashback reward via utility function
  const cashbackResult = calculateTonCashback(
    totalPriceUsd,
    userProfile?.loyaltyTier,
    wallet.isPremium,
    TON_USD_RATE
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl relative text-slate-100 max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-full z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-48 sm:h-56 shrink-0">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full w-fit mb-1 border border-white/10">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{hotel.rating} Rating</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">{hotel.name}</h2>
            <p className="text-xs text-slate-300 flex items-center space-x-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{hotel.location}</span>
            </p>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          
          {/* Room Category */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">Selected Room Category</div>
              <div className="text-sm font-semibold text-cyan-300 mt-0.5">{hotel.roomCategory}</div>
            </div>
            {userProfile?.loyaltyTier && (
              <div className="bg-cyan-950/80 border border-cyan-500/40 px-2.5 py-1 rounded-lg flex items-center space-x-1 text-cyan-300 text-xs font-mono font-bold">
                <Award className="w-3.5 h-3.5 text-cyan-400" />
                <span>{userProfile.loyaltyTier} Tier</span>
              </div>
            )}
          </div>

          {/* Date & Guest Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase flex items-center space-x-1 mb-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Check-In</span>
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase flex items-center space-x-1 mb-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Check-Out</span>
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase flex items-center space-x-1 mb-1">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Guests</span>
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value={1}>1 Guest</option>
                <option value={2}>2 Guests</option>
                <option value={3}>3 Guests</option>
                <option value={4}>4 Guests</option>
              </select>
            </div>
          </div>

          {/* Price Breakdown Box */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Rate per night:</span>
              <span>${hotel.pricePerNightUsd} USD</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Nights duration:</span>
              <span>{nights} night(s)</span>
            </div>
            <div className="flex justify-between text-white font-bold text-sm border-t border-slate-800 pt-2">
              <span>Total Booking Cost:</span>
              <span className="text-cyan-300">${totalPriceUsd.toFixed(2)} USD ({totalPriceTon.toFixed(2)} TON)</span>
            </div>

            {/* Dynamic Calculated TON Cashback Reward Banner */}
            <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-emerald-950/60 border border-amber-500/40 p-3 rounded-xl flex items-center justify-between text-amber-300 mt-2 font-sans shadow-inner">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-amber-200 flex items-center space-x-1.5">
                    <span>{cashbackResult.tier} Loyalty ({cashbackResult.cashbackPercent}% Cashback)</span>
                    {cashbackResult.bonusApplied && (
                      <span className="text-[10px] bg-amber-400 text-slate-950 font-mono font-black px-1.5 py-0.2 rounded">
                        +TG Premium
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Potential TON Reward for this stay
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-emerald-400 font-black font-mono text-sm tracking-tight">
                  +{cashbackResult.cashbackTon.toFixed(3)} TON
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  (${cashbackResult.cashbackUsd.toFixed(2)} USD value)
                </div>
              </div>
            </div>
          </div>

          {/* Hotel Reviews & Guest Testimonials Section */}
          <div className="pt-2">
            <HotelReviewsSection
              hotelId={hotel.id}
              hotelName={hotel.name}
              reviews={reviews}
              onAddReview={onAddReview}
              userProfile={userProfile}
              lang={lang}
            />
          </div>

        </div>

        {/* Action Button */}
        <div className="p-6 pt-0 shrink-0">
          <button
            onClick={() => onProceedToPayment(hotel, checkIn, checkOut, nights, guests)}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 transition"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Proceed to TON Connect Payment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
