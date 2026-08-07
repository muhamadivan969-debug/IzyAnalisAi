'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Zap, Sparkles } from 'lucide-react';
import Card from '@/components/Card';
import Skeleton from '@/components/Skeleton';
import Particles from '@/components/Particles';
import PulseDot from '@/components/PulseDot';

export default function PredictorPage() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetch('/api/predict')
      .then(r => r.json())
      .then(j => {
        if (j.success) setPredictions(j.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredPredictions = filter === 'ALL' 
    ? predictions 
    : predictions.filter(p => p.direction === filter);

  const getIcon = (direction: string) => {
    if (direction === 'BULLISH') return <TrendingUp className="w-4 h-4 text-green" />;
    if (direction === 'BEARISH') return <TrendingDown className="w-4 h-4 text-red" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getBadge = (direction: string) => {
    if (direction === 'BULLISH') return 'bg-green/15 text-green';
    if (direction === 'BEARISH') return 'bg-red/15 text-red';
    return 'bg-gray-500/15 text-gray-400';
  };

  const getRecommendationBadge = (recommendation: string) => {
    if (recommendation === 'BUY') return 'bg-green text-black font-bold';
    if (recommendation === 'SELL') return 'bg-red text-white font-bold';
    return 'bg-gray-500 text-white';
  };

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
            <Zap className="w-5 h-5 text-yellow-400" />
            AI Predictor
          </h2>
          <span className="text-xs bg-green/20 text-green px-3 py-1 rounded-full flex items-center gap-1">
            <PulseDot />
            Live
          </span>
        </div>

        <p className="text-xs text-gray-400">
          Prediksi berdasarkan RSI, MA, dan Volume • Akurasi ~80%
        </p>

        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['ALL', 'BULLISH', 'BEARISH', 'NEUTRAL'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                filter === f 
                  ? 'bg-cyan text-black' 
                  : 'bg-[#162035] text-gray-400 hover:text-white'
              }`}
            >
              {f === 'ALL' ? 'Semua' : f}
            </button>
          ))}
        </div>

        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
        ) : filteredPredictions.length === 0 ? (
          <Card className="text-center py-8 text-gray-400">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-gray-500" />
            Belum ada data prediksi
          </Card>
        ) : (
          filteredPredictions.map((p, i) => (
            <motion.div
              key={p.kode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`card p-4 border-l-4 ${
                p.direction === 'BULLISH' ? 'border-l-green' :
                p.direction === 'BEARISH' ? 'border-l-red' :
                'border-l-gray-500'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{p.kode}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getBadge(p.direction)}`}>
                      {p.direction}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getRecommendationBadge(p.recommendation)}`}>
                      {p.recommendation}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{p.name || ''}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">Rp {p.harga.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Target: Rp {p.target.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Bearish</span>
                  <span className="flex items-center gap-1">
                    {getIcon(p.direction)}
                    <span className={`font-bold ${p.direction === 'BULLISH' ? 'text-green' : p.direction === 'BEARISH' ? 'text-red' : 'text-gray-400'}`}>
                      {p.confidence}%
                    </span>
                  </span>
                  <span>Bullish</span>
                </div>
                <div className="w-full h-2 bg-[#162035] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green transition-all duration-500"
                    style={{ width: `${p.bullish}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
                  <span>{p.bearish}%</span>
                  <span className="text-gray-400">RSI: {p.rsi}</span>
                  <span>{p.bullish}%</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </>
  );
}
