'use client';

import { useEffect, useRef } from 'react';

export default function Particles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const count = 30;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = 15 + Math.random() * 20 + 's';
      particle.style.animationDelay = Math.random() * 20 + 's';
      particle.style.width = (1 + Math.random() * 2) + 'px';
      particle.style.height = particle.style.width;
      particle.style.background = `rgba(0, 194, 255, ${0.1 + Math.random() * 0.3})`;
      container.appendChild(particle);
    }

    return () => {
      container.innerHTML = '';
    };
  }, []);

  return <div ref={containerRef} className="particles" />;
}
