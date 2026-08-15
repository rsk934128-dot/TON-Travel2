import React, { useState } from 'react';
import { Booking, Language } from '../types';
import { sendEmailViaGmailApi, buildVoucherHtml } from '../lib/gmail';
import { Mail, Send, CheckCircle2, AlertCircle, Key, Loader2, Sparkles, Lock } from 'lucide-react';

interface GmailDispatcherProps {
  booking: Booking;
  lang: Language;
}

export const GmailDispatcher: React.FC<GmailDispatcherProps> = ({ booking, lang }) => {
  const [recipientEmail, setRecipientEmail] = useState(booking.primaryGuestEmail || 'alex.morgan@telegram.me');
  const [accessToken, setAccessToken] = useState('');
  const [subject, setSubject] = useState(`💎 TON Travel Voucher Confirmation (${booking.reference})`);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; id?: string; error?: string } | null>(null);

  // Client-side Google Identity Services OAuth trigger
  const handleConnectGoogle = () => {
    // Check if google accounts client is available or prompt user for standard token
    const win = window as any;
    const meta = import.meta as any;
    if (win.google?.accounts?.oauth2) {
      const client = win.google.accounts.oauth2.initTokenClient({
        client_id: meta.env?.VITE_GOOGLE_CLIENT_ID || '',
        scope: 'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly',
        callback: (response: any) => {
          if (response.access_token) {
            setAccessToken(response.access_token);
          }
        },
      });
      client.requestAccessToken();
    } else {
      // Fallback: prompt for access token or notify user
      const token = prompt('Please paste your Google OAuth Access Token with Gmail.send scope:');
      if (token) {
        setAccessToken(token.trim());
      }
    }
  };

  const handleSendEmail = async () => {
    if (!recipientEmail) {
      alert('Please enter a recipient email address.');
      return;
    }

    if (!accessToken) {
      alert('Please authorize Google / paste access token first.');
      return;
    }

    setSending(true);
    setSendResult(null);

    const htmlBody = buildVoucherHtml(booking);

    const result = await sendEmailViaGmailApi({
      accessToken,
      to: recipientEmail,
      subject,
      htmlBody
    });

    setSending(false);
    setSendResult(result);
  };

  return (
    <div className="max-w-4xl mx-auto my-6 px-4 space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black text-white">Gmail Travel Voucher Dispatcher</h2>
              <span className="bg-red-500/20 text-red-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/30">
                Gmail API Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Send official PDF-styled HTML travel vouchers directly to guest inbox using Google OAuth.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Form Controls */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Email Dispatch Settings</span>
          </h3>

          {/* OAuth Auth Status */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">OAuth Status:</span>
              {accessToken ? (
                <span className="text-emerald-400 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Authorized</span>
                </span>
              ) : (
                <span className="text-amber-400 font-bold flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Not Connected</span>
                </span>
              )}
            </div>

            <button
              onClick={handleConnectGoogle}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2 rounded-lg text-xs flex items-center justify-center space-x-2 border border-slate-700 transition"
            >
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>{accessToken ? 'Re-authorize Google Account' : 'Connect Google / Enter OAuth Token'}</span>
            </button>
          </div>

          {/* Recipient Input */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
              Recipient Email Address
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              placeholder="e.g. alex.morgan@telegram.me"
            />
          </div>

          {/* Subject Line Input */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
              Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSendEmail}
            disabled={sending}
            className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-red-600/20 disabled:opacity-50"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>{sending ? 'Dispatching via Gmail API...' : 'Send Voucher to Inbox Now'}</span>
          </button>

          {/* Result Banner */}
          {sendResult && (
            <div className={`p-4 rounded-xl border text-xs space-y-1 ${
              sendResult.success
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/80 border-rose-500/40 text-rose-200'
            }`}>
              <div className="font-bold flex items-center space-x-1.5">
                {sendResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                <span>{sendResult.success ? 'Email Dispatched Successfully!' : 'Failed to Dispatch Email'}</span>
              </div>
              {sendResult.id && <p className="font-mono text-[11px] opacity-80">Gmail Message ID: {sendResult.id}</p>}
              {sendResult.error && <p className="text-[11px] opacity-90">{sendResult.error}</p>}
            </div>
          )}

        </div>

        {/* Live Email Preview Box */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase text-slate-400 tracking-wider">
            Live HTML Email Preview
          </h3>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono space-y-2 text-slate-300">
            <div className="border-b border-slate-800 pb-2 space-y-1">
              <div><span className="text-slate-500">From:</span> TON Travel Official &lt;rsk934128@gmail.com&gt;</div>
              <div><span className="text-slate-500">To:</span> {recipientEmail}</div>
              <div><span className="text-slate-500">Subject:</span> {subject}</div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 space-y-1">
              <div className="font-bold text-cyan-300">💎 TON TRAVEL VOUCHER #{booking.reference}</div>
              <div>Hotel: {booking.hotelName} ({booking.location})</div>
              <div>Paid: ${booking.totalPaidUsd.toFixed(2)} USD ({booking.totalPaidTon.toFixed(2)} TON)</div>
              <div>Cashback: +{booking.cashbackTon.toFixed(3)} TON to {booking.payoutWallet}</div>
              <div className="text-emerald-400 font-semibold pt-1">✅ Verified Status: Reservation Guaranteed</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
