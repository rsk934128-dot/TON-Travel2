import React, { useState } from 'react';
import { Hotel, Language, HotelReview, UserProfile } from '../types';
import { TON_USD_RATE } from '../data/hotels';
import { Star, Crown, MapPin, Zap, ArrowRight, MessageSquare, ChevronDown, ChevronUp, Quote } from 'lucide-react';
import { HotelReviewsSection } from './HotelReviewsSection';

interface HotelCardProps {
  hotel: Hotel;
  isPremium: boolean;
  lang: Language;
  reviews: HotelReview[];
  onAddReview: (review: HotelReview) => Promise<void>;
  userProfile?: UserProfile | null;
  onBookClick: (hotel: Hotel) => void;
}

export const HotelCard: React.FC<HotelCardProps> = ({
  hotel,
  isPremium,
  lang,
  reviews,
  onAddReview,
  userProfile,
  onBookClick,
}) => {
  const [showReviews, setShowReviews] = useState(false);

  const priceTon = hotel.pricePerNightUsd / TON_USD_RATE;
  const cashbackPercent = isPremium ? 8 : 3;
  const cashbackTonPerNight = (priceTon * cashbackPercent) / 100;
  const cashbackUsdPerNight = (hotel.pricePerNightUsd * cashbackPercent) / 100;

  const hotelReviews = reviews.filter((r) => r.hotelId === hotel.id);
  const featuredReview = hotelReviews.length > 0 ? hotelReviews[0] : null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300 shadow-xl group flex flex-col justify-between">
      
      <div>
        {/* Hotel Image with Badges */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

          {/* Rating */}
          <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-amber-400 flex items-center space-x-1 border border-slate-700">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{hotel.rating}</span>
            <span className="text-slate-400 text-[10px]">({hotelReviews.length || hotel.reviewsCount})</span>
          </div>

          {/* Cashback Badge */}
          <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 px-2.5 py-1 rounded-full text-[11px] font-black flex items-center space-x-1 shadow-lg shadow-amber-500/20">
            <Crown className="w-3.5 h-3.5" />
            <span>{cashbackPercent}% TON CASHBACK</span>
          </div>

          {/* Location on image */}
          <div className="absolute bottom-3 left-3 text-white text-xs font-medium flex items-center space-x-1 drop-shadow">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>{hotel.location}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">
              {hotel.name}
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              {hotel.description}
            </p>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {hotel.amenities.slice(0, 3).map((a, idx) => (
              <span
                key={idx}
                className="bg-slate-800 text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-slate-700/60"
              >
                {a}
              </span>
            ))}
          </div>

          {/* Featured Testimonial Snippet */}
          {featuredReview && !showReviews && (
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-1 relative">
              <div className="flex items-center justify-between text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                <span className="flex items-center space-x-1">
                  <Quote className="w-3 h-3 text-cyan-400" />
                  <span>Guest Testimonial</span>
                </span>
                <span className="text-slate-400 font-normal">{featuredReview.authorName}</span>
              </div>
              <p className="text-xs text-slate-300 italic line-clamp-2">
                &ldquo;{featuredReview.comment}&rdquo;
              </p>
            </div>
          )}

          {/* Toggle Full Reviews Section */}
          <button
            onClick={() => setShowReviews(!showReviews)}
            className="w-full text-xs text-slate-400 hover:text-cyan-300 py-1 flex items-center justify-center space-x-1 transition font-medium border-t border-b border-slate-800/60"
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {showReviews
                ? lang === 'en'
                  ? 'Hide Reviews'
                  : 'রিভিউ লুকান'
                : `${lang === 'en' ? 'User Reviews & Testimonials' : 'অতিথিদের রিভিও'} (${hotelReviews.length})`}
            </span>
            {showReviews ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Expandable Reviews Section */}
          {showReviews && (
            <div className="pt-2">
              <HotelReviewsSection
                hotelId={hotel.id}
                hotelName={hotel.name}
                reviews={reviews}
                onAddReview={onAddReview}
                userProfile={userProfile}
                lang={lang}
                compact
              />
            </div>
          )}
        </div>
      </div>

      {/* Pricing & Booking Footer */}
      <div className="p-5 pt-0 border-t border-slate-800/80 mt-2 space-y-3">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Starting from</div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl font-black text-white font-mono">${hotel.pricePerNightUsd}</span>
              <span className="text-xs text-cyan-400 font-mono font-bold">~{priceTon.toFixed(2)} TON</span>
              <span className="text-[10px] text-slate-500">/night</span>
            </div>
          </div>

          {/* Cashback Estimate */}
          <div className="text-right">
            <div className="text-[10px] text-amber-400 font-bold uppercase flex items-center justify-end space-x-0.5">
              <Zap className="w-3 h-3" />
              <span>Reward</span>
            </div>
            <div className="text-xs font-mono font-bold text-emerald-400">
              +{cashbackTonPerNight.toFixed(2)} TON
            </div>
            <div className="text-[10px] text-slate-400">
              (${cashbackUsdPerNight.toFixed(2)})
            </div>
          </div>
        </div>

        <button
          onClick={() => onBookClick(hotel)}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-cyan-500/20"
        >
          <span>{lang === 'en' ? 'Book with TON Connect' : 'TON দিয়ে বুক করুন'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

