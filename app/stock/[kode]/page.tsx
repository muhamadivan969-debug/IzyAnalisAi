'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MessageCircle } from 'lucide-react';
import Card from '@/components/Card';
import Skeleton from '@/components/Skeleton';
import Particles from '@/components/Particles';
import { showToast } from '@/components/Toast';

export default function StockDetail() {
  const { kode } = useParams();
  const router = useRouter();
  const [stock, setStock] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'analisa'>('ringkasan');
  const [isWatchlist, setIsWatchlist] = useState(false);

  useEffect(() => {
    fetch(`/api/saham?kode=${kode}`)
      .then(r => r.json())
      .then(j => {
        if (j.success) setStock(j.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [kode]);

  const toggleWatchlist = () => {
    setIsWatchlist(!isWatchlist);
    showToast(`${kode} ${isWatchlist ? 'dihapus dari' : 'ditambahkan ke'} Watchlist`, 'success');
  };

  if (loading) {
    return (
      <>
        <Particles />
        <div className="relative z-10 space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </>
    );
  }

  const isPositive = stock?.changePercent >= 0;

  return (
    <>
      <Particles />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 space-y-4 pb-4"
      >
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{stock?.kode}</h2>
            <p className="text-xs text-gray-400">{stock?.name}</p>
          </div>
          <button onClick={toggleWatchlist} className="p-2 hover:bg-[#162035] rounded-full transition">
            <Star className={`w-5 h-5 ${isWatchlist ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} />
          </button>
        </div>

        <Card>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-3xl font-bold">Rp {Number(stock?.close || 0).toLocaleString()}</p>
              <span className={`text-sm font-bold ${isPositive ? 'text-[#00d26a]' : 'text-[#ff4d5a]'}`}>
                {isPositive ? '+' : ''}{stock?.changePercent?.toFixed(2) || 0}%
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Volume</p>
              <p className="text-sm">{Number(stock?.volume || 0).toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="h-48 flex items-center justify-center bg-[#0a0e1a] rounded-lg border border-[#162035]">
            <p className="text-gray-500 text-sm">📊 Chart Candlestick</p>
          </div>
          <div className="flex gap-2 mt-3">
            {['1D', '1W', '1M', '3M', '1Y'].map(tab => (
              <button key={tab} className="px-3 py-1 text-xs rounded-full bg-[#162035] text-gray-400 hover:bg-[#00c2ff]/20 hover:text-[#00c2ff] transition">
                {tab}
              </button>
            ))}
          </div>
        </Card>

        <div className="flex gap-2 border-b border-[#162035] pb-2">
          {(['ringkasan', 'analisa'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition ${
                activeTab === tab ? 'text-[#00c2ff] border-b-2 border-[#00c2ff]' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'ringkasan' ? '📋 Ringkasan' : '🤖 Analisa AI'}
            </button>
          ))}
        </div>

        <Card>
          {activeTab === 'ringkasan' && (
            <div className="space-y-2 text-sm text-gray-300">
              <p><span className="text-gray-500">Harga:</span> Rp {Number(stock?.close || 0).toLocaleString()}</p>
              <p><span className="text-gray-500">Perubahan:</span> {isPositive ? '+' : ''}{stock?.changePercent?.toFixed(2)}%</p>
              <p><span className="text-gray-500">Volume:</span> {Number(stock?.volume || 0).toLocaleString()}</p>
            </div>
          )}
          {activeTab === 'analisa' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Skor AI</span>
                    <span className={isPositive ? 'text-[#00d26a]' : 'text-[#ff4d5a]'}>{isPositive ? '72' : '45'}/100</span>
                  </div>
                  <div className="w-full h-2 bg-[#162035] rounded-full mt-1 overflow-hidden">
                    <div className={`h-full rounded-full ${isPositive ? 'bg-[#00d26a]' : 'bg-[#ff4d5a]'}`} style={{ width: isPositive ? '72%' : '45%' }} />
                  </div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${isPositive ? 'bg-[#00d26a]/20 text-[#00d26a]' : 'bg-[#ff4d5a]/20 text-[#ff4d5a]'}`}>
                  {isPositive ? 'BULLISH' : 'BEARISH'}
                </span>
              </div>
              <button className="w-full bg-[#00c2ff] text-[#05070d] font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Tanya AI tentang {kode}
              </button>
            </div>
          )}
        </Card>
      </motion.div>
    </>
  );
}
