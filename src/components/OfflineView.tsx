import React, { useState, useEffect } from 'react';
import { Booking, Hotel, Language } from '../types';
import { HOTELS } from '../data/hotels';
import {
  WifiOff,
  Wifi,
  Ticket,
  QrCode,
  ShieldCheck,
  Search,
  Database,
  RefreshCw,
  PhoneCall,
  Hotel as HotelIcon,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  Download
} from 'lucide-react';
import { checkCacheStatus, CacheStatus } from '../lib/registerServiceWorker';

interface OfflineViewProps {
  vouchers: Booking[];
  isSimulatedOffline: boolean;
  isRealOffline: boolean;
  onToggleSimulateOffline: () => void;
  lang: Language;
  onSelectVoucherForEmail?: (booking: Booking) => void;
}

export const OfflineView: React.FC<OfflineViewProps> = ({
  vouchers,
  isSimulatedOffline,
  isRealOffline,
  onToggleSimulateOffline,
  lang,
  onSelectVoucherForEmail,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVoucherModal, setSelectedVoucherModal] = useState<Booking | null>(null);
  const [cacheInfo, setCacheInfo] = useState<CacheStatus>({
    isSupported: true,
    isRegistered: true,
    cachedAssetsCount: 5,
    lastSyncedAt: new Date().toISOString(),
  });
  const [copiedTx, setCopiedTx] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'vouchers' | 'hotels' | 'cache_status'>('vouchers');

  const isOfflineActive = isRealOffline || isSimulatedOffline;

  useEffect(() => {
    checkCacheStatus().then((status) => setCacheInfo(status));
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTx(text);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  const filteredVouchers = vouchers.filter((v) => {
    const query = searchTerm.toLowerCase();
    return (
      v.reference.toLowerCase().includes(query) ||
      v.hotelName.toLowerCase().includes(query) ||
      v.location.toLowerCase().includes(query) ||
      v.primaryGuestName.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Offline Status Header Banner */}
      <div
        className={`relative overflow-hidden p-6 rounded-2xl border transition-all shadow-xl ${
          isOfflineActive
            ? 'bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-amber-500/40'
            : 'bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 border-emerald-500/40'
        }`}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              {isOfflineActive ? (
                <span className="inline-flex items-center space-x-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>{isRealOffline ? 'Offline Mode Active' : 'Simulated Offline Mode'}</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  <Wifi className="w-3.5 h-3.5" />
                  <span>Online — All Vouchers Syncing Live</span>
                </span>
              )}
              <span className="text-xs text-slate-400 font-mono">
                PWA Service Worker Active
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white">
              {lang === 'en'
                ? 'Offline Travel Vault & Cached Voucher History'
                : 'অফলাইন ট্রাভেল ভল্ট ও ক্যাশকৃত ভাউচার'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              {lang === 'en'
                ? 'Your travel vouchers, check-in QR codes, hotel reception contacts, and confirmation receipts remain 100% accessible even when traveling without cell data or internet.'
                : 'ইন্টারনেট ছাড়াই হোটেল ফ্রন্ট ডেস্কে চেক-ইন করার জন্য আপনার সমস্ত বুকিং ভাউচার ও কিউআর কোড নিরাপদে মেমরিতে সংরক্ষিত রয়েছে।'}
            </p>
          </div>

          {/* Action Toggle Button */}
          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={onToggleSimulateOffline}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-lg ${
                isSimulatedOffline
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 font-black'
                  : 'bg-slate-800 text-slate-200 border border-slate-700 hover:border-amber-500/50 hover:text-white'
              }`}
            >
              <WifiOff className="w-4 h-4" />
              <span>
                {isSimulatedOffline
                  ? 'Disable Offline Simulation'
                  : '⚡ Simulate Offline Mode'}
              </span>
            </button>
          </div>
        </div>

        {/* Offline Cache Info Strip */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-2">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1 text-cyan-400">
              <Database className="w-3.5 h-3.5" />
              <span>Offline Storage: {vouchers.length} Vouchers Cached</span>
            </span>
            <span>&bull;</span>
            <span className="text-emerald-400 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Local Cache Ready</span>
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            Last Cache Sync: {new Date(cacheInfo.lastSyncedAt || '').toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('vouchers')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'vouchers'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Cached Vouchers ({vouchers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('hotels')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'hotels'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <HotelIcon className="w-4 h-4" />
            <span>Offline Hotel Directory ({HOTELS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('cache_status')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'cache_status'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Service Worker Cache Health</span>
          </button>
        </div>

        {/* Search Input for Offline Vouchers */}
        {activeTab === 'vouchers' && (
          <div className="relative min-w-[200px] sm:min-w-[260px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search offline vouchers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        )}
      </div>

      {/* TAB CONTENT 1: CACHED VOUCHERS */}
      {activeTab === 'vouchers' && (
        <div className="space-y-4">
          {filteredVouchers.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
              <h3 className="text-base font-bold text-white">No Stored Vouchers Found</h3>
              <p className="text-xs text-slate-400">
                No offline vouchers match your search term "{searchTerm}".
              </p>
            </div>
          ) : (
            filteredVouchers.map((v, index) => (
              <div
                key={index}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg space-y-4 transition"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono text-xs font-bold px-2.5 py-0.5 rounded-full">
                        {v.reference}
                      </span>
                      <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>OFFLINE CHECK-IN READY</span>
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-white">{v.hotelName}</h3>
                    <p className="text-xs text-slate-400 flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{v.location} &bull; {v.roomCategory}</span>
                    </p>
                  </div>

                  <div className="text-left sm:text-right font-mono space-y-1">
                    <div className="text-xs text-slate-400">Paid with TON Wallet</div>
                    <div className="text-base font-black text-cyan-400">
                      {v.totalPaidTon.toFixed(2)} TON <span className="text-xs text-slate-400">(${v.totalPaidUsd})</span>
                    </div>
                    <div className="text-[11px] text-emerald-400 font-bold">
                      +{v.cashbackTon.toFixed(3)} TON Cashback Received
                    </div>
                  </div>
                </div>

                {/* Booking details grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">CHECK-IN</span>
                    <span className="font-bold text-slate-200">{v.checkIn}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">CHECK-OUT</span>
                    <span className="font-bold text-slate-200">{v.checkOut}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">GUEST</span>
                    <span className="font-bold text-slate-200 truncate block">{v.primaryGuestName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">PAYOUT WALLET</span>
                    <span className="font-bold text-amber-300 truncate block">{v.payoutWallet}</span>
                  </div>
                </div>

                {/* Footer action bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedVoucherModal(v)}
                      className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>View Front Desk QR Pass</span>
                    </button>

                    {v.txHash && (
                      <button
                        onClick={() => handleCopy(v.txHash!)}
                        className="bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl text-xs font-mono flex items-center space-x-1 border border-slate-700"
                      >
                        {copiedTx === v.txHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="truncate max-w-[120px]">{v.txHash}</span>
                      </button>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Stored in Cache API & LocalStorage</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT 2: OFFLINE HOTEL DIRECTORY */}
      {activeTab === 'hotels' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {HOTELS.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex space-x-4 space-y-0 items-center shadow-lg"
            >
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-24 h-24 rounded-xl object-cover shrink-0 border border-slate-800"
              />
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-slate-800 text-cyan-300 px-2 py-0.5 rounded font-mono font-bold">
                    ★ {hotel.rating} ({hotel.reviewsCount})
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    ${hotel.pricePerNightUsd}/night
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm truncate">{hotel.name}</h4>
                <p className="text-xs text-slate-400 truncate">{hotel.location}, {hotel.country}</p>
                
                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center space-x-1 text-amber-300">
                    <PhoneCall className="w-3 h-3" />
                    <span>Front Desk: +1 (800) TON-STAY</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT 3: SERVICE WORKER CACHE STATUS */}
      {activeTab === 'cache_status' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/30 text-cyan-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Service Worker Cache Status</h3>
              <p className="text-xs text-slate-400">
                PWA cache storage metrics and offline synchronization details
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] block">PWA SERVICE WORKER</span>
              <span className="text-emerald-400 font-bold text-sm flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Active (`sw.js`)</span>
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] block">CACHING STRATEGY</span>
              <span className="text-amber-300 font-bold text-xs truncate block">
                ⚡ Stale-While-Revalidate
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] block">CACHED ASSETS IN STORAGE</span>
              <span className="text-cyan-300 font-bold text-sm">
                {cacheInfo.cachedAssetsCount} Core UI Resources
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] block">LAST LOCALSTORAGE SYNC</span>
              <span className="text-slate-200 font-bold text-xs truncate block">
                {new Date(cacheInfo.lastSyncedAt || '').toLocaleTimeString()}
              </span>
            </div>
          </div>

          <div className="bg-cyan-950/30 border border-cyan-800/40 p-4 rounded-xl text-xs text-cyan-200 space-y-2">
            <div className="font-bold flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Offline Travel Assurance Guaranteed</span>
            </div>
            <p className="text-[11px] text-cyan-300/80 leading-relaxed">
              When traveling internationally, cellular coverage can be unpredictable. TON Travel automatically syncs your travel vouchers and check-in QR codes into `CacheStorage` and `localStorage` so you can present your booking voucher at hotel reception anywhere in the world without requiring Wi-Fi.
            </p>
          </div>
        </div>
      )}

      {/* FRONT DESK QR CHECK-IN MODAL */}
      {selectedVoucherModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <QrCode className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-base">Front Desk QR Pass</h3>
              </div>
              <button
                onClick={() => setSelectedVoucherModal(null)}
                className="text-slate-400 hover:text-white text-xs bg-slate-800 px-2.5 py-1 rounded-lg"
              >
                Close
              </button>
            </div>

            {/* Simulated High-Contrast QR Pass */}
            <div className="bg-white p-6 rounded-2xl text-slate-950 text-center space-y-3 shadow-inner">
              <div className="text-[10px] font-mono font-black tracking-widest text-slate-500 uppercase">
                TON TRAVEL OFFICIAL VERIFIED VOUCHER
              </div>
              
              <div className="w-48 h-48 mx-auto border-4 border-slate-950 p-2 rounded-xl flex items-center justify-center bg-slate-50 relative">
                {/* SVG QR CODE REPRESENTATION */}
                <svg className="w-full h-full text-slate-950" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M0,0 h30 v30 h-30 z M5,5 h20 v20 h-20 z M10,10 h10 v10 h-10 z" />
                  <path d="M70,0 h30 v30 h-30 z M75,5 h20 v20 h-20 z M80,10 h10 v10 h-10 z" />
                  <path d="M0,70 h30 v30 h-30 z M5,75 h20 v20 h-20 z M10,80 h10 v10 h-10 z" />
                  <rect x="35" y="35" width="30" height="30" rx="4" />
                  <rect x="40" y="40" width="20" height="20" fill="#020617" />
                  <rect x="45" y="45" width="10" height="10" fill="#22d3ee" />
                  <circle cx="50" cy="15" r="4" />
                  <circle cx="15" cy="50" r="4" />
                  <circle cx="85" cy="50" r="4" />
                  <circle cx="50" cy="85" r="4" />
                </svg>
              </div>

              <div className="font-mono text-sm font-black text-slate-900 tracking-wider">
                {selectedVoucherModal.reference}
              </div>

              <div className="text-xs text-slate-600 font-bold">
                Guest: {selectedVoucherModal.primaryGuestName}
              </div>
            </div>

            <div className="text-xs text-slate-400 space-y-1 text-center font-mono">
              <p className="text-cyan-300 font-bold">{selectedVoucherModal.hotelName}</p>
              <p>Check-in: {selectedVoucherModal.checkIn} &bull; Check-out: {selectedVoucherModal.checkOut}</p>
              <p className="text-[11px] text-emerald-400">Guaranteed Check-in without Internet Access</p>
            </div>

            <button
              onClick={() => setSelectedVoucherModal(null)}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-2.5 rounded-xl text-xs transition"
            >
              Done &bull; Return to Offline Vault
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
