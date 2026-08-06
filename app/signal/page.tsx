'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from 'lucide-react';
import Particles from '@/components/Particles';
import Card from '@/components/Card';
import Skeleton from '@/components/Skeleton';

export default function SignalPage() {
  const [signals, setSignals] = useState<any[]>([]);
  const [allSignals, setAllSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Particles />
      <div className="relative z-10 space-y-4 pb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white glow-text flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#00c2ff]" />
            Live Signal
          </h2>
          <span className="text-xs bg-[#ff4d5a]/20 text-[#ff4d5a] px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
            <span className="w-1.5 h-1.5 bg-[#ff4d5a] rounded-full" />
            LIVE
          </span>
        </div>

        <p className="text-xs text-gray-400">
          {signals.length} sinyal baru • {allSignals.length} saham dipantau
        </p>

        <AnimatePresence>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
          ) : signals.length === 0 ? (
            <Card>
              <p className="text-center text-gray-400 py-8">Belum ada sinyal baru</p>
            </Card>
          ) : (
            signals.map((s, i) => (
              <motion.div
                key={s.kode + s.timestamp}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-4 flex justify-between items-center border-[#00c2ff]/30"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{s.kode}</span>
                    <span className="badge-signal">NEW SIGNAL</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(s.timestamp).toLocaleTimeString()} • {s.volumeRatio.toFixed(1)}x VOL
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">{s.harga}</p>
                  <span className={`text-xs font-bold ${s.change >= 0 ? 'text-[#00d26a]' : 'text-[#ff4d5a]'}`}>
                    {s.change >= 0 ? '+' : ''}{s.change.toFixed(2)}%
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
