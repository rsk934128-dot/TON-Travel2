import React, { useState } from 'react';
import { TonWalletState, Hotel, Booking, Language } from '../types';
import { TON_USD_RATE } from '../data/hotels';
import { calculateTonCashback } from '../lib/cashback';
import { Wallet, CheckCircle, ShieldCheck, QrCode, Loader2, ArrowRight, X, AlertTriangle } from 'lucide-react';

interface TonConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelToBook: Hotel | null;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  wallet: TonWalletState;
  lang: Language;
  onConfirmBooking: (booking: Booking) => void;
}

export const TonConnectModal: React.FC<TonConnectModalProps> = ({
  isOpen,
  onClose,
  hotelToBook,
  checkIn,
  checkOut,
  nights,
  guests,
  wallet,
  lang,
  onConfirmBooking,
}) => {
  const [selectedWallet, setSelectedWallet] = useState<string>('Tonkeeper');
  const [step, setStep] = useState<'wallet' | 'confirm' | 'signing' | 'success'>('wallet');
  const [guestName, setGuestName] = useState('Alex Morgan');
  const [guestEmail, setGuestEmail] = useState('alex.morgan@telegram.me');
  const [generatedTxHash, setGeneratedTxHash] = useState('');

  if (!isOpen || !hotelToBook) return null;

  const totalPriceUsd = hotelToBook.pricePerNightUsd * nights;
  const totalPriceTon = totalPriceUsd / TON_USD_RATE;
  
  const cashbackCalc = calculateTonCashback(
    totalPriceUsd,
    wallet.isPremium ? 'Gold' : 'Bronze',
    wallet.isPremium
  );
  const cashbackPercent = cashbackCalc.cashbackPercent;
  const cashbackTon = cashbackCalc.cashbackTon;
  const cashbackUsd = cashbackCalc.cashbackUsd;

  const wallets = [
    { name: 'Tonkeeper', icon: '💎', desc: 'Popular TON Mobile Wallet' },
    { name: 'Telegram Wallet', icon: '✈️', desc: '@Wallet inside Telegram' },
    { name: 'MyTonWallet', icon: '🛡️', desc: 'Web & Extension Wallet' },
    { name: 'OpenMask', icon: '🦊', desc: 'Biometric Web3 Wallet' }
  ];

  const handleProceedToPayment = () => {
    setStep('confirm');
  };

  const handleExecuteTonPayment = () => {
    setStep('signing');

    setTimeout(() => {
      // Generate a mock hex transaction hash
      const randomHash = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setGeneratedTxHash(randomHash);

      const refNum = '#TON-' + Math.floor(100000 + Math.random() * 900000);
      
      const newBooking: Booking = {
        reference: refNum,
        hotelId: hotelToBook.id,
        hotelName: hotelToBook.name,
        location: hotelToBook.location,
        roomCategory: hotelToBook.roomCategory,
        guests,
        checkIn,
        checkOut,
        nights,
        totalPaidUsd: totalPriceUsd,
        totalPaidTon: totalPriceTon,
        cashbackPercent,
        cashbackTon,
        cashbackUsd,
        payoutWallet: wallet.address || 'EQBvW839_TonSpace_cX92',
        primaryGuestName: guestName || 'Alex Morgan',
        primaryGuestEmail: guestEmail || 'alex.morgan@telegram.me',
        telegramUsername: '@alex_morgan_ton',
        status: 'Guaranteed',
        createdAt: new Date().toISOString(),
        txHash: randomHash
      };

      onConfirmBooking(newBooking);
      setStep('success');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative text-slate-100">
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-full z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 p-6 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>TON Connect 2.0 Gateway</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">
            {step === 'wallet' && (lang === 'en' ? 'Select TON Wallet' : 'TON ওয়ালেট নির্বাচন করুন')}
            {step === 'confirm' && (lang === 'en' ? 'Confirm TON Transaction' : 'ট্রানজেকশন নিশ্চিত করুন')}
            {step === 'signing' && (lang === 'en' ? 'Signing On-Chain Tx...' : 'ব্লকচেইনে সাইন করা হচ্ছে...')}
            {step === 'success' && (lang === 'en' ? 'Payment Confirmed! 💎' : 'পেমেন্ট সফল হয়েছে!')}
          </h2>
          <div className="mt-2.5 inline-flex items-center space-x-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/25 rounded-md text-[11px] text-amber-300 font-mono">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{lang === 'en' ? 'Prototype Sandbox Simulation Mode' : 'প্রোটোটাইপ স্যান্ডবক্স সিমুলেশন মোড'}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">

          {/* STEP 1: Select Wallet & Guest details */}
          {step === 'wallet' && (
            <div className="space-y-4">
              
              {/* Hotel Summary */}
              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-white text-sm">{hotelToBook.name}</div>
                  <div className="text-slate-400">{nights} night(s) &bull; {checkIn} to {checkOut}</div>
                </div>
                <div className="text-right">
                  <div className="text-cyan-400 font-bold font-mono text-sm">${totalPriceUsd} USD</div>
                  <div className="text-slate-400 text-[11px] font-mono">~{totalPriceTon.toFixed(2)} TON</div>
                </div>
              </div>

              {/* Guest Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Primary Guest Name</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Guest Email (Voucher)</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Wallet Select List */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-2">
                  Choose TON Wallet App
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {wallets.map((w) => (
                    <button
                      key={w.name}
                      onClick={() => setSelectedWallet(w.name)}
                      className={`flex items-center space-x-3 p-3 rounded-xl border text-left transition ${
                        selectedWallet === w.name
                          ? 'bg-cyan-950/80 border-cyan-500 text-white'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-xl">{w.icon}</span>
                      <div>
                        <div className="text-xs font-bold">{w.name}</div>
                        <div className="text-[10px] text-slate-400">{w.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleProceedToPayment}
                className="w-full mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 text-sm transition"
              >
                <span>Connect & Pay with {selectedWallet}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

          {/* STEP 2: Confirm Transaction details */}
          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
                <div className="flex justify-between text-slate-400 border-b border-slate-800 pb-1.5">
                  <span>Destination Receiver Wallet:</span>
                </div>
                <div className="text-cyan-400 font-bold break-all bg-slate-900 p-2 rounded border border-slate-800">
                  {wallet.address || 'EQBvW839_TonSpace_cX92'}
                </div>

                <div className="flex justify-between pt-1">
                  <span className="text-slate-400">Amount to Send:</span>
                  <span className="text-white font-bold">{totalPriceTon.toFixed(2)} TON (${totalPriceUsd.toFixed(2)} USD)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Gas Fee:</span>
                  <span className="text-slate-300">~0.005 TON ($0.03)</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold border-t border-slate-800 pt-1.5">
                  <span>TON Cashback Return:</span>
                  <span>+{cashbackTon.toFixed(3)} TON (${cashbackUsd.toFixed(2)} USD)</span>
                </div>
              </div>

              {/* QR Code preview */}
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 flex items-center space-x-3">
                <div className="bg-white p-2 rounded-lg shrink-0">
                  <QrCode className="w-12 h-12 text-slate-900" />
                </div>
                <div className="text-xs text-slate-300">
                  <div className="font-bold text-cyan-300">Scan or Approve in {selectedWallet}</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Clicking approve triggers TON Connect payload verification on TON Mainnet.
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setStep('wallet')}
                  className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl text-xs"
                >
                  Back
                </button>
                <button
                  onClick={handleExecuteTonPayment}
                  className="w-2/3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Approve & Transfer TON</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Signing Loading */}
          {step === 'signing' && (
            <div className="text-center py-8 space-y-4">
              <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto" />
              <div>
                <h3 className="text-base font-bold text-white">Communicating with TON Blockchain...</h3>
                <p className="text-xs text-slate-400 mt-1">Verifying block header signature & broadcasting transaction hash</p>
              </div>
            </div>
          )}

          {/* STEP 4: Success Confirmation */}
          {step === 'success' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Reservation Confirmed!</h3>
                <p className="text-xs text-slate-400 mt-1">Your official TON Travel Voucher has been generated.</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-left space-y-1">
                <div className="text-slate-500 text-[10px]">TRANSACTION HASH</div>
                <div className="text-cyan-300 break-all text-[11px]">{generatedTxHash}</div>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                View Voucher
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
