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

    // Slightly slower progress rate for a premium feel
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Increment by a small random step so it takes around 3-4 seconds to load
        return prev + Math.floor(Math.random() * 3) + 1;
      });
    }, 85);

    // Total display duration before fade out
    const fadeTimer = setTimeout(() => {
      setPercent(100);
      setFading(true);

      const removeTimer = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem('hasSeenPreloader', 'true');
      }, 700);

      return () => clearTimeout(removeTimer);
    }, 4500);

    return () => {
      clearTimeout(fadeTimer);
      clearInterval(interval);
    };
  }, []);

  if (!loading) return null;

  // Circle stroke offset math: circumference of radius 48 is ~301.59
  const radius = 48;
  const strokeDash = 2 * Math.PI * radius;
  const strokeOffset = strokeDash - (strokeDash * Math.min(percent, 100)) / 100;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-all duration-700 ease-in-out ${fading ? 'opacity-0 scale-98 pointer-events-none' : 'opacity-100 scale-100'
        }`}
    >
      <div className="relative flex flex-col items-center z-10 w-full max-w-sm px-8">

        {/* Dynamic circular neon SVG progress loader */}
        <div className="relative flex items-center justify-center w-36 h-36 mb-8 select-none">

          {/* Tech decorative rotating dashes in website blue/slate */}
          <div className="absolute inset-0 rounded-full border border-dashed border-blue-200/50 animate-[spin_12s_linear_infinite]" />
          <div className="absolute inset-2.5 rounded-full border border-dashed border-primary-200/30 animate-[spin_18s_linear_infinite_reverse]" />

          {/* SVG Progress Ring */}
          <svg className="w-full h-full -rotate-90 absolute z-10" viewBox="0 0 110 110">
            {/* Base track */}
            <circle
              cx="55"
              cy="55"
              r={radius}
              className="stroke-slate-100 fill-none"
              strokeWidth="2.5"
            />
            {/* Glowing sweep progress in website blue */}
            <circle
              cx="55"
              cy="55"
              r={radius}
              className="stroke-primary-600 fill-none transition-all duration-150 ease-out"
              strokeWidth="3.5"
              strokeDasharray={strokeDash}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              style={{
                filter: 'drop-shadow(0 0 6px rgba(37, 99, 235, 0.25))',
              }}
            />
          </svg>

          {/* Logo center container */}
          <div className="w-20 h-20 rounded-full bg-white border border-slate-150 flex items-center justify-center z-20 shadow-md">
            <Image
              src="/logo.png"
              alt="RC RepairCart Logo"
              width={54}
              height={54}
              className="object-contain animate-[pulse_2s_infinite]"
              priority
            />
          </div>
        </div>

        {/* Brand Text */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-black tracking-widest text-slate-800 leading-tight uppercase font-display">
            <span>RC Repair</span>
            <span className="text-blue-800">Cart</span>
          </h1>
          <p className="text-[9px] text-slate-400 font-extrabold tracking-[0.3em] uppercase mt-2">
            Electronics & Manufacturing
          </p>
        </div>

        {/* Counter Display */}
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-mono font-bold text-primary-600 bg-primary-50 border border-primary-100/50 px-3.5 py-1 rounded-full shadow-sm tracking-wider">
            {Math.min(percent, 100)}%
          </span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-2.5 animate-pulse">
            System Initializing
          </span>
        </div>

      </div>
    </div>
  );
}
