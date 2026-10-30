import React from 'react';
import { Hotel, Ticket, Server, Mail, MessageSquare, TrendingUp, WifiOff, Wifi, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';

export type TabType = 'hotels' | 'vouchers' | 'wishlist' | 'analytics' | 'gateway' | 'email' | 'community' | 'offline';

interface NavigationProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  vouchersCount: number;
  wishlistCount?: number;
  lang: Language;
  isOffline?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onChangeTab,
  vouchersCount,
  wishlistCount = 0,
  lang,
  isOffline = false,
}) => {
  const tabs = [
    {
      id: 'hotels' as TabType,
      labelEn: 'Hotel Bookings',
      labelBn: 'হোটেল বুকিং',
      icon: Hotel,
      badge: 'Cashback'
    },
    {
      id: 'wishlist' as TabType,
      labelEn: 'Wishlist',
      labelBn: 'উইশলিস্ট',
      icon: Heart,
      count: wishlistCount,
    },
    {
      id: 'vouchers' as TabType,
      labelEn: 'Travel Vouchers',
      labelBn: 'ভাউচার ও রশিদ',
      icon: Ticket,
      count: vouchersCount
    },
    {
      id: 'offline' as TabType,
      labelEn: 'Offline Vault',
      labelBn: 'অফলাইন ভল্ট',
      icon: WifiOff,
      badge: isOffline ? 'Active' : 'PWA / SW'
    },
    {
      id: 'analytics' as TabType,
      labelEn: 'Volume Analytics',
      labelBn: 'ভলিউম অ্যানালিটিক্স',
      icon: TrendingUp,
      badge: 'Recharts'
    },
    {
      id: 'gateway' as TabType,
      labelEn: 'TON Payment Gateway',
      labelBn: 'পেমেন্ট গেটওয়ে সেটিংস',
      icon: Server,
      badge: 'API & BDT'
    },
    {
      id: 'email' as TabType,
      labelEn: 'Email Voucher (Gmail)',
      labelBn: 'ইমেইল ভাউচার',
      icon: Mail,
      badge: 'OAuth'
    },
    {
      id: 'community' as TabType,
      labelEn: 'Q&A with Mike',
      labelBn: 'মাইকের প্রশ্নোত্তর',
      icon: MessageSquare,
      badge: '1win'
    }
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto py-2.5 scrollbar-none flex-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{lang === 'en' ? tab.labelEn : tab.labelBn}</span>
                
                {tab.count !== undefined && (
                  <span className="bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded-full text-[10px] font-bold border border-cyan-500/30">
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span className="bg-blue-500/20 text-blue-300 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border border-blue-500/30">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Offline / Online Animated Indicator Badge using Framer Motion */}
        <div className="shrink-0 flex items-center space-x-2 bg-slate-950/90 px-3 py-1.5 rounded-full border border-slate-800 shadow-sm text-xs font-mono my-2">
          <AnimatePresence mode="wait">
            {isOffline ? (
              <motion.div
                key="offline-status"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-2"
                title="Device is Offline or Simulating Disconnection"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <motion.span
                    animate={{ scale: [1, 2.2, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"
                  />
                  <motion.span
                    animate={{ scale: [0.85, 1.15, 0.85] }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)]"
                  />
                </span>
                <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-rose-400 font-bold text-[11px] tracking-wider hidden sm:inline">
                  {lang === 'en' ? 'OFFLINE' : 'অফলাইন'}
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="online-status"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-2"
                title="Connected to Network & TON Blockchain"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <motion.span
                    animate={{ scale: [1, 1.8, 1], opacity: [0.7, 0, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                  />
                  <motion.span
                    animate={{ scale: [0.9, 1.1, 0.9] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                  />
                </span>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold text-[11px] tracking-wider hidden sm:inline">
                  {lang === 'en' ? 'ONLINE' : 'অনলাইন'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
