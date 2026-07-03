'use client';

import { useState, useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';

import product1 from '../../assets/img/user2.png';
import product2 from '../../assets/img/user1.png';
import product3 from '../../assets/img/repair1.png';
import product4 from '../../assets/img/repair2.png';
import product5 from '../../assets/img/repair10.png';

const images: {
  src: StaticImageData;
  alt: string;
}[] = [
    {
      src: product1,
      alt: 'LED TV Repair',
    },
    {
      src: product2,
      alt: 'Electronics Repair Lab',
    },
    {
      src: product3,
      alt: 'Motherboard Repair',
    },
    {
      src: product4,
      alt: 'LED Panel Repair',
    },
    {
      src: product5,
      alt: 'Professional Repair Center',
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
    <div className="relative w-full h-full overflow-hidden rounded-3xl">

      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/25" />
        </div>
      ))}

      {/* Bottom Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-3 w-3 rounded-full transition-all ${index === activeIndex
              ? 'bg-white w-8'
              : 'bg-white/50'
              }`}
          />
        ))}
      </div>

    </div>
  );
}