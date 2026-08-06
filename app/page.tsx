'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Zap, BarChart3, 
  Sparkles, Crown, Activity, ArrowUpRight,
  Flame, Bell, Eye
} from 'lucide-react';
import Particles from '@/components/Particles';
import Card from '@/components/Card';
import Skeleton from '@/components/Skeleton';
import StockRow from '@/components/StockRow';

export default function Home() {
  const [ihsg, setIhsg] = useState({ loading: true, close: 0, changePercent: 0 });
  const [topPicks, setTopPicks] = useState<any[]>([]);
  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/summary').then(r => r.json()),
      fetch('/api/signal').then(r => r.json()),
    ]).then(([summary, signal]) => {
      if (summary.success) {
        setIhsg({ loading: false, close: summary.data.ihsg.close, changePercent: summary.data.ihsg.changePercent });
        setTopPicks(summary.data.topPicks || []);
      }
      if (signal.success) {
        setSignals(signal.data.signals.slice(0, 3));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const isPositive = ihsg.changePercent >= 0;

  return (
    <>
      <Particles />
      <div className="relative z-10 space-y-5 pb-4">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-[#00c2ff]" />
              Selamat Datang
            </p>
            <h2 className="text-2xl font-bold text-white glow-text flex items-center gap-2">
              Halo, Trader!
              <Crown className="w-4 h-4 text-yellow-400" />
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs bg-[#00d26a]/10 border border-[#00d26a]/20 px-3 py-1 rounded-full">
              <div className="pulse-dot w-1.5 h-1.5" />
              <span className="text-[#00d26a] text-[10px]">Live</span>
            </div>
            <button className="p-2 hover:bg-[#162035] rounded-full transition relative">
              <Bell className="w-4 h-4 text-gray-400" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#ff4d5a] rounded-full" />
            </button>
          </div>
        </div>

        {/* IHSG Card */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <Card className="relative overflow-hidden border-[#00c2ff]/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00c2ff]/5 rounded-full blur-3xl" />
            
            <div className="flex justify-between items-start relative">
              <div>
                <p className="text-sm text-gray-400 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00c2ff] animate-pulse" />
                  IHSG
                </p>
                {ihsg.loading ? (
                  <Skeleton className="h-10 w-32" />
                ) : (
                  <div className="flex items-baseline gap-4">
                    <span className="text-4xl font-extrabold glow-text tracking-tight">
                      {Number(ihsg.close).toLocaleString()}
                    </span>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                      isPositive ? 'bg-[#00d26a]/20 text-[#00d26a]' : 'bg-[#ff4d5a]/20 text-[#ff4d5a]'
                    }`}>
                      {isPositive ? '↑ +' : '↓ '}{ihsg.changePercent.toFixed(2)}%
                    </span>
                  </div>
                )}
              </div>
              <div className="w-28">
                <div className="h-12 flex items-end gap-0.5">
                  {[20, 35, 25, 45, 30, 60, 40, 55, 35, 50, 65, 45].map((h, i) => (
                    <div key={i} className="w-1.5 rounded-t transition-all" style={{
                      height: `${h}%`,
                      background: isPositive 
                        ? `linear-gradient(to top, #00d26a, #00c2ff)` 
                        : `linear-gradient(to top, #ff4d5a, #ff6b7a)`,
                      opacity: 0.5 + (i / 12) * 0.5,
                    }} />
                  ))}
                </div>
                <div className="flex gap-1 mt-1">
                  {['1D', '1W', '1M', '1Y'].map(tab => (
                    <button key={tab} className={`px-2 py-0.5 text-[10px] rounded-full transition ${
                      tab === '1D' 
                        ? 'bg-[#00c2ff] text-[#05070d] font-bold' 
                        : 'text-gray-500 hover:text-white hover:bg-[#162035]'
                    }`}>
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <Card className="text-center p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Fear & Greed</p>
              <h3 className="text-xl font-extrabold text-[#00c2ff]">68</h3>
              <span className="text-[10px] text-[#00d26a]">Greedy</span>
            </Card>
          </motion.div>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
            <Card className="text-center p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Win Rate</p>
              <h3 className="text-xl font-extrabold text-[#00d26a]">84%</h3>
              <span className="text-[10px] text-[#00c2ff]">High</span>
            </Card>
          </motion.div>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Card className="text-center p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Signal</p>
              <h3 className="text-xl font-extrabold text-yellow-400">{signals.length}</h3>
              <span className="text-[10px] text-yellow-400">New</span>
            </Card>
          </motion.div>
        </div>

        {/* Live Signals */}
        {signals.length > 0 && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                Live Signal
              </h3>
              <button className="text-xs text-[#00c2ff] hover:underline">Lihat Semua</button>
            </div>
            <div className="space-y-2 mt-2">
              {signals.map((s) => (
                <div key={s.kode} className="glass-card p-3 flex justify-between items-center border-[#00c2ff]/20">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-[#ff4d5a] rounded-full animate-pulse" />
                    <div>
                      <p className="font-bold text-white text-sm">{s.kode}</p>
                      <p className="text-[10px] text-gray-400">{s.volumeRatio.toFixed(0)}x VOL</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{s.harga}</p>
                    <span className={`text-[10px] font-bold ${s.change >= 0 ? 'text-[#00d26a]' : 'text-[#ff4d5a]'}`}>
                      {s.change >= 0 ? '+' : ''}{s.change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Top Pick */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            Top Pick AI
          </h3>
          <div className="space-y-2 mt-2">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
            ) : topPicks.length === 0 ? (
              <Card><p className="text-center text-gray-400 py-4 text-sm">Belum ada data</p></Card>
            ) : (
              topPicks.map((s: any) => (
                <StockRow key={s.kode} stock={s} onClick={() => {}} onToggle={() => {}} />
              ))
            )}
          </div>
        </motion.div>

        {/* Top Movers Preview */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00d26a]" />
              Top Movers
            </h3>
            <button className="text-xs text-[#00c2ff] hover:underline">Lihat Semua</button>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {['ALKA', 'DWGL', 'MSKY', 'VIVA'].map((kode, i) => (
              <div key={kode} className="glass-card p-3 flex justify-between items-center">
                <span className="font-bold text-white text-sm">{kode}</span>
                <span className="text-xs font-bold text-[#00d26a]">
                  {['+9.97%', '+9.63%', '+9.52%', '+9.43%'][i]}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}
