'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap } from 'lucide-react';
import Card from '@/components/Card';
import Skeleton from '@/components/Skeleton';
import Particles from '@/components/Particles';
import PulseDot from '@/components/PulseDot';

export default function SignalPage() {
  const [signals, setSignals] = useState<any[]>([]);
  const [allSignals, setAllSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    fetch('/api/signal')
      .then(r => r.json())
      .then(j => {
        if (j.success) {
          setSignals(j.data.signals);
          setAllSignals(j.data.all);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Particles />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 space-y-4 pb-4"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#00c2ff]" />
            Live Signal
          </h2>
          <span className="text-xs bg-[#ff4d5a]/20 text-[#ff4d5a] px-3 py-1 rounded-full flex items-center gap-1">
            <PulseDot />
            LIVE
          </span>
        </div>

        <p className="text-xs text-gray-400">
          {signals.length} sinyal baru • {allSignals.length} saham dipantau
        </p>

        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
        ) : signals.length === 0 ? (
          <Card className="text-center py-8 text-gray-400">
            <Zap className="w-8 h-8 mx-auto mb-2 text-gray-500" />
            Belum ada sinyal baru
          </Card>
        ) : (
          signals.map((s, i) => (
            <motion.div
              key={s.kode}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card p-4 flex justify-between items-center border-[#00c2ff]/30"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{s.kode}</span>
                  <span className="badge-cyan text-[10px]">NEW SIGNAL</span>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(s.timestamp).toLocaleTimeString()} • {s.volumeRatio.toFixed(1)}x VOL
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{s.harga}</p>
                <span className={`text-xs font-bold ${s.change >= 0 ? 'text-[#00d26a]' : 'text-[#ff4d5a]'}`}>
                  {s.change >= 0 ? '+' : ''}{s.change.toFixed(2)}%
                </span>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </>
  );
}
