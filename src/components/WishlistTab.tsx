import React from 'react';
import { Hotel, WishlistItem, Language, UserProfile, HotelReview } from '../types';
import { HotelCard } from './HotelCard';
import { Heart, Sparkles, Hotel as HotelIcon, ArrowRight, ShieldCheck, Trash2 } from 'lucide-react';

interface WishlistTabProps {
  wishlist: WishlistItem[];
  allHotels: Hotel[];
  userProfile?: UserProfile | null;
  lang: Language;
  onBookHotel: (hotel: Hotel) => void;
  onToggleWishlist: (hotel: Hotel) => void;
  reviews: HotelReview[];
  onAddReview: (review: HotelReview) => Promise<void>;
  isPremium: boolean;
  onExploreHotels: () => void;
}

export const WishlistTab: React.FC<WishlistTabProps> = ({
  wishlist,
  allHotels,
  userProfile,
  lang,
  onBookHotel,
  onToggleWishlist,
  reviews,
  onAddReview,
  isPremium,
  onExploreHotels,
}) => {
  // Map wishlist item hotelIds to full Hotel objects
  const savedHotelIds = new Set(wishlist.map((item) => item.hotelId));
  const savedHotels = allHotels.filter((hotel) => savedHotelIds.has(hotel.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
        
        <div className="space-y-2 z-10">
          <div className="flex items-center space-x-2">
            <span className="bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center space-x-1 font-mono">
              <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
              <span>{lang === 'en' ? 'Saved Collections' : 'সংরক্ষিত তালিকা'}</span>
            </span>
            <span className="bg-slate-800 text-slate-300 text-xs font-mono px-2 py-0.5 rounded-full border border-slate-700">
              {savedHotels.length} {lang === 'en' ? 'Hotels' : 'টি হোটেল'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-3">
            <span>{lang === 'en' ? 'Your Personal Wishlist' : 'আপনার উইশলিস্ট'}</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
            {lang === 'en'
              ? 'Saved hotel destinations are automatically synchronized with your Cloud Firestore profile. Book with TON anytime to receive instant cashback.'
              : 'সংরক্ষিত হোটেলগুলো আপনার ক্লাউড ফায়ারবেস প্রোফাইলের সাথে সিঙ্ক রয়েছে। TON পেমেন্ট করে ক্যাশব্যাক উপভোগ করুন।'}
          </p>
        </div>

        {savedHotels.length > 0 && (
          <div className="shrink-0 flex items-center space-x-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'en' ? 'Synced with Firestore' : 'ফায়ারবেসে সুরক্ষিত'}</span>
          </div>
        )}
      </div>

      {/* Wishlist Grid or Empty State */}
      {savedHotels.length === 0 ? (
        <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
            <Heart className="w-8 h-8 text-rose-400" />
          </div>

          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-white">
              {lang === 'en' ? 'Your Wishlist is Empty' : 'আপনার উইশলিস্ট খালি'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'Explore luxury stays and tap the heart icon on any hotel card to save it to your profile for easy access later.'
                : 'পছন্দের হোটেলগুলোর হার্ট আইকনে ক্লিক করে উইশলিস্টে সেভ করে রাখুন।'}
            </p>
          </div>

          <button
            onClick={onExploreHotels}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg transition"
          >
            <HotelIcon className="w-4 h-4" />
            <span>{lang === 'en' ? 'Browse Featured Hotels' : 'হোটেল ব্রাউজ করুন'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedHotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              isPremium={isPremium}
              lang={lang}
              reviews={reviews}
              onAddReview={onAddReview}
              userProfile={userProfile}
              onBookClick={onBookHotel}
              isWishlisted={true}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
};
