import React, { useState } from 'react';
import { HotelReview, UserProfile, Language } from '../types';
import { Star, MessageSquare, CheckCircle2, Send, Sparkles, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HotelReviewsSectionProps {
  hotelId: string;
  hotelName: string;
  reviews: HotelReview[];
  onAddReview: (review: HotelReview) => Promise<void>;
  userProfile?: UserProfile | null;
  lang: Language;
  compact?: boolean;
}

export const HotelReviewsSection: React.FC<HotelReviewsSectionProps> = ({
  hotelId,
  hotelName,
  reviews,
  onAddReview,
  userProfile,
  lang,
  compact = false,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [authorName, setAuthorName] = useState(userProfile?.displayName || '');
  const [stayDate, setStayDate] = useState('August 2026');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const hotelReviews = reviews.filter((r) => r.hotelId === hotelId);

  const avgRating =
    hotelReviews.length > 0
      ? (hotelReviews.reduce((acc, r) => acc + r.rating, 0) / hotelReviews.length).toFixed(1)
      : '5.0';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg('Please enter a review comment.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const newReview: HotelReview = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      hotelId,
      authorName: authorName.trim() || 'Anonymous Traveler',
      rating,
      comment: comment.trim(),
      stayDate: stayDate || 'August 2026',
      verifiedGuest: true,
      createdAt: new Date().toISOString(),
      userId: userProfile?.uid,
    };

    try {
      await onAddReview(newReview);
      setSubmitSuccess(true);
      setComment('');
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsFormOpen(false);
      }, 2000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to post review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`space-y-4 ${compact ? 'text-xs' : ''}`}>
      {/* Reviews Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <h4 className="font-bold text-white text-sm">
            {lang === 'en' ? 'Guest Testimonials & Reviews' : 'অতিথিদের রিভিও ও টেস্টিনোমিয়াল'}
          </h4>
          <span className="bg-slate-800 text-slate-300 font-mono text-[10px] px-2 py-0.5 rounded-full border border-slate-700">
            {hotelReviews.length}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-amber-400 font-bold text-xs bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md font-mono">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{avgRating}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 px-2.5 py-1 rounded-lg border border-cyan-500/30 transition flex items-center space-x-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>{isFormOpen ? (lang === 'en' ? 'Cancel' : 'বাতিল') : (lang === 'en' ? 'Write Review' : 'রিভিউ দিন')}</span>
          </button>
        </div>
      </div>

      {/* Review Submission Form */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="bg-slate-950 p-4 rounded-xl border border-cyan-500/30 space-y-3"
          >
            <div className="text-xs font-bold text-cyan-300 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? `Review ${hotelName}` : `${hotelName}-এর অভিজ্ঞতা লিখুন`}</span>
            </div>

            {/* Author Name & Rating */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  {lang === 'en' ? 'Your Display Name' : 'আপনার নাম'}
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Alex M."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  {lang === 'en' ? 'Star Rating' : 'রেটিং'}
                </label>
                <div className="flex items-center space-x-1 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-0.5 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-bold text-amber-400 ml-2">{rating}.0 / 5</span>
                </div>
              </div>
            </div>

            {/* Comment Textarea */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                {lang === 'en' ? 'Feedback Testimonial' : 'আপনার অনুভূতি'}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={lang === 'en' ? 'Share details about room quality, view, TON payment experience...' : 'হোটেলের অভিজ্ঞতা শেয়ার করুন...'}
                rows={2}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {errorMsg && <div className="text-xs text-rose-400 bg-rose-950/40 p-2 rounded-md">{errorMsg}</div>}
            {submitSuccess && (
              <div className="text-xs text-emerald-400 bg-emerald-950/40 p-2 rounded-md flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{lang === 'en' ? 'Review saved to Firestore!' : 'রিভিউ ফায়ারবেসে সেভ হয়েছে!'}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-bold py-2 rounded-lg text-xs flex items-center justify-center space-x-2 transition disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Posting...' : lang === 'en' ? 'Publish Testimonial' : 'পাবলিশ করুন'}</span>
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Reviews Testimonial List */}
      {hotelReviews.length === 0 ? (
        <div className="text-center py-4 text-xs text-slate-500 italic">
          {lang === 'en' ? 'No reviews yet for this hotel. Be the first to leave feedback!' : 'এখনও কোনো রিভিও নেই। প্রথম রিভিউ দিন!'}
        </div>
      ) : (
        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {hotelReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-3 space-y-1.5 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-[10px] font-bold">
                    <UserIcon className="w-3 h-3" />
                  </div>
                  <span className="font-bold text-white text-xs">{rev.authorName}</span>
                  {rev.verifiedGuest && (
                    <span className="inline-flex items-center space-x-1 text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                      <span>Verified Guest</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1 text-amber-400">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span className="text-[11px] font-mono font-bold">{rev.rating}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic">
                &ldquo;{rev.comment}&rdquo;
              </p>

              <div className="text-[10px] text-slate-500 font-mono text-right">
                Stayed {rev.stayDate}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
