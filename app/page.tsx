'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Zap, BarChart3, Sparkles, Crown, Activity } from 'lucide-react';
import Particles from '@/components/Particles';
import Card from '@/components/Card';
import Skeleton from '@/components/Skeleton';
import StockRow from '@/components/StockRow';
import SectorBottomSheet from '@/components/SectorBottomSheet';

export default function Home() {
  const router = useRouter();
  const [ihsg, setIhsg] = useState({ loading: true, close: 0, changePercent: 0 });
  const [topPicks, setTopPicks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/summary')
      .then(r => r.json())
      .then(j => {
        if (j.success) {
          setIhsg({ loading: false, close: j.data.ihsg.close, changePercent: j.data.ihsg.changePercent });
          setTopPicks(j.data.topPicks || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const isPositive = ihsg.changePercent >= 0;
  const sectors = ['Perbankan', 'Energi', 'Tambang', 'Teknologi', 'Healthcare', 'Property', 'Consumer', 'Transportasi'];

  return (
    <>
      <Particles />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="space-y-5 pb-4 relative z-10"
      >
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
          <div className="flex items-center gap-1 text-xs bg-[#00d26a]/10 border border-[#00d26a]/20 px-3 py-1 rounded-full">
            <Activity className="w-3 h-3 text-[#00d26a]" />
            <span className="text-[#00d26a]">Live</span>
          </div>
        </div>

        {/* IHSG */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card className="glow-pulse">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00c2ff] animate-pulse" />
                  IHSG
                </p>
                {ihsg.loading ? (
                  <Skeleton className="h-10 w-32" />
                ) : (
                  <div className="flex items-baseline gap-4">
                    <span className="text-4xl font-extrabold glow-text">
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
                    <div key={i} className="w-1.5 rounded-t" style={{
                      height: `${h}%`,
                      background: isPositive ? 'linear-gradient(to top, #00d26a, #00c2ff)' : 'linear-gradient(to top, #ff4d5a, #ff6b7a)',
                      opacity: 0.5 + (i / 12) * 0.5,
                    }} />
                  ))}
                </div>
                <div className="flex gap-1 mt-1">
                  {['1D', '1W', '1M', '1Y'].map(tab => (
                    <button key={tab} className={`px-2 py-0.5 text-[10px] rounded-full transition ${
                      tab === '1D' ? 'bg-[#00c2ff] text-[#05070d] font-bold' : 'text-gray-500 hover:text-white hover:bg-[#162035]'
                    }`}>
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Dua Card */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Card className="text-center">
              <p className="text-xs text-gray-400">Fear & Greed</p>
              <h3 className="text-2xl font-extrabold text-[#00c2ff] glow-text">68</h3>
              <span className="text-xs text-[#00d26a] bg-[#00d26a]/10 px-2 py-0.5 rounded-full">Greedy</span>
            </Card>
          </motion.div>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
            <Card className="text-center">
              <p className="text-xs text-gray-400">Win Rate AI</p>
              <h3 className="text-2xl font-extrabold text-[#00d26a] glow-text">84%</h3>
              <span className="text-xs text-[#00c2ff] bg-[#00c2ff]/10 px-2 py-0.5 rounded-full">High</span>
            </Card>
          </motion.div>
        </div>

        {/* Top Pick */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#00c2ff]" />
            Top Pick AI
            <span className="text-[10px] bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded-full">Premium</span>
          </h3>
          <div className="space-y-2 mt-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
            ) : topPicks.length === 0 ? (
              <Card><p className="text-center text-gray-400 py-4">Belum ada data</p></Card>
            ) : (
              topPicks.map((s: any) => (
                <StockRow key={s.kode} stock={s} onClick={() => router.push(`/stock/${s.kode}`)} onToggle={() => {}} />
              ))
            )}
          </div>
        </motion.div>

        {/* Heatmap Sektor */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#00c2ff]" />
            Heatmap Sektor
          </h3>
          <p className="text-xs text-gray-400 -mt-1">Ketuk sektor untuk lihat 950+ saham</p>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {sectors.map((sec, i) => {
              const change = (Math.random() * 6 - 3);
              return (
                <motion.div
                  key={sec}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.05 * i }}
                  onClick={() => setSelectedSector(sec)}
                  className={`glass-card p-4 text-center cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                    change >= 0 ? 'hover:border-[#00d26a]/30' : 'hover:border-[#ff4d5a]/30'
                  }`}
                  style={{ borderColor: change >= 0 ? 'rgba(0,210,106,0.2)' : 'rgba(255,77,90,0.2)' }}
                >
                  <h4 className="font-bold text-sm text-white">{sec}</h4>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                    change >= 0 ? 'text-[#00d26a]' : 'text-[#ff4d5a]'
                  }`}>
                    {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {selectedSector && <SectorBottomSheet name={selectedSector} onClose={() => setSelectedSector(null)} />}
      </motion.div>
    </>
  );
                    }
