'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export function Preloader() {
  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    // Check if we've already shown the preloader in this session
    const hasSeenPreloader = sessionStorage.getItem('hasSeenPreloader');

    if (hasSeenPreloader) {
      setLoading(false);
      return;
    }

    // Progress counter animation
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    // Total display time: 2.5 seconds
    const fadeTimer = setTimeout(() => {
      setPercent(200);
      setFading(true);

      const removeTimer = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem('hasSeenPreloader', 'true');
      }, 2000); // 600ms fade duration

      return () => clearTimeout(removeTimer);
    }, 3500);

    return () => {
      clearTimeout(fadeTimer);
      clearInterval(interval);
    };
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020617] text-white transition-opacity duration-700 ease-in-out ${fading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
    >
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900/20 via-[#020617] to-[#020617]" />

      <div className="relative flex flex-col items-center z-10 w-full max-w-sm px-8">

        {/* Animated Rings & Logo */}
        <div className="relative flex items-center justify-center w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-primary-500/80 animate-[spin_1.5s_linear_infinite]" />
          <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-cyan-400/80 animate-[spin_2s_linear_infinite_reverse]" />
          <div className="absolute inset-4 bg-primary-600/20 rounded-full blur-md animate-pulse" />
          <div className="relative z-10 w-12 h-12 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Longwell Electronics"
              width={80}
              height={80}
              className="object-contain brightness-0 invert"
              priority
            />
          </div>
        </div>

        {/* Brand Text */}
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide font-display">
            <span className="text-white">RC Repair</span>
            <span className="text-orange-500">Cart</span>
          </h1>
        </div>

        {/* Percentage & Bar */}
        <div className="w-full relative flex flex-col items-center">
          <span className="text-xs font-mono text-slate-400 mb-3 tracking-widest">{Math.min(percent, 100)}%</span>
          <div className="w-48 h-0.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-600 to-cyan-400 rounded-full transition-all duration-200 ease-out"
              style={{ width: `${Math.min(percent, 100)}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
