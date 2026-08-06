'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap } from 'lucide-react';
import Skeleton from './Skeleton';

export default function SectorBottomSheet({ name, onClose }: { name: string; onClose: () => void }) {
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/sector?name=${encodeURIComponent(name)}`)
      .then(r => r.json())
      .then(j => {
        if (j.success) setStocks(j.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [name]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60"
        />
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="absolute bottom-0 left-0 right-0 bg-[#0a0e1a] rounded-t-3xl max-h-[75vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-12 h-1 bg-gray-600 rounded-full" />
          </div>

          <div className="flex justify-between items-center px-4 py-3 border-b border-[#162035]">
            <h3 className="text-lg font-bold text-white glow-text">{name}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 overflow-y-auto max-h-[55vh]">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full mb-2" />)
            ) : stocks.length === 0 ? (
              <p className="text-center text-gray-400 py-8">Belum ada data saham untuk sektor ini</p>
            ) : (
              stocks.map((s: any) => (
                <div key={s.kode} className="flex justify-between items-center py-3 border-b border-[#162035]/50">
                  <div>
                    <span className="font-bold text-white">{s.kode}</span>
                    <span className="text-xs text-gray-400 ml-2">{s.name}</span>
                  </div>
                  <span className={s.change >= 0 ? 'text-[#00d26a]' : 'text-[#ff4d5a]'}>
                    {s.change >= 0 ? '+' : ''}{s.change}%
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-[#162035]">
            <button className="w-full bg-[#00c2ff] text-[#05070d] font-bold py-3 rounded-xl flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" />
              Analisa Sektor dengan AI
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
