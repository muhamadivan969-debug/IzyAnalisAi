'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Crown, Settings, LogOut, HelpCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#05070d]/90 backdrop-blur-lg border-b border-[#162035]">
      <div className="max-w-md mx-auto px-3 h-12 flex items-center justify-between">
        <Link href="/">
          <h1 className="text-sm font-bold text-white">
            <span className="text-cyan">Izy</span>AnalisaAI
          </h1>
        </Link>

        <div className="flex items-center gap-2">
          <button className="relative p-1.5 hover:bg-[#0a0e1a] rounded-full transition">
            <Bell className="w-4 h-4 text-gray-400" />
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red rounded-full" />
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan to-green flex items-center justify-center text-[#05070d] font-bold text-[10px]"
            >
              T
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-8 w-56 bg-[#0a0e1a] border border-[#162035] rounded-xl shadow-2xl overflow-hidden">
                <div className="p-3 border-b border-[#162035]">
                  <p className="font-semibold text-white text-sm">Trader IzyAnalisaAI</p>
                  <span className="text-[10px] text-gray-400 bg-cyan/10 px-2 py-0.5 rounded-full">Akun Gratis</span>
                </div>
                <div className="py-1">
                  <button className="w-full px-3 py-2 text-left text-xs hover:bg-[#162035] flex items-center gap-2 text-yellow-400">
                    <Crown className="w-3.5 h-3.5" /> Upgrade Premium
                  </button>
                  <button className="w-full px-3 py-2 text-left text-xs hover:bg-[#162035] flex items-center gap-2 text-gray-300">
                    <Settings className="w-3.5 h-3.5" /> Pengaturan
                  </button>
                  <button className="w-full px-3 py-2 text-left text-xs hover:bg-[#162035] flex items-center gap-2 text-gray-300">
                    <RefreshCw className="w-3.5 h-3.5" /> Ganti Akun
                  </button>
                  <button className="w-full px-3 py-2 text-left text-xs hover:bg-[#162035] flex items-center gap-2 text-gray-300">
                    <Bell className="w-3.5 h-3.5" /> Notifikasi
                  </button>
                  <button className="w-full px-3 py-2 text-left text-xs hover:bg-[#162035] flex items-center gap-2 text-gray-300">
                    <HelpCircle className="w-3.5 h-3.5" /> Bantuan & FAQ
                  </button>
                </div>
                <div className="border-t border-[#162035] py-1">
                  <button className="w-full px-3 py-2 text-left text-xs hover:bg-[#162035] flex items-center gap-2 text-red">
                    <LogOut className="w-3.5 h-3.5" /> Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
