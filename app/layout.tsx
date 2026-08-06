import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import Toast from '@/components/Toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'IzyAnalisaAI',
  description: 'Analisa Saham Indonesia dengan AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Header />
        <main className="pb-20 pt-16 px-4 max-w-md mx-auto relative z-10">
          {children}
        </main>
        <BottomNav />
        <Toast />
      </body>
    </html>
  );
}
