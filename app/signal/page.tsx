'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Particles from '@/components/Particles';
import Card from '@/components/Card';
import Skeleton from '@/components/Skeleton';

export default function SignalPage() {
  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch('/api/saham')
      .then(r => r.json())
      .then(j => {
        if (j.success) {
          const data = j.data.slice(0, 10).map((s: any) => ({
            ...s,
            signal: ['BUY', 'SELL', 'HOLD'][Math.floor(Math.random() * 3)],
            confidence: 60 + Math.floor(Math.random() * 35),
          }));
          setSignals(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredSignals = filter === 'All' ? signals : signals.filter(s => s.signal === filter);
  const getSignalColor = (signal: string) => {
    if (signal === 'BUY') return 'text-[#00d26a] bg-[#00d26a]/15';
    if (signal === 'SELL') return 'text-[#ff4d5a] bg-[#ff4d5a]/15';
    return 'text-yellow-400 bg-yellow-400/15';
  };

  return (
    <>
      <Particles />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pb-6 relative z-10">
        <h2 className="text-xl font-bold text-white glow-text">Sinyal Saham</h2>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {['All', 'BUY', 'SELL', 'HOLD'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                filter === f ? 'bg-[#00c2ff] text-[#05070d]' : 'bg-[#162035] text-gray-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
        ) : filteredSignals.length === 0 ? (
          <Card><p className="text-center text-gray-400 py-8">Tidak ada sinyal</p></Card>
        ) : (
          filteredSignals.map((s: any) => (
            <motion.div
              key={s.kode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4 flex justify-between items-center"
            >
              <div>
                <h4 className="font-bold text-white">{s.kode}</h4>
                <p className="text-xs text-gray-400">{s.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getSignalColor(s.signal)}`}>
                  {s.signal}
                </span>
                <span className="text-sm text-gray-400">{s.confidence}%</span>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </>
  );
}
