'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

export default function Toast() {
  const [toasts, setToasts] = useState<{ id: number; message: string; type: ToastType }[]>([]);

  useEffect(() => {
    const handleToast = (e: CustomEvent) => {
      const { message, type = 'info' } = e.detail;
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 3000);
    };

    window.addEventListener('toast' as any, handleToast);
    return () => window.removeEventListener('toast' as any, handleToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 left-0 right-0 z-50 px-4 max-w-md mx-auto space-y-2">
      <AnimatePresence>
        {toasts.map(({ id, message, type }) => {
          const icons = {
            success: <CheckCircle className="w-5 h-5 text-[#00d26a]" />,
            error: <XCircle className="w-5 h-5 text-[#ff4d5a]" />,
            info: <Info className="w-5 h-5 text-[#00c2ff]" />,
          };
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-4 flex items-center gap-3 shadow-2xl"
            >
              {icons[type]}
              <p className="text-sm text-white flex-1">{message}</p>
              <button
                onClick={() => setToasts(prev => prev.filter(t => t.id !== id))}
                className="text-gray-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  window.dispatchEvent(new CustomEvent('toast', { detail: { message, type } }));
};
