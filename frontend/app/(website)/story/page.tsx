"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Quote, ArrowLeft, Tv, ShieldCheck, Sparkles } from 'lucide-react';
import sahilImg from '../../../assets/images/sahil.jpeg';

export default function StoryPage() {
  return (
    <div className="bg-slate-50 font-sans min-h-screen pt-28 pb-20 relative overflow-hidden">
      {/* Background Soft Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-rose-50/60 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative mx-auto max-w-3xl px-6 z-10">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-primary-600 transition-colors mb-10 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        {/* Tribute Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-150 bg-rose-50/60 px-4 py-2 text-xs font-extrabold text-rose-600 shadow-sm mb-6 backdrop-blur-sm">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
            <span>Dedicated to a Dear Friend</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none mb-6">
            The Story Behind <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-650 to-rose-500">RepairCart</span>
          </h1>
          
          <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-rose-500 mx-auto rounded-full" />
        </div>

        {/* Narrative Card */}
        <div className="bg-white/80 border border-slate-100 rounded-3xl p-8 sm:p-12 shadow-xl shadow-slate-100/50 backdrop-blur-md relative">
          
          {/* Top Corner Quote Deco */}
          <div className="absolute -top-5 -left-5 w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
            <Quote className="h-5 w-5 fill-white" />
          </div>

          <div className="grid md:grid-cols-[1.25fr_0.75fr] gap-8 md:gap-12 items-start">
            <div className="space-y-6 text-slate-755 text-base sm:text-lg leading-relaxed font-medium">
              <p>
                RepairCart was built with a simple vision—to provide honest, reliable, and professional TV repair services across India.
              </p>

              <div className="border-l-4 border-rose-450 pl-6 my-6 py-2 bg-rose-50/20 rounded-r-2xl">
                <p className="font-semibold text-slate-800 italic">
                  "The name <span className="text-primary-700 font-bold">RepairCart</span> was suggested by my closest friend, Late Mr. Sahil Sachdeva, shortly before his passing."
                </p>
              </div>

              <p>
                Sahil was more than a friend. He believed in people, encouraged ideas, and was always ready to help others. His belief in this dream gave us the confidence to build RepairCart.
              </p>

              <p>
                Today, every milestone we achieve carries a small part of his encouragement.
              </p>

              <p className="text-slate-700">
                This name stands as a tribute to his friendship, kindness, and the positive impact he had on our lives.
              </p>
            </div>

            {/* Profile Image Column */}
            <div className="flex flex-col items-center space-y-4 md:mt-2 shrink-0">
              <div className="overflow-hidden rounded-2xl border-4 border-white bg-slate-50 shadow-md max-w-[220px] group">
                <Image
                  src={sahilImg}
                  alt="Late Mr. Sahil Sachdeva"
                  className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                  placeholder="blur"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-extrabold text-slate-850">Late Mr. Sahil Sachdeva</p>
                <p className="text-[10px] text-slate-455 font-bold tracking-wide mt-0.5">1996 – 2024</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100 my-8" />

          {/* Author/Founder Info */}
          <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
            <div>
              <p className="text-sm text-slate-400 font-semibold uppercase tracking-wider">With Gratitude</p>
              <h4 className="text-lg font-extrabold text-slate-905 mt-1">— Imran Khan</h4>
              <p className="text-xs text-indigo-600 font-bold">Founder, RepairCart</p>
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-450 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>In Loving Memory of Sahil</span>
            </div>
          </div>

        </div>

        {/* Support Section */}
        <div className="mt-16 text-center text-xs text-slate-400">
          <p className="flex items-center justify-center gap-1">
            <Tv className="w-3.5 h-3.5 text-primary-500" />
            <span>RepairCart TV Repair Services India</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          </p>
        </div>

      </div>
    </div>
  );
}
