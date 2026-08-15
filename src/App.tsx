/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { HotelCard } from './components/HotelCard';
import { HotelModal } from './components/HotelModal';
import { TonConnectModal } from './components/TonConnectModal';
import { VoucherCard } from './components/VoucherCard';
import { GatewayGuide } from './components/GatewayGuide';
import { GmailDispatcher } from './components/GmailDispatcher';
import { CommunityQA } from './components/CommunityQA';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { OfflineView } from './components/OfflineView';

import { HOTELS, INITIAL_VOUCHER } from './data/hotels';
import { Hotel, Booking, TonWalletState, Language, UserProfile, HotelReview } from './types';
import { Sparkles, Hotel as HotelIcon, Ticket, ShieldCheck, Mail, MessageSquare, WifiOff } from 'lucide-react';
import { registerServiceWorker, preCacheOfflineVouchers } from './lib/registerServiceWorker';
import { db, auth, testFirestoreConnection, handleFirestoreError, OperationType, loginWithGoogle, logoutUser, saveUserProfile, getUserProfile, seedInitialReviewsIfEmpty, subscribeToHotelReviews, addHotelReview } from './lib/firebase';
import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { User, onAuthStateChanged } from 'firebase/auth';
import { UserProfileModal } from './components/UserProfileModal';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<TabType>('hotels');

  // Firebase Auth & User Profile Metadata State
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Firestore Hotel Reviews State
  const [reviews, setReviews] = useState<HotelReview[]>([]);

  // Offline Service Worker & Connectivity States
  const [isRealOffline, setIsRealOffline] = useState<boolean>(typeof navigator !== 'undefined' ? !navigator.onLine : false);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);

  // Wallet State
  const [wallet, setWallet] = useState<TonWalletState>({
    isConnected: true,
    address: 'EQBvW839_TonSpace_cX92',
    walletName: 'Tonkeeper / TON Space',
    balanceTon: 265.68,
    balanceUsd: 265.68 * 5.42,
    isPremium: true
  });

  // Vouchers state (initialized with sample booking or cached vouchers)
  const [vouchers, setVouchers] = useState<Booking[]>(() => {
    try {
      const stored = localStorage.getItem('ton_travel_vouchers_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [INITIAL_VOUCHER];
  });

  const [selectedVoucherForEmail, setSelectedVoucherForEmail] = useState<Booking>(INITIAL_VOUCHER);

  // Register service worker and handle online/offline listeners + Firestore initialization
  useEffect(() => {
    testFirestoreConnection();

    registerServiceWorker((offline) => {
      setIsRealOffline(offline);
    });

    const handleOnline = () => setIsRealOffline(false);
    const handleOffline = () => setIsRealOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Sync Firestore bookings collection
    const bookingsPath = 'bookings';
    const unsubscribeBookings = onSnapshot(
      collection(db, bookingsPath),
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteBookings: Booking[] = snapshot.docs.map((d) => d.data() as Booking);
          setVouchers((prev) => {
            const combined = [...remoteBookings];
            prev.forEach((p) => {
              if (!combined.some((r) => r.reference === p.reference)) {
                combined.push(p);
              }
            });
            return combined;
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, bookingsPath);
      }
    );

    // Seed & subscribe to Firestore hotel reviews collection
    seedInitialReviewsIfEmpty();
    const unsubscribeReviews = subscribeToHotelReviews((fetchedReviews) => {
      setReviews(fetchedReviews);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribeBookings();
      unsubscribeReviews();
    };
  }, []);

  const handleAddReview = async (review: HotelReview) => {
    await addHotelReview(review);
  };

  // Listen for Firebase Auth changes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          if (profile) {
            setUserProfile(profile);
          } else {
            const initialProfile: UserProfile = {
              uid: user.uid,
              displayName: user.displayName || 'TON Traveler',
              email: user.email || '',
              photoURL: user.photoURL || '',
              loyaltyTier: 'Gold',
              preferredCurrency: 'TON',
              updatedAt: new Date().toISOString(),
            };
            await saveUserProfile(initialProfile);
            setUserProfile(initialProfile);
          }
        } catch (e) {
          console.error('[Firebase] Auth listener error fetching profile:', e);
        }
      } else {
        setUserProfile(null);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const handleLoginGoogle = async () => {
    try {
      const user = await loginWithGoogle();
      if (user) {
        const existing = await getUserProfile(user.uid);
        if (existing) {
          setUserProfile(existing);
        } else {
          const initialProfile: UserProfile = {
            uid: user.uid,
            displayName: user.displayName || 'TON Traveler',
            email: user.email || '',
            photoURL: user.photoURL || '',
            loyaltyTier: 'Gold',
            preferredCurrency: 'TON',
            updatedAt: new Date().toISOString(),
          };
          await saveUserProfile(initialProfile);
          setUserProfile(initialProfile);
        }
      }
    } catch (e) {
      console.error('[Firebase] Google Sign In Failed:', e);
    }
  };

  const handleLogoutGoogle = async () => {
    await logoutUser();
    setAuthUser(null);
    setUserProfile(null);
  };

  const handleUpdateUserProfile = async (
    tier: UserProfile['loyaltyTier'],
    currency: UserProfile['preferredCurrency']
  ) => {
    if (!authUser) return;
    const updated: UserProfile = {
      uid: authUser.uid,
      displayName: authUser.displayName || userProfile?.displayName || 'TON Traveler',
      email: authUser.email || userProfile?.email || '',
      photoURL: authUser.photoURL || userProfile?.photoURL || '',
      loyaltyTier: tier,
      preferredCurrency: currency,
      updatedAt: new Date().toISOString(),
    };
    await saveUserProfile(updated);
    setUserProfile(updated);
  };

  // Pre-cache vouchers to LocalStorage and Service Worker Cache
  useEffect(() => {
    preCacheOfflineVouchers(vouchers);
  }, [vouchers]);

  // Modal States
  const [selectedHotelModal, setSelectedHotelModal] = useState<Hotel | null>(null);
  const [isTonModalOpen, setIsTonModalOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    hotel: Hotel | null;
    checkIn: string;
    checkOut: string;
    nights: number;
    guests: number;
  }>({
    hotel: null,
    checkIn: '2026-08-15',
    checkOut: '2026-08-18',
    nights: 3,
    guests: 2
  });

  const toggleWalletConnection = () => {
    setWallet(prev => ({ ...prev, isConnected: !prev.isConnected }));
  };

  const toggleTelegramPremium = () => {
    setWallet(prev => ({ ...prev, isPremium: !prev.isPremium }));
  };

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'bn' : 'en'));
  };

  // Open Hotel Detail Modal
  const handleOpenHotelModal = (hotel: Hotel) => {
    setSelectedHotelModal(hotel);
  };

  // Trigger TON Connect Payment
  const handleProceedToPayment = (
    hotel: Hotel,
    checkIn: string,
    checkOut: string,
    nights: number,
    guests: number
  ) => {
    setPaymentDetails({ hotel, checkIn, checkOut, nights, guests });
    setSelectedHotelModal(null);
    setIsTonModalOpen(true);
  };

  // Confirm booking & create voucher
  const handleConfirmBooking = async (newBooking: Booking) => {
    setVouchers(prev => [newBooking, ...prev]);
    setSelectedVoucherForEmail(newBooking);

    // Persist to Firestore
    const bookingsPath = 'bookings';
    try {
      await setDoc(doc(db, bookingsPath, newBooking.reference), newBooking);
      console.log('[Firestore] Booking stored successfully:', newBooking.reference);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${bookingsPath}/${newBooking.reference}`);
    }
  };

  const handleSendEmailClick = (booking: Booking) => {
    setSelectedVoucherForEmail(booking);
    setActiveTab('email');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Bar */}
      <Header
        wallet={wallet}
        onToggleConnect={toggleWalletConnection}
        onTogglePremium={toggleTelegramPremium}
        lang={lang}
        onToggleLang={toggleLanguage}
        isOffline={isRealOffline || isSimulatedOffline}
        user={authUser}
        userProfile={userProfile}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* Navigation Sub-header */}
      <Navigation
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        vouchersCount={vouchers.length}
        lang={lang}
        isOffline={isRealOffline || isSimulatedOffline}
      />

      {/* Offline Status Alert Strip */}
      {(isRealOffline || isSimulatedOffline) && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 px-4 py-2 flex flex-col sm:flex-row items-center justify-between text-xs font-bold shadow-md gap-2">
          <div className="flex items-center space-x-2">
            <WifiOff className="w-4 h-4 shrink-0" />
            <span>
              {isRealOffline ? '⚡ Offline Connection Detected.' : '⚡ Offline Mode Simulation Active.'}
              {' '}Your travel vouchers and check-in QR codes are cached for offline travel.
            </span>
          </div>
          <button
            onClick={() => setActiveTab('offline')}
            className="bg-slate-950 text-amber-300 px-3 py-1 rounded-lg hover:bg-slate-900 transition text-[11px] font-mono shrink-0"
          >
            Open Offline Vault &rarr;
          </button>
        </div>
      )}

      {/* Main App Canvas */}
      <main className="flex-1 pb-16">
        
        {/* TAB 1: HOTELS & BOOKING */}
        {activeTab === 'hotels' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            
            {/* Hero Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-cyan-950 to-blue-950 border border-slate-800 p-8 shadow-2xl">
              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>TON Blockchain Travel Network</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  {lang === 'en'
                    ? 'Book Luxury Hotels with TON Wallet & Earn 8% Cashback'
                    : 'TON ওয়ালেট দিয়ে হোটেল বুক করুন এবং ৮% ক্যাশব্যাক জিতুন'}
                </h1>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {lang === 'en'
                    ? 'Instant voucher generation, zero foreign exchange fees, direct smart contract verification, and Telegram Premium cashback rewards.'
                    : 'তাৎক্ষণিক ভাউচার তৈরি, কোনো অতিরিক্ত মেকিং চার্জ নেই, স্মার্ট কন্ট্রাক্ট দ্বারা ভেরিফাইড এবং টেলিগ্রাম প্রিমিয়াম রিওয়ার্ড।'}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-cyan-400">
                  <span>⚡ Fast TON Connect 2.0</span>
                  <span>&bull;</span>
                  <span>💎 Payout: EQBvW839_TonSpace_cX92</span>
                  <span>&bull;</span>
                  <span>👑 Telegram Premium Boost</span>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs px-4 py-2 rounded-xl hover:brightness-110 transition shadow-lg shadow-cyan-500/20"
                  >
                    <span>📊 View Monthly TON Booking Volume & Cashback Chart</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Hotel Cards Grid */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-black text-white">
                    {lang === 'en' ? 'Featured TON Travel Destinations' : 'জনপ্রিয় ট্রাভেল ডেস্টিনেশন'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {lang === 'en' ? 'Guaranteed check-in with verified blockchain vouchers' : 'ব্লকচেইন ভাউচারের মাধ্যমে ১০০% গ্যারান্টিযুক্ত চেক-ইন'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {HOTELS.map(hotel => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    isPremium={wallet.isPremium}
                    lang={lang}
                    reviews={reviews}
                    onAddReview={handleAddReview}
                    userProfile={userProfile}
                    onBookClick={handleOpenHotelModal}
                  />
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: VOUCHERS & RECEIPTS */}
        {activeTab === 'vouchers' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl font-black text-white flex items-center justify-center space-x-2">
                <Ticket className="w-6 h-6 text-cyan-400" />
                <span>{lang === 'en' ? 'Your TON Travel Vouchers' : 'আপনার ভাউচার ও রসিদ'}</span>
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'en'
                  ? 'All reservations guaranteed via Telegram Mini App and stored on TON mainnet'
                  : 'টেলিগ্রাম মিনি অ্যাপ এবং TON ব্লকচেইনে সংরক্ষিত আপনার ট্রাভেল ভাউচারসমূহ'}
              </p>
            </div>

            <div className="space-y-6">
              {vouchers.map((v, idx) => (
                <VoucherCard
                  key={idx}
                  booking={v}
                  lang={lang}
                  onSendEmailClick={handleSendEmailClick}
                />
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: VOLUME & CASHBACK ANALYTICS */}
        {activeTab === 'analytics' && <AnalyticsDashboard lang={lang} />}

        {/* TAB 4: GATEWAY & SETUP GUIDE */}
        {activeTab === 'gateway' && <GatewayGuide lang={lang} />}

        {/* TAB 4: GMAIL VOUCHER DISPATCHER */}
        {activeTab === 'email' && (
          <GmailDispatcher
            booking={selectedVoucherForEmail}
            lang={lang}
          />
        )}

        {/* TAB 5: COMMUNITY Q&A WITH MIKE */}
        {activeTab === 'community' && <CommunityQA lang={lang} />}

        {/* TAB 6: OFFLINE VAULT & STORED VOUCHERS */}
        {activeTab === 'offline' && (
          <OfflineView
            vouchers={vouchers}
            isSimulatedOffline={isSimulatedOffline}
            isRealOffline={isRealOffline}
            onToggleSimulateOffline={() => setIsSimulatedOffline(prev => !prev)}
            lang={lang}
            onSelectVoucherForEmail={handleSendEmailClick}
          />
        )}

      </main>

      {/* Hotel Date/Guest Modal */}
      <HotelModal
        hotel={selectedHotelModal}
        isOpen={!!selectedHotelModal}
        onClose={() => setSelectedHotelModal(null)}
        wallet={wallet}
        userProfile={userProfile}
        lang={lang}
        reviews={reviews}
        onAddReview={handleAddReview}
        onProceedToPayment={handleProceedToPayment}
      />

      {/* TON Connect Payment Modal */}
      <TonConnectModal
        isOpen={isTonModalOpen}
        onClose={() => setIsTonModalOpen(false)}
        hotelToBook={paymentDetails.hotel}
        checkIn={paymentDetails.checkIn}
        checkOut={paymentDetails.checkOut}
        nights={paymentDetails.nights}
        guests={paymentDetails.guests}
        wallet={wallet}
        lang={lang}
        onConfirmBooking={handleConfirmBooking}
      />

      {/* User Firebase Account Profile & Metadata Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={authUser}
        profile={userProfile}
        onLoginGoogle={handleLoginGoogle}
        onLogoutGoogle={handleLogoutGoogle}
        onUpdateProfile={handleUpdateUserProfile}
        lang={lang}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            💎 <span className="font-bold text-slate-400">TON TRAVEL</span> Mini App &bull; Powered by TON Blockchain & Google AI
          </div>
          <div>
            Payout Wallet: <code className="text-cyan-400 font-mono">EQBvW839_TonSpace_cX92</code>
          </div>
        </div>
      </footer>

    </div>
  );
}
