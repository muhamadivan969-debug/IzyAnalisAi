'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Crown, Sparkles, Zap, Flame, TrendingUp } from 'lucide-react';
import Card from '@/components/Card';
import Skeleton from '@/components/Skeleton';
import StockRow from '@/components/StockRow';
import Particles from '@/components/Particles';
import PulseDot from '@/components/PulseDot';

export default function Home() {
  const [ihsg, setIhsg] = useState({ loading: true, close: 0, changePercent: 0 });
  const [topPicks, setTopPicks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      <Particles />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 space-y-4 pb-4"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan" />
              Selamat Datang
            </p>
            <h2 className="text-xl font-bold flex items-center gap-2">
              Halo, Trader!
              <Crown className="w-4 h-4 text-yellow-400" />
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-green/10 text-green px-3 py-1 rounded-full flex items-center gap-1">
              <PulseDot />
              Live
            </span>
            <Bell className="w-4 h-4 text-gray-400" />
          </div>
        </div>

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
                  <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${isPositive ? 'badge-green' : 'badge-red'}`}>
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

        <div className="grid-3">
          <Card className="text-center p-3">
            <p className="text-[10px] text-gray-400">Fear & Greed</p>
            <p className="text-xl font-bold text-cyan">68</p>
            <span className="text-[10px] text-green">Greedy</span>
          </Card>
          <Card className="text-center p-3">
            <p className="text-[10px] text-gray-400">Win Rate</p>
            <p className="text-xl font-bold text-green">84%</p>
            <span className="text-[10px] text-cyan">High</span>
          </Card>
          <Card className="text-center p-3">
            <p className="text-[10px] text-gray-400">Signal</p>
            <p className="text-xl font-bold text-yellow-400">0</p>
            <span className="text-[10px] text-yellow-400">New</span>
          </Card>
        </div>

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
              topPicks.map((s: any) => (
                <StockRow key={s.kode} stock={s} onClick={() => {}} onToggle={() => {}} />
              ))
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green" />
              Top Movers
            </h3>
            <button className="text-xs text-cyan">Lihat Semua</button>
          </div>
          <div className="grid-2 mt-2">
            {['ALKA', 'DWGL', 'MSKY', 'VIVA'].map((kode, i) => (
              <div key={kode} className="card p-3 flex justify-between items-center">
                <span className="font-bold text-sm">{kode}</span>
                <span className="text-xs font-bold text-green">
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
