'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Star, X } from 'lucide-react';
import Particles from '@/components/Particles';
import Card from '@/components/Card';

export default function WatchlistPage() {
  const router = useRouter();
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    try {
      const cur = JSON.parse(localStorage.getItem('watchlist') || '[]');
      setList(cur);
    } catch (e) { setList([]); }
  }, []);

  const removeFromWatchlist = (code: string) => {
    const next = list.filter(x => x !== code);
    localStorage.setItem('watchlist', JSON.stringify(next));
    setList(next);
  };

  return (
    <>
      <Particles />
      <div className="relative z-10 space-y-4 pb-6">
        <h2 className="text-xl font-bold text-white glow-text flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          Watchlist Favorit
        </h2>

        {list.length === 0 ? (
          <Card><p className="text-center text-gray-400 py-8">Belum ada saham yang ditambahkan ke watchlist</p></Card>
        ) : (
          list.map((code, idx) => (
            <motion.div
              key={code}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => router.push(`/stock/${code}`)}
              className="glass-card p-4 flex justify-between items-center cursor-pointer hover:border-[#00c2ff]/30 transition"
            >
              <h4 className="font-bold text-white">{code}</h4>
              <button
                onClick={(e) => { e.stopPropagation(); removeFromWatchlist(code); }}
                className="text-gray-500 hover:text-[#ff4d5a] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </>
  );
}
