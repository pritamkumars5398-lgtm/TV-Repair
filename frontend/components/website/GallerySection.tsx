'use client';

import React, { useState } from 'react';
import { APP_IMAGES } from '@/lib/constants/images';
import { SafeImage } from '@/components/ui/SafeImage';
import { Eye, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

type CategoryKey = 'ALL' | 'BONDING' | 'ASSEMBLY' | 'QC' | 'SPEAKER' | 'BUILDING';

const CATEGORY_LABELS: Record<CategoryKey, string> = {
  ALL: 'All Real Photos',
  BONDING: 'Laser COF Bonding',
  ASSEMBLY: 'Cleanroom Panel Assembly',
  QC: 'Quality Control & Testing',
  SPEAKER: 'Speaker Manufacturing',
  BUILDING: 'Facility & Workshop',
};

export function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('ALL');
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  // Flatten images with category metadata
  const allImages = Object.entries(APP_IMAGES.galleryCategories).flatMap(([category, paths]) =>
    paths.map((path) => ({
      category: category as CategoryKey,
      src: path,
      alt: `${CATEGORY_LABELS[category as CategoryKey]} - Real Work Photo`,
    }))
  );

  const filteredImages =
    selectedCategory === 'ALL'
      ? allImages
      : allImages.filter((img) => img.category === selectedCategory);

  const handlePrev = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((prev) => (prev === 0 ? filteredImages.length - 1 : (prev ?? 0) - 1));
  };

  const handleNext = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((prev) => (prev === filteredImages.length - 1 ? 0 : (prev ?? 0) + 1));
  };

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 text-xs font-semibold text-primary-400 mb-4 backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            <span>100% Real Lab & Workshop Photos</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
            Our Machinery & Production Facility
          </h2>
          <p className="text-slate-400 text-base md:text-lg">
            Explore our state-of-the-art COF bonding machines, Class 100K cleanroom assembly, screen testing lab, and speaker production line.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-12">
          {(Object.keys(CATEGORY_LABELS) as CategoryKey[]).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setActiveImageIndex(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-primary-600 text-white scale-105'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-slate-700/50'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredImages.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-800 cursor-pointer border border-slate-700/60 shadow-lg hover:shadow-2xl hover:border-primary-500/50 transition-all duration-300"
            >
              <SafeImage
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-primary-400 mb-1">
                  {CATEGORY_LABELS[img.category]}
                </span>
                <p className="text-xs font-medium text-slate-200 line-clamp-1 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-primary-400" /> Click to enlarge
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activeImageIndex !== null && filteredImages[activeImageIndex] && (
          <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveImageIndex(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors z-50 border border-slate-700"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Nav */}
            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-8 p-3 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors z-50 border border-slate-700"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Image Container */}
            <div className="relative max-w-5xl max-h-[80vh] w-full h-full flex flex-col items-center justify-center">
              <div className="relative w-full h-[65vh] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                <SafeImage
                  src={filteredImages[activeImageIndex].src}
                  alt={filteredImages[activeImageIndex].alt}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Caption Bar */}
              <div className="mt-4 text-center">
                <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">
                  {CATEGORY_LABELS[filteredImages[activeImageIndex].category]} ({activeImageIndex + 1} of {filteredImages.length})
                </span>
                <h3 className="text-sm font-medium text-slate-200 mt-1">
                  {filteredImages[activeImageIndex].alt}
                </h3>
              </div>
            </div>

            {/* Right Nav */}
            <button
              onClick={handleNext}
              className="absolute right-4 md:right-8 p-3 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors z-50 border border-slate-700"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
