'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Zap, Bookmark, User } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Search, label: 'Screener', href: '/screener' },
  { icon: Zap, label: 'Signal', href: '/signal' },
  { icon: Bookmark, label: 'Watchlist', href: '/watchlist' },
  { icon: User, label: 'Profil', href: '/profile' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#05070d]/90 backdrop-blur-lg border-t border-[#162035]">
      <div className="max-w-md mx-auto flex justify-around items-center h-14">
        {navItems.map(({ icon: Icon, label, href }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 transition ${
                isActive ? 'text-cyan' : 'text-gray-500'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan' : 'text-gray-500'}`} />
              <span className={`text-[9px] ${isActive ? 'text-cyan' : 'text-gray-500'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
