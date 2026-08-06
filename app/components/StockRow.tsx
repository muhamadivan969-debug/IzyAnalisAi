'use client';

import { Star } from 'lucide-react';

export default function StockRow({ stock, onClick, onToggle }: any) {
  const isPositive = stock.changePercent >= 0;

  return (
    <div
      onClick={onClick}
      className="glass-card p-4 flex justify-between items-center cursor-pointer group hover:border-[#00c2ff]/30 transition"
    >
      <div>
        <h4 className="font-bold text-white group-hover:text-[#00c2ff] transition">{stock.kode}</h4>
        <p className="text-xs text-gray-400">{stock.name || ''}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className={`text-sm font-bold ${isPositive ? 'text-[#00d26a]' : 'text-[#ff4d5a]'}`}>
          {isPositive ? '+' : ''}{stock.changePercent?.toFixed(2) || 0}%
        </span>
        {stock.spark && (
          <div className="w-16 h-8 flex items-end gap-0.5">
            {stock.spark.slice(-20).map((v: number, i: number) => (
              <div
                key={i}
                className="w-1 rounded-t transition-all duration-300"
                style={{
                  height: `${Math.max(20, 30 + v * 10)}%`,
                  background: isPositive ? '#00d26a' : '#ff4d5a',
                  opacity: 0.5 + (i / 20) * 0.5,
                }}
              />
            ))}
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className="text-gray-500 hover:text-yellow-400 transition"
        >
          <Star className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
