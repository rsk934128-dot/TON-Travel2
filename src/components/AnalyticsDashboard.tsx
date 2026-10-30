import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { Language } from '../types';
import { TrendingUp, Coins, Sparkles, Award, Wallet, Calendar } from 'lucide-react';

interface AnalyticsDashboardProps {
  lang: Language;
}

const MONTHLY_ANALYTICS_DATA = [
  { month: 'Jan 2026', bookingVolumeTon: 1250, cashbackSavingsTon: 100, volumeUsd: 6775, cashbackUsd: 542 },
  { month: 'Feb 2026', bookingVolumeTon: 1840, cashbackSavingsTon: 147, volumeUsd: 9972, cashbackUsd: 796 },
  { month: 'Mar 2026', bookingVolumeTon: 2400, cashbackSavingsTon: 192, volumeUsd: 13008, cashbackUsd: 1040 },
  { month: 'Apr 2026', bookingVolumeTon: 3100, cashbackSavingsTon: 248, volumeUsd: 16802, cashbackUsd: 1344 },
  { month: 'May 2026', bookingVolumeTon: 4250, cashbackSavingsTon: 340, volumeUsd: 23035, cashbackUsd: 1842 },
  { month: 'Jun 2026', bookingVolumeTon: 5800, cashbackSavingsTon: 464, volumeUsd: 31436, cashbackUsd: 2514 },
  { month: 'Jul 2026', bookingVolumeTon: 7200, cashbackSavingsTon: 576, volumeUsd: 39024, cashbackUsd: 3121 },
  { month: 'Aug 2026', bookingVolumeTon: 9450, cashbackSavingsTon: 756, volumeUsd: 51219, cashbackUsd: 4097 },
];

const DESTINATION_DATA = [
  { city: 'New York', bookings: 342, volumeTon: 3210 },
  { city: 'Dubai', bookings: 289, volumeTon: 2950 },
  { city: 'London', bookings: 210, volumeTon: 1820 },
  { city: 'Tokyo', bookings: 195, volumeTon: 1650 },
  { city: 'Paris', bookings: 178, volumeTon: 1520 },
];

const LOYALTY_TIER_COMPARISON_DATA = [
  { bookingTotalUsd: 500, bookingTotalTon: 92 },
  { bookingTotalUsd: 1500, bookingTotalTon: 277 },
  { bookingTotalUsd: 3000, bookingTotalTon: 554 },
  { bookingTotalUsd: 5000, bookingTotalTon: 923 },
  { bookingTotalUsd: 8000, bookingTotalTon: 1476 },
  { bookingTotalUsd: 12000, bookingTotalTon: 2214 },
  { bookingTotalUsd: 20000, bookingTotalTon: 3690 },
].map((item) => {
  const bronzeUsd = item.bookingTotalUsd * 0.02;
  const silverUsd = item.bookingTotalUsd * 0.05;
  const goldUsd = item.bookingTotalUsd * 0.08;

  const bronzeTon = item.bookingTotalTon * 0.02;
  const silverTon = item.bookingTotalTon * 0.05;
  const goldTon = item.bookingTotalTon * 0.08;

  return {
    bookingUsd: `$${item.bookingTotalUsd.toLocaleString()}`,
    bookingTon: `${item.bookingTotalTon} TON`,
    bookingUsdRaw: item.bookingTotalUsd,
    bookingTonRaw: item.bookingTotalTon,
    BronzeUsd: Math.round(bronzeUsd),
    SilverUsd: Math.round(silverUsd),
    GoldUsd: Math.round(goldUsd),
    BronzeTon: Number(bronzeTon.toFixed(1)),
    SilverTon: Number(silverTon.toFixed(1)),
    GoldTon: Number(goldTon.toFixed(1)),
  };
});

const CustomTooltip = ({ active, payload, label, metricType }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs font-mono space-y-1">
        <div className="font-bold text-slate-200 border-b border-slate-800 pb-1">{label}</div>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center space-x-2" style={{ color: entry.color }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-400">{entry.name}:</span>
            <span className="font-bold text-white">
              {metricType === 'TON'
                ? `${entry.value.toLocaleString()} TON`
                : `$${entry.value.toLocaleString()} USD`}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ lang }) => {
  const [metricType, setMetricType] = useState<'TON' | 'USD'>('TON');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>TON Blockchain Analytics & Growth</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            {lang === 'en' ? 'Smart Voucher & Volume Analytics' : 'স্মার্ট ভাউচার ও পেমেন্ট অ্যানালিটিক্স'}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            {lang === 'en'
              ? 'Real-time tracking of monthly TON travel booking volume and Telegram Premium 8% cashback savings.'
              : 'মাসিক TON বুকিং ভলিউম এবং ৮% ক্যাশব্যাক সাশ্রয়ী ট্র্যাক করুন।'}
          </p>
        </div>

        {/* Currency toggle */}
        <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center space-x-1 shrink-0">
          <button
            onClick={() => setMetricType('TON')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              metricType === 'TON'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            💎 TON Currency
          </button>
          <button
            onClick={() => setMetricType('USD')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              metricType === 'USD'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            💵 USD Equivalent
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
            <span>Total TON Volume (YTD)</span>
            <Coins className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {metricType === 'TON' ? '35,290 TON' : '$191,271 USD'}
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>+31.2% growth this month</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
            <span>Cashback Savings Paid</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {metricType === 'TON' ? '2,823 TON' : '$15,300 USD'}
          </div>
          <div className="text-[11px] text-slate-400">
            👑 Telegram Premium 8% active
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
            <span>Verified Travel Vouchers</span>
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            1,209 Vouchers
          </div>
          <div className="text-[11px] text-cyan-400">
            100% On-Chain Verified
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
            <span>Destination Payout Wallet</span>
            <Wallet className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xs font-bold text-amber-300 font-mono truncate">
            EQBvW839_TonSpace...
          </div>
          <div className="text-[11px] text-slate-400">
            TON SPACE Active
          </div>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Monthly TON Booking Volume vs. Cashback Savings</span>
            </h3>
            <p className="text-xs text-slate-400">
              Comparative trend analysis rendered with Recharts
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-cyan-400" />
              <span className="text-slate-300">Booking Volume</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-slate-300">Cashback Savings</span>
            </div>
          </div>
        </div>

        {/* Recharts Line Chart Container */}
        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={MONTHLY_ANALYTICS_DATA}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="month"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={(val) =>
                  metricType === 'TON' ? `${val} TON` : `$${val / 1000}k`
                }
              />
              <Tooltip content={<CustomTooltip metricType={metricType} />} />
              <Legend
                wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
              />
              <Line
                type="monotone"
                dataKey={metricType === 'TON' ? 'bookingVolumeTon' : 'volumeUsd'}
                name={metricType === 'TON' ? 'Booking Volume (TON)' : 'Booking Volume (USD)'}
                stroke="#22d3ee"
                strokeWidth={3}
                dot={{ fill: '#22d3ee', r: 5 }}
                activeDot={{ r: 8, fill: '#38bdf8' }}
              />
              <Line
                type="monotone"
                dataKey={metricType === 'TON' ? 'cashbackSavingsTon' : 'cashbackUsd'}
                name={metricType === 'TON' ? 'Cashback Savings (TON)' : 'Cashback Savings (USD)'}
                stroke="#34d399"
                strokeWidth={3}
                dot={{ fill: '#34d399', r: 5 }}
                activeDot={{ r: 8, fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Loyalty Tier Cashback Breakdown Section */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Loyalty Tier Reward Matrix</span>
            </div>
            <h3 className="text-lg font-black text-white mt-1">
              {lang === 'en'
                ? 'Potential Cashback Earnings by Loyalty Tier'
                : 'আনুপাতিক ক্যাশব্যাক উপার্জন (ব্রোঞ্জ, সিলভার ও গোল্ড)'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'en'
                ? "Compare potential cashback returns for 'Bronze' (2%), 'Silver' (5%), and 'Gold' (8%) status across booking total benchmarks."
                : 'বুকিং ভলিউমের ভিত্তিতে ব্রোঞ্জ (২%), সিলভার (৫%) এবং গোল্ড (৮%) টিয়ারের ক্যাশব্যাক তুলনা করুন।'}
            </p>
          </div>

          {/* Tier rate legend badges */}
          <div className="flex items-center space-x-2 text-xs font-mono shrink-0">
            <span className="px-2.5 py-1 bg-amber-950/70 text-amber-500 border border-amber-500/30 rounded-lg flex items-center space-x-1 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              <span>Bronze 2%</span>
            </span>
            <span className="px-2.5 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg flex items-center space-x-1 font-bold">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>Silver 5%</span>
            </span>
            <span className="px-2.5 py-1 bg-yellow-950/80 text-yellow-300 border border-yellow-500/40 rounded-lg flex items-center space-x-1 font-bold">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span>Gold 8%</span>
            </span>
          </div>
        </div>

        {/* Loyalty Tier Comparison BarChart */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={LOYALTY_TIER_COMPARISON_DATA}
              margin={{ top: 15, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey={metricType === 'TON' ? 'bookingTon' : 'bookingUsd'}
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={(val) =>
                  metricType === 'TON' ? `${val} TON` : `$${val}`
                }
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-950 border border-slate-700 p-3.5 rounded-xl shadow-2xl text-xs font-mono space-y-2">
                        <div className="font-bold text-white border-b border-slate-800 pb-1.5 flex items-center justify-between space-x-4">
                          <span>Booking Total:</span>
                          <span className="text-cyan-300">{label}</span>
                        </div>
                        <div className="space-y-1">
                          {payload.map((entry: any, index: number) => (
                            <div key={`tier-${index}`} className="flex justify-between items-center space-x-6">
                              <span className="flex items-center space-x-1.5" style={{ color: entry.color }}>
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span>{entry.name}:</span>
                              </span>
                              <span className="font-bold text-white">
                                {metricType === 'TON'
                                  ? `${entry.value} TON`
                                  : `$${entry.value} USD`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
              <Bar
                dataKey={metricType === 'TON' ? 'BronzeTon' : 'BronzeUsd'}
                name="Bronze Status (2%)"
                fill="#d97706"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey={metricType === 'TON' ? 'SilverTon' : 'SilverUsd'}
                name="Silver Status (5%)"
                fill="#94a3b8"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey={metricType === 'TON' ? 'GoldTon' : 'GoldUsd'}
                name="Gold Status (8%)"
                fill="#eab308"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Destination Breakdown */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white">
          Top Travel Destinations by TON Volume
        </h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={DESTINATION_DATA}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="city" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Bar dataKey="volumeTon" name="TON Volume" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
