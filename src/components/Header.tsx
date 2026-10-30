import React, { useState, useRef, useEffect } from 'react';
import { TonWalletState, Language, UserProfile } from '../types';
import { TON_USD_RATE } from '../data/hotels';
import { PreferredCurrency, CURRENCY_CONFIG } from '../lib/currency';
import { Wallet, Crown, Globe, Zap, User as UserIcon, Coins, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from 'firebase/auth';

interface HeaderProps {
  wallet: TonWalletState;
  onToggleConnect: () => void;
  onTogglePremium: () => void;
  lang: Language;
  onToggleLang: () => void;
  isOffline?: boolean;
  user?: User | null;
  userProfile?: UserProfile | null;
  onOpenProfileModal?: () => void;
  onChangeCurrency?: (currency: PreferredCurrency) => void;
}

export const Header: React.FC<HeaderProps> = ({
  wallet,
  onToggleConnect,
  onTogglePremium,
  lang,
  onToggleLang,
  isOffline = false,
  user = null,
  userProfile = null,
  onOpenProfileModal,
  onChangeCurrency,
}) => {
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentCurrencyCode: PreferredCurrency =
    userProfile?.preferredCurrency && userProfile.preferredCurrency in CURRENCY_CONFIG
      ? userProfile.preferredCurrency
      : 'USD';

  const currentCurrency = CURRENCY_CONFIG[currentCurrencyCode] || CURRENCY_CONFIG.USD;

  // Click outside listener for quick currency dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCurrencyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand & Mini App badge */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">
              💎
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  TON TRAVEL
                </span>
                <span className="bg-blue-500/20 text-blue-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-blue-500/30">
                  Telegram Mini App
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {lang === 'en' ? 'TON Blockchain Bookings & Cashback Hub' : 'টিভিএন ব্লকচেইন ট্রাভেল ও পেমেন্ট গেটওয়ে'}
              </p>
            </div>
          </div>

          {/* Center Info - TON Rate, Premium status & Animated Connectivity Status Dot */}
          <div className="hidden md:flex items-center space-x-3 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
            <div className="flex items-center space-x-1 text-cyan-400 font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>1 TON = ${TON_USD_RATE.toFixed(2)} USD</span>
            </div>
            <span className="text-slate-600">|</span>
            <button
              onClick={onTogglePremium}
              className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-full font-medium transition-all ${
                wallet.isPremium
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>{wallet.isPremium ? '+8% Cashback Active' : 'Enable TG Premium (+8%)'}</span>
            </button>
            <span className="text-slate-600">|</span>

            {/* Header Animated Status Dot */}
            <AnimatePresence mode="wait">
              {isOffline ? (
                <motion.div
                  key="header-offline"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center space-x-1.5 text-rose-400 font-mono text-[11px] font-bold"
                >
                  <span className="relative flex h-2 w-2">
                    <motion.span
                      animate={{ scale: [1, 2, 1], opacity: [0.8, 0, 0.8] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"
                    />
                    <motion.span
                      animate={{ scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                      className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"
                    />
                  </span>
                  <span>Offline</span>
                </motion.div>
              ) : (
                <motion.div
                  key="header-online"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center space-x-1.5 text-emerald-400 font-mono text-[11px] font-bold"
                >
                  <span className="relative flex h-2 w-2">
                    <motion.span
                      animate={{ scale: [1, 1.8, 1], opacity: [0.7, 0, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                    />
                    <motion.span
                      animate={{ scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"
                    />
                  </span>
                  <span>Online</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Controls - Currency Switcher, Firebase Auth, Language & TON Wallet */}
          <div className="flex items-center space-x-2">

            {/* Quick Currency Switcher Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsCurrencyOpen((prev) => !prev)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700/90 text-cyan-300 rounded-lg border border-slate-700/80 text-xs font-mono font-bold transition shadow-sm"
                title={lang === 'en' ? 'Quick Currency Switcher' : 'দ্রুত মুদ্রা পরিবর্তন'}
              >
                <Coins className="w-3.5 h-3.5 text-cyan-400" />
                <span>{currentCurrency.flag} {currentCurrency.code}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isCurrencyOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isCurrencyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-44 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl p-1.5 z-50 space-y-0.5"
                  >
                    <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans border-b border-slate-800 mb-1 flex items-center justify-between">
                      <span>{lang === 'en' ? 'Preferred Currency' : 'পছন্দের মুদ্রা'}</span>
                      <span className="text-[9px] text-cyan-400 font-mono font-normal">Live Sync</span>
                    </div>

                    {(Object.keys(CURRENCY_CONFIG) as PreferredCurrency[]).map((code) => {
                      const config = CURRENCY_CONFIG[code];
                      const isSelected = currentCurrencyCode === code;
                      return (
                        <button
                          key={code}
                          type="button"
                          onClick={() => {
                            onChangeCurrency?.(code);
                            setIsCurrencyOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition ${
                            isSelected
                              ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <span className="flex items-center space-x-2">
                            <span className="text-base">{config.flag}</span>
                            <span>{config.code}</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-sans">{config.symbol}</span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Firebase Google Auth Profile Button */}
            <button
              onClick={onOpenProfileModal}
              className="flex items-center space-x-2 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700/90 text-slate-200 rounded-lg border border-slate-700/80 text-xs font-semibold transition"
              title="Firebase Profile & Loyalty Settings"
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile Avatar"
                  className="w-5 h-5 rounded-full object-cover border border-cyan-400/80"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <UserIcon className="w-4 h-4 text-cyan-400" />
              )}
              <span className="hidden sm:inline font-mono">
                {user ? (user.displayName ? user.displayName.split(' ')[0] : 'Account') : 'Sign In'}
              </span>
              {userProfile?.loyaltyTier && (
                <span className="hidden lg:inline bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                  {userProfile.loyaltyTier}
                </span>
              )}
            </button>

            {/* Language Toggle */}
            <button
              onClick={onToggleLang}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 text-xs font-semibold transition"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{lang === 'en' ? 'BN (বাংলা)' : 'EN (English)'}</span>
            </button>

            {/* Wallet Connect Button */}
            <button
              onClick={onToggleConnect}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg font-semibold text-xs transition shadow-md ${
                wallet.isConnected
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/20'
              }`}
            >
              <Wallet className="w-4 h-4 text-cyan-400" />
              {wallet.isConnected ? (
                <div className="text-left">
                  <div className="font-mono text-[11px] leading-tight text-cyan-200">
                    {wallet.address.slice(0, 4)}...{wallet.address.slice(-4)}
                  </div>
                  <div className="text-[10px] text-cyan-400/80 font-bold">
                    {wallet.balanceTon.toFixed(2)} TON (~${(wallet.balanceTon * TON_USD_RATE).toFixed(2)})
                  </div>
                </div>
              ) : (
                <span>{lang === 'en' ? 'Connect TON Wallet' : 'ওয়ালেট কানেক্ট করুন'}</span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

