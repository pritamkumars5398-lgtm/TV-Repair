"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Quote, ArrowLeft, Tv, ShieldCheck, Sparkles } from 'lucide-react';
import sahilImg from '../../../assets/images/sahil.jpeg';

export default function StoryPage() {
  return (
    <div className="bg-slate-50 font-sans min-h-screen pt-12 sm:pt-14 pb-8 relative overflow-hidden">
      {/* Background Soft Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-rose-50/60 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 z-10">

        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/90 text-xs font-bold text-slate-700 hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50/60 transition-all duration-300 active:scale-95 group mb-3 backdrop-blur-md"
        >
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 group-hover:bg-primary-100 transition-colors">
            <ArrowLeft className="h-3 w-3 text-slate-600 group-hover:text-primary-600 transition-transform duration-300 group-hover:-translate-x-0.5" />
          </div>
          <span>Back to Home</span>
        </Link>

        {/* Tribute Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-extrabold text-rose-600 mb-2 backdrop-blur-sm">
            <Heart className="w-3 h-3 fill-rose-500 text-rose-500 animate-pulse" />
            <span>Dedicated to a Dear Friend</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight mb-2">
            The Story Behind <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-650 to-rose-500">RepairCart</span>
          </h1>

          <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-rose-500 mx-auto rounded-full" />
        </div>

        {/* Narrative Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 backdrop-blur-md relative">

          {/* Top Quote Icon Badge */}
          <div className="mb-3 inline-flex p-2.5 rounded-xl bg-blue-600 text-white items-center justify-center">
            <Quote className="h-4 w-4 fill-white" />
          </div>

          <div className="grid md:grid-cols-[1.25fr_0.75fr] gap-4 md:gap-6 items-start">
            <div className="space-y-3 text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
              <p>
                RepairCart was built with a simple vision—to provide honest, reliable, and professional TV repair services across India.
              </p>

              <div className="border-l-4 border-rose-400 pl-3 my-2 py-1.5 bg-rose-50/30 rounded-r-xl">
                <p className="font-semibold text-slate-800 italic text-xs sm:text-sm">
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
            <div className="flex flex-col items-center space-y-2 shrink-0">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 max-w-[180px] group">
                <Image
                  src={sahilImg}
                  alt="Late Mr. Sahil Sachdeva"
                  className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                  placeholder="blur"
                />
              </div>
              <div className="text-center">
                <p className="text-xs sm:text-sm font-extrabold text-slate-900">Late Mr. Sahil Sachdeva</p>
                <p className="text-[10px] text-slate-500 font-bold tracking-wide">1996 – 2024</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100 my-4" />

          {/* Author/Founder Info */}
          <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">With Gratitude</p>
              <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">— Imran Khan</h4>
              <p className="text-xs text-blue-600 font-bold">Founder, RepairCart</p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/70 text-xs text-slate-600 font-semibold">
              <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>In Loving Memory of Sahil</span>
            </div>
          </div>

        </div>

        {/* Support Section */}
        <div className="mt-6 text-center text-[11px] text-slate-400">
          <p className="flex items-center justify-center gap-1">
            <Tv className="w-3 h-3 text-primary-500" />
            <span>RepairCart TV Repair Services India</span>
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
          </p>
        </div>

      </div>
    </div>
  );
}
