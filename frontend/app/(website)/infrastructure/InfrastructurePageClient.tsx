"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Building2,
  Wind,
  ShieldCheck,
  Box,
  Settings,
  ArrowRight,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import { CtaSection } from "@/components/website/CtaSection";

const infraHighlights = [
  {
    icon: Building2,
    title: "40,000 Sq. Ft. Facility",
    desc: "Spacious, modern manufacturing plant designed for high volume production and repair efficiency.",
  },
  {
    icon: Wind,
    title: "Class 100K Clean Room",
    desc: "Dust-free environment essential for screen assembly, panel bonding, and optical alignment.",
  },
  {
    icon: Settings,
    title: "Laser COF Bonding Machines",
    desc: "State-of-the-art machinery for high-precision panel bonding and display repair.",
  },
  {
    icon: ShieldCheck,
    title: "Automated SOPs",
    desc: "Fully automated standard operating procedures ensuring consistent high yield.",
  },
  {
    icon: ShieldCheck,
    title: "OQA Area",
    desc: "Dedicated Outgoing Quality Assurance zone for 100% inspection before dispatch.",
  },
  {
    icon: Box,
    title: "Advanced Packaging",
    desc: "Specialized packaging machines with shrink wrap and wooden boxes.",
  },
];

interface GalleryItem {
  src: string;
  category: 'Speaker Manufacturing' | 'Laser COF Bonding' | 'Cleanroom Assembly' | 'QC & Testing' | 'Facility Building';
  title: string;
  tag: string;
}

const galleryItems: GalleryItem[] = [
  // Speaker Manufacturing
  {
    src: '/realimages/SPEAKER/DSC07635.webp',
    category: 'Speaker Manufacturing',
    title: 'Soundbar & Audio Driver Assembly Line',
    tag: 'Audio Production',
  },
  {
    src: '/realimages/SPEAKER/DSC07627.webp',
    category: 'Speaker Manufacturing',
    title: 'Tower Speaker Enclosure Quality Testing',
    tag: 'Acoustic Quality',
  },
  {
    src: '/realimages/SPEAKER/DSC07633.webp',
    category: 'Speaker Manufacturing',
    title: 'Intercom & Subwoofer Circuit Assembly',
    tag: 'PCB & Wiring',
  },
  {
    src: '/realimages/SPEAKER/DSC07640.webp',
    category: 'Speaker Manufacturing',
    title: 'High-Fidelity Audio System Final Inspection',
    tag: 'Final Inspection',
  },

  // Laser COF Bonding
  {
    src: '/realimages/BONDING/DSC05309.webp',
    category: 'Laser COF Bonding',
    title: 'Automated Laser COF Panel Bonding Machine',
    tag: 'Laser Machine',
  },
  {
    src: '/realimages/BONDING/DSC05312.webp',
    category: 'Laser COF Bonding',
    title: 'Microscope Precision Flex Cable Alignment',
    tag: 'Micro-Bonding',
  },
  {
    src: '/realimages/BONDING/DSC05320.webp',
    category: 'Laser COF Bonding',
    title: 'High-Precision Driver IC Bonding Station',
    tag: 'IC Bonding',
  },
  {
    src: '/realimages/BONDING/DSC05327.webp',
    category: 'Laser COF Bonding',
    title: 'Thermal Pressing & Pulse Heat Unit',
    tag: 'Pulse Heat',
  },
  {
    src: '/realimages/BONDING/DSC05335.webp',
    category: 'Laser COF Bonding',
    title: 'COF Chip Replacement & Soldering Lab',
    tag: 'Chip Repair',
  },
  {
    src: '/realimages/BONDING/DSC05374.webp',
    category: 'Laser COF Bonding',
    title: 'Certified Engineer Bonding Workbench',
    tag: 'Bonding Lab',
  },

  // Cleanroom Assembly
  {
    src: '/realimages/ASSEMBLY/DSC05238.webp',
    category: 'Cleanroom Assembly',
    title: 'Class 100K Dust-Free Cleanroom Workbench',
    tag: 'Class 100K Lab',
  },
  {
    src: '/realimages/ASSEMBLY/DSC05241.webp',
    category: 'Cleanroom Assembly',
    title: 'LED Backlight Array & Diffuser Installation',
    tag: 'Backlight Assembly',
  },
  {
    src: '/realimages/ASSEMBLY/DSC05247.webp',
    category: 'Cleanroom Assembly',
    title: 'Ultra-Clean Screen Mounting Station',
    tag: 'Screen Assembly',
  },
  {
    src: '/realimages/ASSEMBLY/DSC05250.webp',
    category: 'Cleanroom Assembly',
    title: 'Optical Film & Polarizer Layer Alignment',
    tag: 'Optical Films',
  },
  {
    src: '/realimages/ASSEMBLY/DSC05252.webp',
    category: 'Cleanroom Assembly',
    title: 'TV Panel Frame & Bezel Fitting Workbench',
    tag: 'Frame Fitting',
  },

  // QC & Testing
  {
    src: '/realimages/QC/DSC05425.webp',
    category: 'QC & Testing',
    title: '12-Hour Screen Burn-in & Color Test',
    tag: 'Aging Test',
  },
  {
    src: '/realimages/QC/DSC05429.webp',
    category: 'QC & Testing',
    title: 'Power Board Voltage & Oscilloscope Test',
    tag: 'Board Testing',
  },
  {
    src: '/realimages/QC/DSC05431.webp',
    category: 'QC & Testing',
    title: '4K/8K Resolution & Motion Inspection',
    tag: 'Display QC',
  },
  {
    src: '/realimages/QC/DSC05474.webp',
    category: 'QC & Testing',
    title: 'Multi-Screen Display Aging & Heat Rack',
    tag: 'Heat Chamber',
  },
  {
    src: '/realimages/QC/DSC05495.webp',
    category: 'QC & Testing',
    title: 'Final OQA Inspection & Quality Certification',
    tag: 'OQA Final',
  },

  // Facility Building
  {
    src: '/realimages/BUILDING/DSC05217.webp',
    category: 'Facility Building',
    title: '40,000 Sq. Ft. Manufacturing & Repair Plant',
    tag: 'Main Building',
  },
  {
    src: '/realimages/BUILDING/DSC05218.webp',
    category: 'Facility Building',
    title: 'Component Warehouse & Inventory Storage',
    tag: 'Parts Warehouse',
  },
  {
    src: '/realimages/BUILDING/DSC05225.webp',
    category: 'Facility Building',
    title: 'Dispatch & Safe Transit Packaging Zone',
    tag: 'Logistics',
  },
];

const categories = [
  'All',
  'Speaker Manufacturing',
  'Laser COF Bonding',
  'Cleanroom Assembly',
  'QC & Testing',
  'Facility Building',
] as const;

export default function InfrastructurePageClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState<boolean>(false);

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 800,
      easing: "ease-out-cubic",
      offset: 100,
    });
  }, []);

  const filteredItems = selectedCategory === 'All'
    ? galleryItems
    : galleryItems.filter((item) => item.category === selectedCategory);

  const displayedItems = showAll ? filteredItems : filteredItems.slice(0, 8);

  const activeLightboxItem = lightboxIndex !== null ? displayedItems[lightboxIndex] : null;

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setShowAll(false);
    setLightboxIndex(null);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! === 0 ? displayedItems.length - 1 : prev! - 1));
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! === displayedItems.length - 1 ? 0 : prev! + 1));
    }
  };

  return (
    <div className="bg-slate-50 font-sans">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-50 pt-16 sm:pt-20 pb-16 border-b border-slate-200">
        <div className="absolute inset-0">
          <Image
            src="/realimages/BUILDING/DSC05217.webp"
            alt="Infrastructure"
            fill
            priority
            className="object-cover opacity-40"
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-xs font-bold text-primary-700 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>World-Class Infrastructure</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight mb-4">
            Infrastructure & <span className="text-primary-600">Technology</span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Our 40,000 sq. ft. facility features Class 100K cleanrooms, automated COF laser bonding machines, speaker manufacturing lines, and advanced QA testing labs.
          </p>
        </div>
      </section>

      {/* Facility Highlights Grid */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
              Infrastructure Highlights
            </h2>
            <p className="text-slate-600 font-medium">
              Equipped with modern machinery and rigorous processes to deliver precision at scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {infraHighlights.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-primary-300 hover:bg-white transition-all duration-300 shadow-sm group"
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 border border-primary-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <IconComp className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Facility Image Gallery (Filterable & Full Category Showcase) */}
      <section className="py-16 sm:py-20 bg-slate-100/80 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
              Facility & Lab Gallery
            </h2>
            <p className="text-slate-600 font-medium text-sm sm:text-base">
              Explore our speaker manufacturing lines, cleanroom assembly, COF bonding machines, and quality testing labs.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Image Grid (Initially 2 rows - 8 items) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedItems.map((item, index) => (
              <div
                key={index}
                onClick={() => setLightboxIndex(index)}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col"
                data-aos="fade-up"
                data-aos-delay={(index % 4) * 50}
              >
                {/* Clean Unobstructed Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Hover Center Overlay Badge */}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3.5 py-1.5 rounded-full bg-white text-slate-900 text-xs font-bold shadow-lg flex items-center gap-1.5 transform scale-95 group-hover:scale-100 transition-transform">
                      <Maximize2 className="w-3.5 h-3.5 text-primary-600" /> Click to Expand
                    </span>
                  </div>

                  {/* Top Tag Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-[10px] font-extrabold text-white tracking-wider uppercase">
                      {item.tag}
                    </span>
                  </div>
                </div>

                {/* Clean Title Section Below Image */}
                <div className="p-3.5 sm:p-4 bg-white flex-1 flex flex-col justify-between border-t border-slate-100">
                  <p className="text-xs font-extrabold text-slate-800 group-hover:text-primary-600 transition-colors leading-snug line-clamp-2">
                    {item.title}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                    <span>{item.category}</span>
                    <span className="text-primary-600 font-bold group-hover:underline">View Photo &rarr;</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show More / Show Less Toggle Button */}
          {filteredItems.length > 8 && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center gap-2 px-7 py-3 bg-white hover:bg-slate-50 text-slate-800 text-xs font-extrabold rounded-xl border border-slate-300 transition-all hover:border-primary-500 hover:text-primary-600 active:scale-[0.98]"
              >
                {showAll ? (
                  <>Show Less</>
                ) : (
                  <>Show More ({filteredItems.length - 8} More Photos) <ChevronRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeLightboxItem && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-slate-300 bg-white/10 rounded-full backdrop-blur-md transition-colors z-20"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Main Lightbox Image */}
            <div
              className="relative w-full h-[65vh] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={activeLightboxItem.src}
                alt={activeLightboxItem.title}
                fill
                className="object-contain bg-black"
              />

              {/* Prev / Next Nav Buttons */}
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-3 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full transition-all border border-slate-700"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full transition-all border border-slate-700"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Caption Info */}
            <div className="mt-4 text-center text-white" onClick={(e) => e.stopPropagation()}>
              <span className="px-3 py-1 bg-primary-600 text-white text-[10px] font-black rounded-full uppercase tracking-wider">
                {activeLightboxItem.category}
              </span>
              <h3 className="text-base sm:text-lg font-bold mt-2">{activeLightboxItem.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Photo {lightboxIndex! + 1} of {filteredItems.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <CtaSection
        title="Want a Tour of Our Facility?"
        description="Connect with our team to schedule an OEM partnership visit or discuss bulk electronics repair contracts."
        primaryBtnText="Book a Repair"
        primaryBtnHref="/book"
        secondaryBtnText="Contact Us"
        secondaryBtnHref="/contact"
        badgeText="OEM & B2B Visits"
        imageSrc="/realimages/BONDING/DSC05374.webp"
        imageAlt="Visit Our Infrastructure"
      />
    </div>
  );
}