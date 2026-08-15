import React, { useState, useEffect } from 'react';
import { UserProfile, Language } from '../types';
import { User } from 'firebase/auth';
import { LogIn, LogOut, Shield, Award, Coins, Check, X, Sparkles, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  profile: UserProfile | null;
  onLoginGoogle: () => Promise<void>;
  onLogoutGoogle: () => Promise<void>;
  onUpdateProfile: (tier: UserProfile['loyaltyTier'], currency: UserProfile['preferredCurrency']) => Promise<void>;
  lang: Language;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  profile,
  onLoginGoogle,
  onLogoutGoogle,
  onUpdateProfile,
  lang,
}) => {
  const [selectedTier, setSelectedTier] = useState<UserProfile['loyaltyTier']>('Bronze');
  const [selectedCurrency, setSelectedCurrency] = useState<UserProfile['preferredCurrency']>('TON');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (profile) {
      setSelectedTier(profile.loyaltyTier || 'Bronze');
      setSelectedCurrency(profile.preferredCurrency || 'TON');
    }
  }, [profile]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMsg('');
    try {
      await onUpdateProfile(selectedTier, selectedCurrency);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const loyaltyTierBadges: Record<UserProfile['loyaltyTier'], { label: string; color: string; desc: string }> = {
    Bronze: { label: 'Bronze Traveler', color: 'bg-amber-800/30 text-amber-300 border-amber-600/50', desc: '+2% Cashback' },
    Silver: { label: 'Silver Explorer', color: 'bg-slate-700/50 text-slate-200 border-slate-500/50', desc: '+5% Cashback' },
    Gold: { label: 'Gold Voyager', color: 'bg-amber-500/20 text-amber-400 border-amber-400/50', desc: '+8% Cashback' },
    Platinum: { label: 'Platinum Elite', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50', desc: '+12% Cashback' },
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-slate-100 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                <Shield className="w-5 h-5 text-cyan-200" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg tracking-tight text-white">
                  {lang === 'en' ? 'Firebase User Account' : 'ফায়ারবেস ইউজার অ্যাকাউন্ট'}
                </h3>
                <p className="text-xs text-slate-400">
                  {lang === 'en' ? 'Google Auth & Firestore User Metadata' : 'গুগল লগইন ও ফারায়বেজ প্রোফাইল মেটাডাটা'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Account Details or Sign In prompt */}
          {user ? (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User Avatar'}
                    className="w-14 h-14 rounded-2xl border-2 border-cyan-500/50 object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-cyan-950 border-2 border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold text-xl">
                    <UserIcon className="w-7 h-7" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white text-base truncate">
                    {user.displayName || 'TON Traveler'}
                  </h4>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  <div className="mt-1.5 inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>UID: {user.uid.slice(0, 8)}...</span>
                  </div>
                </div>
              </div>

              {/* Editable Metadata Form */}
              <div className="space-y-4 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">
                  <Award className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Travel Loyalty Tier' : 'ট্রাভেল লয়্যালটি টায়ার'}</span>
                </div>

                {/* Loyalty Tier Picker */}
                <div className="grid grid-cols-2 gap-2">
                  {(['Bronze', 'Silver', 'Gold', 'Platinum'] as UserProfile['loyaltyTier'][]).map((tier) => {
                    const info = loyaltyTierBadges[tier];
                    const isSelected = selectedTier === tier;
                    return (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setSelectedTier(tier)}
                        className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between ${
                          isSelected
                            ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/10'
                            : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="font-bold text-xs flex items-center justify-between">
                          <span>{info.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                        </div>
                        <div className="text-[10px] font-mono text-cyan-400/80 mt-1 font-semibold">
                          {info.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Preferred Currency Selector */}
                <div className="pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-2">
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'en' ? 'Preferred Currency' : 'পছন্দের কারেন্সি'}</span>
                  </label>
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value as UserProfile['preferredCurrency'])}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    <option value="TON">💎 TON (Telegram Open Network)</option>
                    <option value="USD">💵 USD ($ United States Dollar)</option>
                    <option value="EUR">💶 EUR (€ Euro)</option>
                    <option value="BDT">৳ BDT (বাংলাদেশী টাকা)</option>
                  </select>
                </div>
              </div>

              {/* Error or Success notification */}
              {errorMsg && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-xl">
                  {errorMsg}
                </div>
              )}

              {saveSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs p-3 rounded-xl flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'en' ? 'Metadata updated in Firestore!' : 'ফায়ারবেসে তথ্য আপডেট হয়েছে!'}</span>
                </div>
              )}

              {/* Save & Logout Buttons */}
              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-black text-xs py-3 rounded-xl transition shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>{isSaving ? 'Saving to Firestore...' : lang === 'en' ? 'Save Metadata' : 'মেটাডাটা সেভ করুন'}</span>
                </button>

                <button
                  onClick={async () => {
                    await onLogoutGoogle();
                    onClose();
                  }}
                  className="px-4 py-3 bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Sign Out' : 'সাইন আউট'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Sign In Prompt */
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto text-3xl shadow-inner">
                💎
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-bold text-white">
                  {lang === 'en' ? 'Sign in with Google' : 'গুগল দিয়ে সাইন ইন করুন'}
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  {lang === 'en'
                    ? 'Sync hotel vouchers across devices, claim loyalty cashback tiers, and save preferred currency metadata in Firestore.'
                    : 'ডিভাইস জুড়েই ট্রাভেল ভাউচার সিঙ্ক করুন এবং আপনার ক্যাশব্যাক রিওয়ার্ড সেভ রাখুন।'}
                </p>
              </div>

              <button
                onClick={async () => {
                  try {
                    await onLoginGoogle();
                  } catch (e) {
                    console.error('Login error', e);
                  }
                }}
                className="w-full bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs py-3.5 px-4 rounded-2xl transition shadow-xl flex items-center justify-center space-x-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{lang === 'en' ? 'Continue with Google Account' : 'গুগল অ্যাকাউন্ট দিয়ে অবিরত থাকুন'}</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
