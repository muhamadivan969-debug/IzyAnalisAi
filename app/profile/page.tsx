'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Crown, Settings, Bookmark, Bell, HelpCircle, LogOut, Star } from 'lucide-react';
import Particles from '@/components/Particles';
import Card from '@/components/Card';
import { showToast } from '@/components/Toast';

export default function ProfilePage() {
  const router = useRouter();

  const menuItems = [
    { icon: Crown, label: 'Upgrade Premium', color: 'text-yellow-400', badge: 'NEW' },
    { icon: Bookmark, label: 'Watchlist' },
    { icon: Bell, label: 'Notifikasi', badge: '3' },
    { icon: Settings, label: 'Pengaturan' },
    { icon: HelpCircle, label: 'Bantuan & FAQ' },
  ];

  const handleLogout = () => {
    showToast('Berhasil logout', 'success');
    router.push('/');
  };

  return (
    <>
      <Particles />
      <div className="relative z-10 space-y-4 pb-6">
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00c2ff] to-[#00d26a] flex items-center justify-center text-2xl font-bold text-[#05070d]">
            T
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white glow-text">Trader IzyAnalisaAI</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">trader@izyanalisa.ai</span>
              <span className="text-xs bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3" />
                Gold
              </span>
            </div>
            <p className="text-xs text-gray-500">Bergabung sejak 2024</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Card className="text-center p-3">
            <p className="text-[10px] text-gray-400">Saham</p>
            <p className="text-sm font-bold text-white">12</p>
          </Card>
          <Card className="text-center p-3">
            <p className="text-[10px] text-gray-400">Sinyal</p>
            <p className="text-sm font-bold text-[#00c2ff]">7</p>
          </Card>
          <Card className="text-center p-3">
            <p className="text-[10px] text-gray-400">Analisis</p>
            <p className="text-sm font-bold text-[#00d26a]">24</p>
          </Card>
        </div>

        <div className="glass-card overflow-hidden">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#162035] transition border-b border-[#162035] last:border-0"
            >
              <item.icon className={`w-5 h-5 ${item.color || 'text-gray-400'}`} />
              <span className="flex-1 text-left text-sm text-white">{item.label}</span>
              {item.badge && (
                <span className="text-xs bg-[#00c2ff]/20 text-[#00c2ff] px-2 py-0.5 rounded-full">{item.badge}</span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-[#ff4d5a]/10 text-[#ff4d5a] py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#ff4d5a]/20 transition"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>

        <p className="text-center text-xs text-gray-500">IzyAnalisaAI v2.0 • 2026</p>
      </div>
    </>
  );
}
