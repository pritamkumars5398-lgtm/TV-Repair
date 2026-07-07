'use client';

import { useState } from 'react';
import { Calculator, ChevronRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const TV_SIZES = [
  { label: '32-inch LED/Smart TV', value: '32' },
  { label: '43-inch 4K UHD TV', value: '43' },
  { label: '55-inch Premium QLED TV', value: '55' },
  { label: '65-inch+ Curved/OLED TV', value: '65' },
];

const ISSUES = [
  { label: 'Screen Lines / Double Image (Panel Bonding)', value: 'bonding', basePrice: 1499 },
  { label: 'No Power / Restarting Loop (Motherboard)', value: 'motherboard', basePrice: 799 },
  { label: 'Sound OK but Dark Screen (Backlight Strip)', value: 'backlight', basePrice: 599 },
  { label: 'HDMI Ports Not Working / Loose', value: 'ports', basePrice: 299 },
  { label: 'Distorted Sound / No Audio', value: 'audio', basePrice: 499 },
];

export function PriceEstimator() {
  const [size, setSize] = useState('43');
  const [issue, setIssue] = useState('bonding');

  const selectedIssue = ISSUES.find((i) => i.value === issue);
  const basePrice = selectedIssue ? selectedIssue.basePrice : 0;
  
  // Calculate size factor
  let multiplier = 1;
  if (size === '32') multiplier = 0.8;
  if (size === '55') multiplier = 1.4;
  if (size === '65') multiplier = 1.9;

  const estimatedPrice = Math.round(basePrice * multiplier);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        
        {/* Selector Panel */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 text-primary-600">
            <Calculator className="h-5 w-5" />
            <h3 className="text-base font-extrabold text-slate-900">Repair Cost Estimator</h3>
          </div>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Get an instant estimated quote based on your screen size and TV issue. Select the options to live update the calculations.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Select TV Size</label>
              <div className="grid grid-cols-2 gap-2">
                {TV_SIZES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => { setSize(t.value); }}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                      size === t.value
                        ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Select TV Issue</label>
              <select
                value={issue}
                onChange={(e) => { setIssue(e.target.value); }}
                className="w-full border border-slate-200 rounded-xl px-3 py-3 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                {ISSUES.map((i) => (
                  <option key={i.value} value={i.value}>
                    {i.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center space-y-4 flex flex-col justify-center min-h-[220px]">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Estimated Cost</p>
            <h4 className="text-3xl sm:text-4xl font-black text-slate-900">
              ₹{estimatedPrice}
              <span className="text-xs text-slate-400 font-semibold ml-1">*</span>
            </h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">Starting price for selected service.</p>
          </div>

          <div className="space-y-1.5 text-left max-w-xs mx-auto text-[11px] text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>Includes 30-Day service warranty</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>Excludes cost of spare parts if required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>₹250 doorstep diagnostics charge extra</span>
            </div>
          </div>

          <Link
            href={`/book?size=${size}&issue=${issue}`}
            className="w-full py-3 bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-[0.98] inline-flex items-center justify-center gap-1"
          >
            Book Diagnostics Service <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
