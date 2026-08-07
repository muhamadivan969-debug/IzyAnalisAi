'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Card from '@/components/Card';
import Skeleton from '@/components/Skeleton';
import Particles from '@/components/Particles';

export default function ScreenerPage() {
  const router = useRouter();
  const [stocks, setStocks] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('/api/saham')
      .then(r => r.json())
      .then(j => {
        if (j.success) {
          setStocks(j.data);
          setFiltered(j.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const result = stocks.filter(s =>
      s.kode.toLowerCase().includes(query.toLowerCase()) ||
      s.name?.toLowerCase().includes(query.toLowerCase())
    );
    setFiltered(result);
  }, [query, stocks]);

  return (
    <>
      <Particles />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 space-y-4 pb-4"
      >
        <h2 className="text-xl font-bold">Screener Saham</h2>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari kode/nama saham..."
            className="w-full bg-[#0a0e1a] border border-[#162035] rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-[#00c2ff] outline-none"
          />
        </div>

        <p className="text-xs text-gray-400">{filtered.length} saham ditemukan</p>

        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)
        ) : filtered.length === 0 ? (
          <Card className="text-center py-8 text-gray-400">🔍 Saham tidak ditemukan</Card>
        ) : (
          filtered.map((s: any, i) => (
            <motion.div
              key={s.kode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              onClick={() => router.push(`/stock/${s.kode}`)}
              className="card p-4 flex justify-between items-center cursor-pointer hover:border-[#00c2ff]/30 transition"
            >
              <div>
                <h4 className="font-bold">{s.kode}</h4>
                <p className="text-xs text-gray-400">{s.name || '-'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">Rp {Number(s.close || 0).toLocaleString()}</p>
                <span className={`text-xs font-bold ${s.changePercent >= 0 ? 'text-[#00d26a]' : 'text-[#ff4d5a]'}`}>
                  {s.changePercent >= 0 ? '+' : ''}{s.changePercent?.toFixed(2) || 0}%
                </span>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </>
  );
}
