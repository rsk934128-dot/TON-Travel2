import React from 'react';
import { X, ShieldCheck, FileText, ExternalLink, AlertCircle } from 'lucide-react';
import { Language } from '../types';

export type LegalModalType = 'terms' | 'privacy' | 'affiliate' | null;

interface LegalModalProps {
  type: LegalModalType;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  type,
  isOpen,
  onClose,
  lang,
}) => {
  if (!isOpen || !type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              {type === 'affiliate' && <ExternalLink className="w-4 h-4" />}
              {type === 'terms' && <FileText className="w-4 h-4" />}
              {type === 'privacy' && <ShieldCheck className="w-4 h-4" />}
            </div>
            <h2 className="text-lg font-bold text-white">
              {type === 'affiliate' && (lang === 'en' ? 'Affiliate Disclosure & Cashback Policy' : 'অ্যাফিলিয়েট ডিসক্লোজার ও ক্যাশব্যাক নীতি')}
              {type === 'terms' && (lang === 'en' ? 'Terms of Service' : 'ব্যবহারের শর্তাবলী')}
              {type === 'privacy' && (lang === 'en' ? 'Privacy Policy' : 'গোপনীয়তা নীতি')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
          {type === 'affiliate' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-cyan-200 flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p>
                  {lang === 'en'
                    ? 'Transparent Disclosure: TON Travel is an independent Web3 travel aggregator. We participate in verified affiliate partnership programs.'
                    : 'স্বচ্ছ ডিসক্লোজার: TON Travel একটি স্বাধীন ওয়েব৩ ট্রাভেল এগ্রিগেটর। আমরা ভেরিফাইড অ্যাফিলিয়েট পার্টনারশিপ প্রোগ্রামে অংশগ্রহণ করি।'}
                </p>
              </div>

              <div>
                <h3 className="font-bold text-white text-sm">1. Affiliate Commission Model</h3>
                <p className="mt-1 text-slate-400">
                  {lang === 'en'
                    ? 'When you click partner links on TON Travel and make a reservation with third-party providers (such as Agoda, Booking.com, or Travala), we may earn an affiliate commission at zero additional cost to you.'
                    : 'আপনি যখন TON Travel থেকে পার্টনার লিংকে ক্লিক করে তৃতীয়-পক্ষ সরবরাহকারীর (যেমন Agoda, Booking.com ইত্যাদি) মাধ্যমে হোটেল বুক করবেন, তখন আমরা একটি অ্যাফিলিয়েট কমিশন পেতে পারি—যার জন্য আপনাকে কোনো অতিরিক্ত চার্জ দিতে হবে না।'}
                </p>
              </div>

              <div>
                <h3 className="font-bold text-white text-sm">2. TON Cashback Funding & Verification</h3>
                <p className="mt-1 text-slate-400">
                  {lang === 'en'
                    ? 'Our TON Cashback rewards (1.5% to 3.5% + Premium bonus) are funded entirely from our received partner commissions. Cashback is credited after your hotel stay is completed and verified by the partner without cancellation.'
                    : 'আমাদের TON ক্যাশব্যাক রিওয়ার্ড (১.৫% থেকে ৩.৫%) আমাদের প্রাপ্ত অ্যাফিলিয়েট কমিশন থেকেই প্রদান করা হয়। হোটেল অবস্থান সফলভাবে শেষ হলে এবং পার্টনার কর্তৃক বাতিলমুক্ত নিশ্চিত হলে ক্যাশব্যাক অনুমোদন করা হয়।'}
                </p>
              </div>

              <div>
                <h3 className="font-bold text-white text-sm">3. Sub-ID Tracking & Fraud Prevention</h3>
                <p className="mt-1 text-slate-400">
                  {lang === 'en'
                    ? 'We utilize anonymous session tracking Sub-IDs to attribute verified bookings. We do not store credit card or payment credentials; financial transactions occur solely on the partner’s secure payment gateway.'
                    : 'বুকিং ট্র্যাকিংয়ের জন্য আমরা অ্যানোনিমাস সেশন Sub-ID ব্যবহার করি। আমরা কোনো ক্রেডিট কার্ড বা পেমেন্ট তথ্য সংরক্ষণ করি না; সকল আর্থিক লেনদেন পার্টনারের সুরক্ষিত গেটওয়েতে সম্পন্ন হয়।'}
                </p>
              </div>
            </div>
          )}

          {type === 'terms' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-white text-sm">1. Acceptance of Terms</h3>
                <p className="mt-1 text-slate-400">
                  By accessing TON Travel via Telegram Mini App or Web, you agree to these Terms. TON Travel provides travel search, itinerary guides, and loyalty rewards tracking.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-white text-sm">2. Third-Party Bookings & Liability</h3>
                <p className="mt-1 text-slate-400">
                  Hotel reservations, cancellations, room availability, and customer service are governed exclusively by the terms and policies of the respective booking provider. TON Travel does not operate hotels or handle guest disputes.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-white text-sm">3. Cryptocurrency Rewards & Compliance</h3>
                <p className="mt-1 text-slate-400">
                  TON cashback rewards are promotional loyalty incentives. Users are solely responsible for local tax regulations or reporting applicable to cryptocurrency receipts in their respective jurisdiction.
                </p>
              </div>
            </div>
          )}

          {type === 'privacy' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-white text-sm">1. Data Minimization</h3>
                <p className="mt-1 text-slate-400">
                  We believe in Web3 privacy. We only collect the minimal data necessary to deliver services: public TON wallet address for rewards, anonymous click session IDs for affiliate attribution, and optional email for booking confirmations.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-white text-sm">2. No Financial Data Storage</h3>
                <p className="mt-1 text-slate-400">
                  We never ask for, process, or store credit card numbers, CVVs, or bank login details. All checkout payments take place on the SSL-encrypted domains of our certified travel partners.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-white text-sm">3. Analytics & Cookies</h3>
                <p className="mt-1 text-slate-400">
                  We use lightweight local storage to remember your language preference and currency settings.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex justify-between items-center text-xs text-slate-400">
          <span>TON Travel &bull; Operating as a Web3 Travel Community MVP</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition"
          >
            {lang === 'en' ? 'Close' : 'বন্ধ করুন'}
          </button>
        </div>
      </div>
    </div>
  );
};
