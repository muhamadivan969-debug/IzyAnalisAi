'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Crown, Settings, LogOut, HelpCircle, RefreshCw, User } from 'lucide-react';
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#05070d]/80 backdrop-blur-lg border-b border-[#162035]">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/">
          <h1 className="text-lg font-bold text-white">
            <span className="text-[#00c2ff]">Izy</span>AnalisaAI
          </h1>
        </Link>

        <div className="flex items-center gap-3">
          <button className="relative p-2 hover:bg-[#0a0e1a] rounded-full transition">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#ff4d5a] rounded-full" />
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00c2ff] to-[#00d26a] flex items-center justify-center text-[#05070d] font-bold text-sm"
            >
              T
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-12 w-64 bg-[#0a0e1a] border border-[#162035] rounded-xl shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-[#162035]">
                  <p className="font-semibold text-white">Trader IzyAnalisaAI</p>
                  <span className="text-xs text-gray-400 bg-[#00c2ff]/10 px-2 py-0.5 rounded-full">Akun Gratis</span>
                </div>

                <div className="py-2">
                  <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-[#162035] flex items-center gap-3 text-yellow-400">
                    <Crown className="w-4 h-4" />
                    Upgrade Premium
                  </button>
                  <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-[#162035] flex items-center gap-3 text-gray-300">
                    <Settings className="w-4 h-4" />
                    Pengaturan
                  </button>
                  <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-[#162035] flex items-center gap-3 text-gray-300">
                    <RefreshCw className="w-4 h-4" />
                    Ganti Akun
                  </button>
                  <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-[#162035] flex items-center gap-3 text-gray-300">
                    <Bell className="w-4 h-4" />
                    Notifikasi
                  </button>
                  <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-[#162035] flex items-center gap-3 text-gray-300">
                    <HelpCircle className="w-4 h-4" />
                    Bantuan & FAQ
                  </button>
                </div>

                <div className="border-t border-[#162035] py-2">
                  <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-[#162035] flex items-center gap-3 text-[#ff4d5a]">
                    <LogOut className="w-4 h-4" />
                    Log Out
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
