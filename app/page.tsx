'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/Card';
import Skeleton from '@/components/Skeleton';
import StockRow from '@/components/StockRow';
import { Bell, Crown, Sparkles } from 'lucide-react';

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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-cyan" />
            Selamat Datang
          </p>
          <h2 className="text-xl font-bold flex items-center gap-2">
            Halo, Trader!
            <Crown className="w-4 h-4 text-yellow" />
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-green/10 text-green px-3 py-1 rounded-full">● Live</span>
          <Bell className="w-4 h-4 text-gray" />
        </div>
      </div>

      {/* IHSG */}
      <Card>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray">IHSG</p>
            {ihsg.loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold">
                  {Number(ihsg.close).toLocaleString()}
                </span>
                <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${isPositive ? 'badge-green' : 'badge-red'}`}>
                  {isPositive ? '+' : ''}{ihsg.changePercent.toFixed(2)}%
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-1">
            {['1D', '1W', '1M', '1Y'].map(tab => (
              <button key={tab} className="text-xs px-2 py-1 bg-[#162035] rounded-full text-gray">
                {tab}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid-cols-3">
        <Card className="text-center p-3">
          <p className="text-xs text-gray">Fear & Greed</p>
          <p className="text-xl font-bold text-cyan">68</p>
          <span className="text-xs text-green">Greedy</span>
        </Card>
        <Card className="text-center p-3">
          <p className="text-xs text-gray">Win Rate</p>
          <p className="text-xl font-bold text-green">84%</p>
          <span className="text-xs text-cyan">High</span>
        </Card>
        <Card className="text-center p-3">
          <p className="text-xs text-gray">Signal</p>
          <p className="text-xl font-bold text-yellow">0</p>
          <span className="text-xs text-yellow">New</span>
        </Card>
      </div>

      {/* Top Pick */}
      <div>
        <h3 className="font-bold mb-2">🔥 Top Pick AI</h3>
        {loading ? (
          <Skeleton className="h-16 w-full" />
        ) : topPicks.length === 0 ? (
          <Card className="text-center py-4 text-gray">Belum ada data</Card>
        ) : (
          topPicks.map((s: any) => (
            <StockRow key={s.kode} stock={s} onClick={() => {}} onToggle={() => {}} />
          ))
        )}
      </div>
    </div>
  );
}
