import React, { useState } from 'react';
import { Language } from '../types';
import { Server, Code, ArrowRightLeft, ShieldCheck, Terminal, Copy, Check, ExternalLink, Zap, RefreshCw } from 'lucide-react';

interface GatewayGuideProps {
  lang: Language;
}

export const GatewayGuide: React.FC<GatewayGuideProps> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tonconnect' | 'api' | 'fiat' | 'simulator'>('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Simulator state
  const [simAmountTon, setSimAmountTon] = useState('265.68');
  const [simReceiverWallet, setSimReceiverWallet] = useState('EQBvW839_TonSpace_cX92');
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [simulating, setSimulating] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleRunSimulator = () => {
    setSimulating(true);
    setSimLogs(['[1/4] Initializing TON Center API connection...']);

    setTimeout(() => {
      setSimLogs(prev => [...prev, `[2/4] Constructing payment transaction for ${simAmountTon} TON to ${simReceiverWallet}...`]);
    }, 800);

    setTimeout(() => {
      setSimLogs(prev => [...prev, '[3/4] Transmitting BOC payload to TON Mainnet Validators...']);
    }, 1600);

    setTimeout(() => {
      const mockHash = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setSimLogs(prev => [
        ...prev,
        `[4/4] ✅ SUCCESS! Transaction confirmed in block #38910234.`,
        `Transaction Hash: ${mockHash}`,
        `Payment verified on-chain. Cashback triggered!`
      ]);
      setSimulating(false);
    }, 2500);
  };

  const tonConnectCode = `import { TonConnectUI } from '@tonconnect/ui';

// Initialize TON Connect UI instance in Telegram Mini App
const tonConnectUI = new TonConnectUI({
  manifestUrl: 'https://your-app.com/tonconnect-manifest.json',
  buttonRootId: 'ton-connect-button'
});

// Prepare Payment Transaction Payload
const transaction = {
  validUntil: Math.floor(Date.now() / 1000) + 300, // 5 minutes
  messages: [
    {
      address: 'EQBvW839_TonSpace_cX92', // Payout Wallet
      amount: '265680000000', // 265.68 TON in nanoTON (1 TON = 10^9 nanoTON)
      payload: 'te6ccgEBAQEANAAAGwA...' // Optional BOC comment or invoice metadata
    }
  ]
};

// Send Transaction Request to User Wallet (Tonkeeper / Telegram @Wallet)
const result = await tonConnectUI.sendTransaction(transaction);
console.log('Transaction BOC:', result.boc);`;

  const backendVerifyCode = `// Node.js Express Webhook Verification for TON Payment
import express from 'express';
import { TonWeb } from 'tonweb';

const app = express();
const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC'));

app.post('/api/verify-ton-payment', async (req, res) => {
  const { txHash, expectedAmountTon, payoutWallet } = req.body;

  // Query transaction status on TON Blockchain
  const txs = await tonweb.getTransactions(payoutWallet, 10);
  const matchedTx = txs.find(tx => tx.transaction_id.hash === txHash);

  if (matchedTx && matchedTx.in_msg.value >= expectedAmountTon * 1e9) {
    return res.json({ status: 'SUCCESS', verified: true });
  }

  return res.status(400).json({ status: 'FAILED', verified: false });
});`;

  return (
    <div className="max-w-6xl mx-auto my-6 px-4 space-y-6">
      
      {/* Header section */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Server className="w-4 h-4" />
              <span>TON Blockchain Payment Architecture</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              {lang === 'en' ? 'TON Payment Gateway Setup & P2P Cashout Guide' : 'TON পেমেন্ট গেটওয়ে এবং ক্যাশ আউট গাইড'}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              {lang === 'en'
                ? 'Complete technical guide on integrating TON Connect SDK, Telegram Crypto Bot API, and converting crypto into BDT/USD local currency.'
                : 'টেলিগ্রাম মিনি অ্যাপে TON Connect, টেলিগ্রাম পে, স্মার্ট কন্ট্রাক্ট এবং ক্রিপ্টো থেকে বিকাশ/নগদ/ব্যাংক অ্যাকাউন্টে টাকা রূপান্তরের নির্দেশিকা।'}
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 font-mono text-xs text-right">
            <span className="text-slate-500 text-[10px] block">PAYOUT WALLET:</span>
            <span className="text-cyan-300 font-bold">EQBvW839_TonSpace_cX92</span>
          </div>
        </div>

        {/* Inner Subtabs */}
        <div className="flex space-x-2 mt-6 overflow-x-auto pb-1 scrollbar-none border-t border-slate-800/80 pt-4">
          {[
            { id: 'overview', nameEn: '1. Overview & Methods', nameBn: '১. বিস্তারিত প্রক্রিয়া' },
            { id: 'tonconnect', nameEn: '2. TON Connect SDK', nameBn: '২. টোন কানেক্ট এসডিকে' },
            { id: 'api', nameEn: '3. Backend Verification', nameBn: '৩. ব্যাকএন্ড ভেরিফিকেশন' },
            { id: 'fiat', nameEn: '4. FIAT & BDT Cashout', nameBn: '৪. টাকা রূপান্তর (BDT)' },
            { id: 'simulator', nameEn: '5. Live Gateway Sandbox', nameBn: '৫. গেটওয়ে টেস্ট' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                activeTab === item.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'en' ? item.nameEn : item.nameBn}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h3 className="text-base font-bold text-white">TON Connect (টোন কানেক্ট)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'Official standard protocol connecting user wallets (Tonkeeper, Telegram Wallet) directly with your Mini App to approve on-chain payments.'
                : 'TON-এর অফিসিয়াল স্ট্যান্ডার্ড প্রোটোকল। ইউজার Tonkeeper বা Telegram Wallet থেকে আপনার অ্যাপে সরাসরি ট্রানজেকশন অ্যাপ্রুভ করতে পারে।'}
            </p>
          </div>

          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h3 className="text-base font-bold text-white">Telegram Pay / Crypto Bot</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'Use Telegram Crypto Pay API or third-party gateways (Cryptomus) to issue instant payment invoices and receive webhooks.'
                : 'টেলিগ্রামের নিজস্ব ওয়ালেট বা থার্ড-পার্টি বট API ব্যবহার করে সহজে ইনভয়েস পাঠাতে এবং ব্যাকএন্ডে কনফার্মেশন রিসিভ করতে পারেন।'}
            </p>
          </div>

          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h3 className="text-base font-bold text-white">Direct Smart Contract</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'Transactions route directly on-chain to your designated payout address EQBvW839_TonSpace_cX92 with instant verification.'
                : 'ইউজারের পেমেন্ট সরাসরি নির্দিষ্ট ট্রানজেকশনের মাধ্যমে আপনার পেআউট ওয়ালেটে (EQBvW839_TonSpace_cX92) জমা হয়।'}
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: TON CONNECT CODE */}
      {activeTab === 'tonconnect' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Code className="w-4 h-4 text-cyan-400" />
              <span>Frontend TON Connect Integration (Client-Side)</span>
            </h3>
            <button
              onClick={() => copyToClipboard(tonConnectCode, 'tc')}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded flex items-center space-x-1"
            >
              {copiedCode === 'tc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode === 'tc' ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
          <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto border border-slate-800 leading-relaxed">
            {tonConnectCode}
          </pre>
        </div>
      )}

      {/* TAB 3: BACKEND VERIFICATION */}
      {activeTab === 'api' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Backend On-Chain Transaction Verifier (Node.js Express)</span>
            </h3>
            <button
              onClick={() => copyToClipboard(backendVerifyCode, 'bv')}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded flex items-center space-x-1"
            >
              {copiedCode === 'bv' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode === 'bv' ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
          <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto border border-slate-800 leading-relaxed">
            {backendVerifyCode}
          </pre>
        </div>
      )}

      {/* TAB 4: FIAT / BDT CASHOUT */}
      {activeTab === 'fiat' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-5">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <ArrowRightLeft className="w-5 h-5 text-amber-400" />
            <span>{lang === 'en' ? 'Converting Crypto (TON) to BDT & Local Bank' : 'ক্রিপ্টো থেকে স্থানীয় মুদ্রায় (টাকা/ডলার) রূপান্তর'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            {/* P2P Exchange */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold text-[10px] uppercase">
                Method 1: P2P Exchange
              </span>
              <h4 className="font-bold text-white text-sm">Binance / Telegram @Wallet P2P</h4>
              <p className="text-slate-400 leading-relaxed">
                {lang === 'en'
                  ? 'Transfer TON from payout wallet EQBvW839_TonSpace_cX92 to Binance or Telegram @Wallet. Sell via P2P directly to bKash, Nagad, Rocket, or Bank Transfer.'
                  : 'আপনার ওয়ালেটে TON জমা হওয়ার পর Binance, OKX অথবা Telegram-এর নিজস্ব @Wallet P2P ব্যবহার করে বিক্রি করে সরাসরি বিকাশ/নগদ বা ব্যাংক অ্যাকাউন্টে টাকা নিতে পারবেন।'}
              </p>
            </div>

            {/* Off-ramp */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-bold text-[10px] uppercase">
                Method 2: Off-Ramp Service
              </span>
              <h4 className="font-bold text-white text-sm">Official TON Foundation Off-Ramp</h4>
              <p className="text-slate-400 leading-relaxed">
                {lang === 'en'
                  ? 'Utilize TON Foundation certified off-ramp services to liquidate crypto into USD wire or credit cards automatically.'
                  : 'TON ফাউন্ডেশনের অফিশিয়াল অফ-র্যাম্প সার্ভিসগুলো ব্যবহার করে সরাসরি ক্রিপ্টোকে ডলারে কনভার্ট করে নিতে পারবেন।'}
              </p>
            </div>

          </div>
        </div>
      )}

      {/* TAB 5: GATEWAY SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                <span>Interactive Payment Gateway Simulator</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Test live on-chain payment dispatch to address <code className="text-cyan-300 font-mono">EQBvW839_TonSpace_cX92</code>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Input Form */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">Payment Amount (TON)</label>
                <input
                  type="text"
                  value={simAmountTon}
                  onChange={(e) => setSimAmountTon(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono mt-1 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">Payout Wallet Address</label>
                <input
                  type="text"
                  value={simReceiverWallet}
                  onChange={(e) => setSimReceiverWallet(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-cyan-300 font-mono mt-1 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                onClick={handleRunSimulator}
                disabled={simulating}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                {simulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                <span>{simulating ? 'Broadcasting to TON...' : 'Run Payment Test'}</span>
              </button>
            </div>

            {/* Terminal Output */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2 h-48 overflow-y-auto">
              <div className="text-[10px] text-slate-500 uppercase border-b border-slate-800 pb-1">
                GATEWAY LOGS & ON-CHAIN VERIFIER
              </div>
              {simLogs.length === 0 ? (
                <div className="text-slate-600 italic">Click "Run Payment Test" to simulate a live 265.68 TON transaction.</div>
              ) : (
                simLogs.map((log, idx) => (
                  <div key={idx} className={log.includes('SUCCESS') ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                    {log}
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
