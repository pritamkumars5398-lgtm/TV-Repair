'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const images: {
  src: string;
  alt: string;
}[] = [
  {
    src: '/realimages/BONDING/DSC05309.webp',
    alt: 'Laser COF Panel Bonding Machine',
  },
  {
    src: '/realimages/ASSEMBLY/DSC05238.webp',
    alt: 'Class 100K Clean Room Panel Assembly',
  },
  {
    src: '/realimages/QC/DSC05425.webp',
    alt: 'Precision LED TV Screen Testing & QC',
  },
  {
    src: '/realimages/BONDING/DSC05374.webp',
    alt: 'Certified Repair Engineer Bonding Station',
  },
  {
    src: '/realimages/ASSEMBLY/DSC05252.webp',
    alt: 'Precision Electronics Repair Workbench',
  },
  {
    src: '/realimages/QC/DSC05474.webp',
    alt: 'Quality Assurance & Screen Aging Test Zone',
  },
  {
    src: '/realimages/BUILDING/DSC05423.webp',
    alt: 'RC RepairCart Facility & Operations Team',
  },
  {
    src: '/realimages/SPEAKER/DSC07653.webp',
    alt: 'Audio & Speaker Manufacturing Station',
  },
  {
    src: '/realimages/QC/DSC05513.webp',
    alt: 'Quality Control & Display Panel Inspection',
  },
  {
    src: '/realimages/BONDING/DSC05342.webp',
    alt: 'COF Panel Bonding & Laser Alignment Process',
  },
];

export function HeroSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={index === 0}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/25" />
        </div>
      ))}

      {/* Bottom Dots */}
      <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-3 w-3 rounded-full transition-all ${
              index === activeIndex ? 'bg-white w-8' : 'bg-white/50'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}