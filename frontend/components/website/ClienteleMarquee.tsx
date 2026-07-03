import React from 'react';

const clientele = [
  'INTEX', 'Aiwa', 'Sansui', 'Bajaj Allianz', 'ARG', 'Oscar', 'Zebronics', 'Zopper',
  'Modish', 'Veego', 'Foxsky', 'Amazon', 'Melbon', 'Croma', 'Flipkart', 'Murphy',
  'F&D', 'Reliance Digital', 'Impex', 'TMB'
];

export function ClienteleMarquee() {
  return (
    <section className="py-16 bg-white overflow-hidden border-y border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary-600 mb-4">Trusted By</p>
        <h2 className="text-3xl font-bold text-slate-900">Our Clientele</h2>
      </div>
      
      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12 group-hover:[animation-play-state:paused]">
          {[...clientele, ...clientele, ...clientele].map((brand, idx) => (
            <span 
              key={idx} 
              className="mx-4 text-2xl md:text-3xl font-extrabold text-slate-300 hover:text-primary-600 transition-colors duration-300 cursor-pointer"
            >
              {brand}
            </span>
          ))}
        </div>
        {/* Absolute clone for seamless scrolling */}
        <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center gap-12 group-hover:[animation-play-state:paused]">
          {[...clientele, ...clientele, ...clientele].map((brand, idx) => (
            <span 
              key={`clone-${idx}`} 
              className="mx-4 text-2xl md:text-3xl font-extrabold text-slate-300 hover:text-primary-600 transition-colors duration-300 cursor-pointer"
            >
              {brand}
            </span>
          ))}
        </div>
        
        {/* Gradient overlays for fading edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white to-transparent" />
      </div>
    </section>
  );
}
