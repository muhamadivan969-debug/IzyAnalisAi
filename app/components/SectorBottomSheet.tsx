'use client';

import { Star } from 'lucide-react';

export default function StockRow({ stock, onClick, onToggle }: any) {
  const isPositive = stock.changePercent >= 0;

  return (
    <div
      onClick={onClick}
      className="card p-4 flex justify-between items-center cursor-pointer hover:border-[#00c2ff]/30 transition"
    >
      <div>
        <h4 className="font-bold group-hover:text-[#00c2ff] transition text-sm">
          {stock.kode}
        </h4>
        <p className="text-[10px] text-gray-400">{stock.name || ''}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs font-bold">
            Rp {Number(stock.close || 0).toLocaleString()}
          </p>
          <span className={`text-[10px] font-bold ${isPositive ? 'text-[#00d26a]' : 'text-[#ff4d5a]'}`}>
            {isPositive ? '+' : ''}{stock.changePercent?.toFixed(2) || 0}%
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className="text-gray-500 hover:text-yellow-400 transition"
        >
          <Star className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
