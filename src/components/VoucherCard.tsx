import React, { useState } from 'react';
import { Booking, Language } from '../types';
import { CheckCircle2, ShieldCheck, Copy, Mail, ExternalLink, Printer, Check, Sparkles } from 'lucide-react';

interface VoucherCardProps {
  booking: Booking;
  lang: Language;
  onSendEmailClick?: (booking: Booking) => void;
}

export const VoucherCard: React.FC<VoucherCardProps> = ({
  booking,
  lang,
  onSendEmailClick,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(booking.reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl max-w-2xl mx-auto my-4 text-slate-100 font-sans print:bg-white print:text-black print:border-none print:shadow-none">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 p-6 text-white relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">💎</span>
              <h2 className="text-xl sm:text-2xl font-black tracking-wider uppercase font-mono">
                TON TRAVEL VOUCHER
              </h2>
            </div>
            <p className="text-cyan-100 text-xs sm:text-sm font-medium mt-1">
              Booking Confirmation | Issued via Telegram Mini App
            </p>
          </div>
          
          <div className="bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-right">
            <div className="text-[10px] text-cyan-200 uppercase font-mono tracking-wider">Reference</div>
            <div className="text-sm font-bold font-mono text-cyan-300 flex items-center space-x-1">
              <span>{booking.reference}</span>
              <button 
                onClick={handleCopyRef} 
                className="hover:text-white transition"
                title="Copy Reference"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Guaranteed Badge */}
        <div className="mt-4 inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Reservation Guaranteed &bull; Check-in Ready</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-6 space-y-6">
        
        {/* Hotel Details */}
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
            Hotel Details
          </div>
          <h3 className="text-xl font-bold text-white print:text-black">
            {booking.hotelName}
          </h3>
          <p className="text-slate-400 text-sm flex items-center space-x-1 mt-0.5 print:text-slate-700">
            <span>📍 {booking.location}</span>
          </p>
        </div>

        {/* Stay Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 print:bg-slate-100 print:border-slate-300">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Room Category</span>
            <span className="text-xs font-semibold text-slate-200 print:text-black">{booking.roomCategory}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Guests</span>
            <span className="text-xs font-semibold text-slate-200 print:text-black">{booking.guests} Guest(s)</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Check-In Date</span>
            <span className="text-xs font-semibold text-cyan-300 print:text-blue-700">{booking.checkIn}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Check-Out Date</span>
            <span className="text-xs font-semibold text-slate-200 print:text-black">
              {booking.checkOut} ({booking.nights} night/s)
            </span>
          </div>
        </div>

        {/* Payment & Cashback Summary */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-800/90 border-l-4 border-cyan-500 p-4 rounded-r-xl border-y border-r border-slate-700 space-y-3 print:bg-slate-50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-cyan-400 tracking-wider">
              Payment & TON Cashback Summary
            </span>
            <span className="text-[11px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded font-mono border border-cyan-800">
              💎 TON Wallet
            </span>
          </div>

          <div className="flex justify-between items-baseline border-b border-slate-700/60 pb-2">
            <span className="text-sm text-slate-300">Total Paid</span>
            <span className="text-base font-bold text-white font-mono">
              ${booking.totalPaidUsd.toFixed(2)} USD ({booking.totalPaidTon.toFixed(2)} TON)
            </span>
          </div>

          {/* Cashback highlight box */}
          <div className="bg-amber-950/40 border border-amber-500/30 rounded-lg p-3 space-y-1">
            <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
              <span className="flex items-center space-x-1">
                <span>👑 Telegram Premium Reward ({booking.cashbackPercent}% Cashback)</span>
              </span>
              <span className="text-sm text-emerald-400 font-mono">
                +{booking.cashbackTon.toFixed(3)} TON
              </span>
            </div>
            <p className="text-[11px] text-amber-200/80">
              approx. ${booking.cashbackUsd.toFixed(2)} USD auto-transferred to payout wallet
            </p>
          </div>

          {/* Wallet Address */}
          <div>
            <div className="text-[11px] text-slate-400 font-mono uppercase mb-1">
              TON SPACE Payout Wallet:
            </div>
            <div className="bg-slate-900 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-mono text-cyan-300 break-all select-all flex items-center justify-between">
              <span>{booking.payoutWallet}</span>
              <span className="text-[10px] text-slate-500 ml-2">VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Guest Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Primary Guest</div>
            <div className="text-sm font-semibold text-white mt-0.5">{booking.primaryGuestName}</div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Contact</div>
            <div className="text-sm font-medium text-cyan-400 mt-0.5">{booking.primaryGuestEmail}</div>
          </div>
        </div>

        {/* Transaction Hash */}
        {booking.txHash && (
          <div className="text-xs text-slate-400 flex items-center space-x-2 bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">On-Chain Tx Hash: <code className="text-slate-300 font-mono">{booking.txHash}</code></span>
          </div>
        )}

        {/* Actions Bar (hidden when printing) */}
        <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2 justify-between items-center print:hidden">
          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Print Voucher' : 'প্রিন্ট ভাউচার'}</span>
            </button>

            {onSendEmailClick && (
              <button
                onClick={() => onSendEmailClick(booking)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-cyan-600/20 transition"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Email via Gmail' : 'জিমেইলে পাঠান'}</span>
              </button>
            )}
          </div>

          <div className="text-[11px] text-slate-400">
            Support: <a href="https://t.me/TONTravelBot" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">@TONTravelBot</a>
          </div>
        </div>

      </div>

      {/* Footer Disclaimer */}
      <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 text-[11px] text-slate-500 text-center">
        Generated on August 14, 2026 by TON Travel App &bull; Verified on TON Blockchain
      </div>

    </div>
  );
};
