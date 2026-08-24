"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { Star, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Testimonial {
  name: string;
  rating: number;
  text: string;
  service: string;
}

interface TestimonialsSliderProps {
  testimonials: Testimonial[];
}

export function TestimonialsSlider({ testimonials }: TestimonialsSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Scroll to specific index
  const scrollToIndex = useCallback((index: number) => {
    const container = scrollRef.current;
    if (!container) return;

    const cards = container.children;
    if (cards.length > index && cards[index]) {
      const targetCard = cards[index] as HTMLElement;
      container.scrollTo({
        left: targetCard.offsetLeft - container.offsetLeft,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  }, []);

  const handleNext = useCallback(() => {
    const nextIdx = (activeIndex + 1) % testimonials.length;
    scrollToIndex(nextIdx);
  }, [activeIndex, testimonials.length, scrollToIndex]);

  const handlePrev = useCallback(() => {
    const prevIdx = (activeIndex - 1 + testimonials.length) % testimonials.length;
    scrollToIndex(prevIdx);
  }, [activeIndex, testimonials.length, scrollToIndex]);

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, 3500);

    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  // Update active index on manual scroll
  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollPos = container.scrollLeft;
    const cardWidth = container.children[0]?.clientWidth || container.clientWidth || 300;
    const newIdx = Math.round(scrollPos / cardWidth);
    if (newIdx >= 0 && newIdx < testimonials.length && newIdx !== activeIndex) {
      setActiveIndex(newIdx);
    }
  };

  return (
    <div 
      className="relative group w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Top Header */}
      <div className="mb-6 text-center max-w-xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1.5">What partners say</h2>
        <p className="text-slate-500 text-sm font-medium">Trusted by leading brands across the industry.</p>
      </div>

      {/* Main Slider Area with Floating Left and Right Arrows */}
      <div className="relative w-full">
        {/* Left Arrow Button (On Far Left Edge) */}
        <button
          onClick={handlePrev}
          aria-label="Previous Testimonial"
          className="absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-slate-700 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all active:scale-95 flex items-center justify-center"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* Right Arrow Button (On Far Right Edge) */}
        <button
          onClick={handleNext}
          aria-label="Next Testimonial"
          className="absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-slate-700 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all active:scale-95 flex items-center justify-center"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* Full-Width Slider Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-none gap-4 md:gap-6 pb-2 md:pb-0 w-full md:grid-cols-2 lg:grid-cols-3 transition-all"
        >
          {testimonials.map((t, index) => (
            <div
              key={t.name + index}
              className="w-full md:w-auto shrink-0 md:shrink snap-center p-6 sm:p-7 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-medium">"{t.text}"</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-200/80 mt-auto">
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">{t.name}</p>
                  <p className="text-[10px] sm:text-[11px] text-primary-600 font-bold uppercase tracking-wider mt-0.5">{t.service}</p>
                </div>
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots Indicator */}
      <div className="flex justify-center items-center gap-1.5 mt-5">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeIndex === idx
                ? 'w-6 bg-primary-600'
                : 'w-2 bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
