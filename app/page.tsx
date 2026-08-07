'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Bell, Crown, Sparkles, Zap, Flame, TrendingUp, 
  TrendingDown, Activity 
} from 'lucide-react';
import Card from '@/components/Card';
import Skeleton from '@/components/Skeleton';
import StockRow from '@/components/StockRow';
import Particles from '@/components/Particles';
import PulseDot from '@/components/PulseDot';

export default function Home() {
  const router = useRouter();
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

    // Auto refresh setiap 30 detik
    const interval = setInterval(() => {
      fetch('/api/summary')
        .then(r => r.json())
        .then(j => {
          if (j.success) {
            setIhsg({ loading: false, close: j.data.ihsg.close, changePercent: j.data.ihsg.changePercent });
            setTopPicks(j.data.topPicks || []);
          }
        });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const isPositive = ihsg.changePercent >= 0;

  return (
    <>
      <Particles />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 space-y-4 pb-4"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#00c2ff]" />
              Selamat Datang
            </p>
            <h2 className="text-xl font-bold flex items-center gap-2">
              Halo, Trader!
              <Crown className="w-4 h-4 text-yellow-400" />
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-[#00d26a]/10 text-[#00d26a] px-3 py-1 rounded-full flex items-center gap-1">
              <PulseDot />
              Live
            </span>
            <Bell className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* IHSG */}
        <Card>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400">IHSG</p>
              {ihsg.loading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">
                    {Number(ihsg.close).toLocaleString()}
                  </span>
                  <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${
                    isPositive ? 'bg-[#00d26a]/15 text-[#00d26a]' : 'bg-[#ff4d5a]/15 text-[#ff4d5a]'
                  }`}>
                    {isPositive ? '↑ +' : '↓ '}{ihsg.changePercent.toFixed(2)}%
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-1">
              {['1D', '1W', '1M', '1Y'].map(tab => (
                <button key={tab} className="text-xs px-2 py-1 bg-[#162035] rounded-full text-gray-400">
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <Card className="text-center p-3">
            <p className="text-[10px] text-gray-400">Fear & Greed</p>
            <p className="text-xl font-bold text-[#00c2ff]">68</p>
            <span className="text-[10px] text-[#00d26a]">Greedy</span>
          </Card>
          <Card className="text-center p-3">
            <p className="text-[10px] text-gray-400">Win Rate</p>
            <p className="text-xl font-bold text-[#00d26a]">84%</p>
            <span className="text-[10px] text-[#00c2ff]">High</span>
          </Card>
          <Card className="text-center p-3">
            <p className="text-[10px] text-gray-400">Signal</p>
            <p className="text-xl font-bold text-yellow-400">{signals.length}</p>
            <span className="text-[10px] text-yellow-400">New</span>
          </Card>
        </div>

        {/* Live Signal */}
        {signals.length > 0 && (
          <div>
            <div className="flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                Live Signal
              </h3>
              <button className="text-xs text-[#00c2ff]" onClick={() => router.push('/signal')}>
                Lihat Semua
              </button>
            </div>
            <div className="space-y-2 mt-2">
              {signals.map((s, i) => (
                <motion.div
                  key={s.kode}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="card flex justify-between items-center border-[#00c2ff]/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-[#ff4d5a] rounded-full animate-pulse" />
                    <div>
                      <p className="font-bold text-sm">{s.kode}</p>
                      <p className="text-[10px] text-gray-400">{s.volumeRatio.toFixed(0)}x VOL</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{s.harga}</p>
                    <span className={`text-[10px] font-bold ${s.change >= 0 ? 'text-[#00d26a]' : 'text-[#ff4d5a]'}`}>
                      {s.change >= 0 ? '+' : ''}{s.change.toFixed(2)}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Top Pick */}
        <div>
          <h3 className="font-bold flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            Top Pick AI
          </h3>
          <div className="space-y-2 mt-2">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
            ) : topPicks.length === 0 ? (
              <Card className="text-center py-4 text-gray-400">Belum ada data</Card>
            ) : (
              topPicks.map((s: any, i) => (
                <motion.div
                  key={s.kode}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => router.push(`/stock/${s.kode}`)}
                >
                  <StockRow stock={s} onClick={() => {}} onToggle={() => {}} />
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Top Movers */}
        <div>
          <div className="flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00d26a]" />
              Top Movers
            </h3>
            <button className="text-xs text-[#00c2ff]">Lihat Semua</button>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {['ALKA', 'DWGL', 'MSKY', 'VIVA'].map((kode, i) => (
              <div key={kode} className="card p-3 flex justify-between items-center">
                <span className="font-bold text-sm">{kode}</span>
                <span className="text-xs font-bold text-[#00d26a]">
                  {['+9.97%', '+9.63%', '+9.52%', '+9.43%'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}
