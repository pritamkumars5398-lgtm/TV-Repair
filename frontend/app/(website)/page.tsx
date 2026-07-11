import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Tv, Zap, Wrench, Monitor, Lightbulb, Sparkles,
  Speaker, Headphones, Shield, Clock, CheckCircle2,
  Star, ArrowRight, Phone, Mail, MapPin, ChevronRight,
} from 'lucide-react';
import { HeroSlideshow } from '@/components/website/HeroSlideshow';
import { FaqAccordion } from '@/components/website/FaqAccordion';
import Repair from '../../assets/img/repai12.jpg'

export const metadata: Metadata = {
  title: 'RC RepairCart — Electronics Repair & Manufacturing',
  description: 'RC RepairCart — World class manufacturing and repair environment. LED TV Panel Repair, Speaker Manufacturing, DOA Management.',
};

const services = [
  { icon: Tv, title: 'LED TV Panel Repair', desc: 'Repairing up to 110 inch panels with Class 100K clean room.' },
  { icon: Speaker, title: 'Speaker Manufacturing', desc: 'Portable speakers, Home theater, Tower speakers.' },
  { icon: Wrench, title: 'Component Level Repair', desc: 'PCB, AC, Washing machine boards, and other electronics.' },
  { icon: Shield, title: 'DOA Management', desc: 'Check, repair, and refurbish DOA stocks for redeployment.' },
  { icon: Sparkles, title: 'Refurbishment (ETN)', desc: 'Equal to New product refurbishment.' },
  { icon: Clock, title: 'Parts Cannibalization', desc: 'Efficient parts swap and sorting services.' },
  { icon: Lightbulb, title: 'Recycling Support', desc: 'Recycling Beyond Economic Repair products appropriately.' },
  { icon: Headphones, title: 'Audio System Repair', desc: 'Fixing home theaters, soundbars, amplifiers and bluetooth speakers.' },
  { icon: Monitor, title: 'Smart Projector Repair', desc: 'Optical engines, DMD chips and alignment of high-end projectors.' },
  { icon: Zap, title: 'Power Board / SMPS Repair', desc: 'Component level diagnostics of power cards, circuit board burns and SMPS.' },
  { icon: Tv, title: 'Accessory Refurbishment', desc: 'Bulk smart remote controls, casting keys, adapters testing and packaging.' },
];

const stats = [
  { value: '40,000+', label: 'Sq Ft Facility' },
  { value: '2,000+', label: 'Repairs / Month' },
  { value: '100K', label: 'Clean Room Class' },
  { value: '100%', label: 'OQA Inspection' },
];

const features = [
  { icon: Shield, title: 'Professional Infrastructure', desc: 'State-of-the-art repair center with latest testing, bonding, and clean room facilities.' },
  { icon: CheckCircle2, title: 'Quality Assurance', desc: 'Yield up to 85% for field failure units and 90% for line rejection.' },
  { icon: Clock, title: 'TAT Guarantee', desc: 'Turn around time guarantee for services with fully automatized SOP.' },
  { icon: MapPin, title: 'Reverse Logistics', desc: 'Efficient domestic RMA and transportation services.' },
];

const testimonials = [
  { name: 'Retail Brand', rating: 5, text: 'Their DOA management and ETN refurbishment has significantly reduced our cost and improved field redeployment.', service: 'DOA Management' },
  { name: 'Electronics Brand', rating: 5, text: 'The 20,000 sq ft facility and Class 1000/10000 clean rooms ensure perfect panel bonding and polarizer replacement.', service: 'Panel Repair' },
  { name: 'Smart TV Brand Partner', rating: 5, text: 'Their laser panel bonding capability fixed vertical display lines on 500+ units in record time, with high yield success.', service: 'COF Bonding' },
  { name: 'Home Theater Distributor', rating: 5, text: 'RC RepairCart is our go-to partner for speaker driver assembly and audio diagnostics. Exceptional response time.', service: 'Audio Systems' },
  { name: 'Corporate Office Client', rating: 5, text: 'Excellent yearly AMC maintenance contract. They handle all our meeting room LED displays and board-level micro-repairs seamlessly.', service: 'Yearly AMC Services' },
];

const blogPosts = [
  {
    id: 1,
    title: 'The Future of LED Panel Repair: Class 100K Clean Rooms',
    category: 'Technology',
    date: 'Oct 12, 2023',
    desc: 'Discover how advanced clean room environments are revolutionizing the way we bond and repair large-scale LED panels.',
    img: 'https://images.unsplash.com/photo-1581092918056-0c4c3aebb8e9?w=600&q=80'
  },
  {
    id: 2,
    title: 'Why DOA Management is Crucial for Electronics Brands',
    category: 'Business',
    date: 'Nov 05, 2023',
    desc: 'Dead on Arrival (DOA) stock can bleed revenue. Learn how proper refurbishment and master checking can save millions.',
    img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80'
  },
  {
    id: 3,
    title: 'Sustainable E-Waste: Recycling Beyond Economic Repair',
    category: 'Sustainability',
    date: 'Nov 28, 2023',
    desc: 'E-waste is a growing concern. Explore our eco-friendly recycling processes for units that are beyond economic repair.',
    img: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80'
  }
];

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'RC RepairCart',
  description: 'World class manufacturing and repair environment for LED TVs and Speakers.',
  url: 'https://www.inchellcorparation.com',
  telephone: '+918586887887',
  email: 'support@repaircart.co.in',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'C-295 Sector 10',
    addressLocality: 'Noida',
    addressRegion: 'Uttar Pradesh',
    postalCode: '201301',
    addressCountry: 'IN',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 28.5885, longitude: 77.3175 },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '19:00' },
  ],
  priceRange: '₹₹',
  image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1200&q=80',
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '4200' },
};

export default function HomePage() {
  return (
    <div className="bg-slate-50 font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9]/50 to-white text-slate-800 pt-28 pb-24 overflow-hidden border-b border-slate-200/60">
        {/* Technical Grid Pattern & Soft Radial Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-100/20 via-white to-white pointer-events-none" />
        <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary-100/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-150 bg-primary-50/50 px-3.5 py-1.5 text-[11px] font-extrabold text-primary-700 shadow-sm mb-6 backdrop-blur-sm" data-aos="fade-up">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-pulse" />
                <span>RC RepairCart — ISO Certified Partner</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-slate-900 mb-6" data-aos="fade-up" data-aos-delay="100">
                Total Solutions for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">LED TVs.</span>
              </h1>
              <p className="text-slate-655 text-sm md:text-base leading-relaxed mb-8 max-w-lg font-medium" data-aos="fade-up" data-aos-delay="150">
                World class repair and servicing environment. We specialize in LED TV panels, power board bonding, backlight repair, and DOA management.
              </p>
              <div className="flex flex-wrap gap-3.5" data-aos="fade-up" data-aos-delay="200">
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-extrabold rounded-xl hover:-translate-y-0.5 transition-all text-xs"
                >
                  Explore Services <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-extrabold rounded-xl border border-slate-200 hover:border-slate-300 transition-all text-xs shadow-sm hover:-translate-y-0.5"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Hero image card */}
            <div className="hidden lg:block relative" data-aos="fade-left" data-aos-delay="300">
              {/* Glowing spots */}
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-400/20 rounded-full blur-2xl pointer-events-none animate-pulse-slow" />
              <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none animate-pulse-slow" />

              {/* Floating Slide Card */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 h-[380px] animate-float z-10 bg-white">
                <HeroSlideshow />
              </div>
              <div className="absolute -bottom-5 -left-5 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xl flex items-center gap-3.5 backdrop-blur-sm z-20 animate-float" style={{ animationDelay: '1.5s' }}>
                <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Warranty</p>
                  <p className="text-xs font-extrabold text-slate-800 mt-1 leading-tight">30-Day Guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-white py-8 relative z-10 -mt-10 mx-4 sm:mx-auto max-w-5xl rounded-xl shadow-md border border-slate-100" data-aos="fade-up">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {stats.map((s) => (
            <div key={s.label} className="py-4 px-6 text-center">
              <p className="text-2xl font-black text-slate-800 mb-1">{s.value}</p>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>



      {/* ── Services Grid ── */}
      <section className="py-20 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center max-w-xl mx-auto" data-aos="fade-up">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Premium Repair Services</h2>
            <p className="text-sm text-slate-500 font-medium">Expert repairs with genuine parts and transparent pricing.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((svc, i) => (
              <Link
                key={svc.title}
                href="/book"
                data-aos="fade-up"
                data-aos-delay={i * 50}
                className="group flex flex-col gap-3 p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary-200 transition-all"
              >
                <div className="h-10 w-10 rounded-lg bg-slate-50 text-slate-600 group-hover:bg-primary-50 group-hover:text-primary-600 flex items-center justify-center transition-colors border border-slate-100">
                  <svc.icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 mb-1">{svc.title}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{svc.desc}</p>
                </div>
                <div className="mt-auto pt-3 border-t border-slate-50">
                  <span className="inline-flex items-center text-[11px] font-bold text-primary-600 uppercase tracking-wider">
                    Book Service <ArrowRight className="ml-1.5 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center" data-aos="fade-up" data-aos-delay="200">
            <Link href="/services" className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-md transition-all text-xs shadow-sm">
              Explore All Services <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>



      {/* ── Why Us ── */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden h-[400px] border border-slate-200 shadow-md" data-aos="fade-right">
              <Image
                src={Repair}
                alt="TV repair workshop"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <div className="flex items-center gap-3 bg-white/95 backdrop-blur rounded-xl p-3 shadow-sm border border-white/20">
                  <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                    <Shield className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Certified Workshop</p>
                    <p className="text-xs text-slate-500 font-medium">All major brand authorized</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Text */}
            <div data-aos="fade-left">
              <p className="text-primary-600 text-[10px] font-bold uppercase tracking-widest mb-2">Why Choose Us</p>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4 leading-tight">
                Quality service and<br />customer satisfaction.
              </h2>
              <p className="text-slate-500 leading-relaxed mb-8 text-sm font-medium">
                RC RepairCart provides remarkable quality in products and services at best prices. With a 20,000 sq ft facility, clean rooms, and close relationships with Chinese spare part manufacturers, we ensure high yield percentages.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {features.map((f) => (
                  <div key={f.title} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="h-8 w-8 rounded bg-white flex items-center justify-center mb-3 shadow-sm border border-slate-100">
                      <f.icon className="h-4 w-4 text-primary-600" strokeWidth={2.5} />
                    </div>
                    <p className="text-xs font-bold text-slate-900 mb-1">{f.title}</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Advanced Infrastructure & Machinery ── */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center max-w-xl mx-auto" data-aos="fade-up">
            <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Inside Our Lab
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-3 mb-2">Class-Leading Repair Infrastructure</h2>
            <p className="text-sm text-slate-500 font-medium">We invest in the highest grade robotic repair machinery for precise screen panel bonding and diagnostics.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Laser COF Bonding Machine',
                desc: 'Precise robotic laser welding of screen gate drivers and flex cables to resolve vertical line faults.',
                icon: Zap,
                badge: 'Industry Standard'
              },
              {
                title: 'Class 10,000 Clean Room',
                desc: 'Specialized particulate-filtered cabin environment to replace polarizers without dust contamination.',
                icon: Shield,
                badge: 'Dust Free'
              },
              {
                title: 'Tab Bonding / ACF Bonder',
                desc: 'Anisotropic Conductive Film bonding machines to restore connection signals between PCB & Glass.',
                icon: Tv,
                badge: 'High Precision'
              },
              {
                title: 'Digital Oscilloscopes',
                desc: 'Microsecond signal capturing and volt-ampere line tracking to identify microchip component failures.',
                icon: Wrench,
                badge: 'OEM Diagnostics'
              }
            ].map((mach, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center border border-slate-100">
                      <mach.icon className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 border border-slate-200 px-2 py-0.5 rounded uppercase tracking-wider">
                      {mach.badge}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mb-2 leading-tight">
                    {mach.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {mach.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── How It Works ── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-aos="fade-up">
            <span className="inline-block px-3 py-1 rounded-full bg-primary-50 text-primary-700 font-bold text-[10px] tracking-widest uppercase mb-4 border border-primary-100">
              Our Process
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">How it works</h2>
            <p className="text-sm text-slate-500 font-medium">Get your TV repaired in 8 simple steps — from doorstep booking to certified lab repair.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Book Online', desc: 'Fill a quick form and pay a minor ₹250 visit charge.', img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=75' },
              { step: '02', title: 'Time Slot Sync', desc: 'Our team coordinates with you to schedule the visit.', img: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&q=75' },
              { step: '03', title: 'Doorstep Visit', desc: 'Certified engineer arrives with diagnostics kit.', img: 'https://images.unsplash.com/photo-1581092918056-0c4c3aebb8e9?w=400&q=75' },
              { step: '04', title: 'Fault Analysis', desc: 'Identify root board failure and share cost estimate.', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=75' },
              { step: '05', title: 'Safe Packaging', desc: 'TV is packaged securely in custom thick transit boxes.', img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=75' },
              { step: '06', title: 'Precision Repair', desc: 'Laser COF panel bonding and board level repair in clean lab.', img: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&q=75' },
              { step: '07', title: 'Stress Testing', desc: 'Rigorous 12-hour color, resolution & heat checking.', img: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&q=75' },
              { step: '08', title: 'Warranty Delivery', desc: 'TV returned securely with standard 30-day warranty.', img: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&q=75' },
            ].map((item, i) => (
              <div key={item.step} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300" data-aos="fade-up" data-aos-delay={i * 50}>
                <div className="relative h-36 bg-slate-100 overflow-hidden">
                  <Image src={item.img} alt={item.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-slate-950/30" />
                  <span className="absolute top-3 left-3 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-black text-white border border-white/10 shadow-sm">
                    {item.step}
                  </span>
                </div>
                <div className="p-4 space-y-1">
                  <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">{item.title}</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AMC Pricing Plans ── */}

      {/* <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center max-w-xl mx-auto" data-aos="fade-up">
            <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Annual Protection
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-3 mb-2">Annual Maintenance Plans</h2>
            <p className="text-sm text-slate-500 font-medium">Protect your home electronics with our yearly maintenance plans.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all relative">
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Smart TV AMC Plan</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-black text-slate-950">₹1,499</span>
                    <span className="text-xs text-slate-400 font-medium ml-1">/year</span>
                  </div>
                </div>

                <hr className="border-slate-100" />

                <ul className="space-y-3.5">
                  {[
                    '2 scheduled health & cleaning visits',
                    'Backlight & LED dust extraction',
                    'Firmware check & OS calibration',
                    'Priority response within 24 hours',
                    '15% discount on spare parts & labor'
                  ].map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600 font-semibold">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50">
                <a
                  href={`https://wa.me/918586887887?text=Hi, I am interested in the Smart TV AMC Plan (₹1,499/year).`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white text-center font-extrabold text-xs rounded-xl shadow-sm transition-all active:scale-[0.98] block"
                >
                  Enquire on WhatsApp
                </a>
              </div>
            </div>

            
            <div className="bg-white border-2 border-primary-600 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-md hover:shadow-lg transition-all relative scale-105">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-primary-600 to-cyan-600 text-white font-extrabold text-[9px] uppercase tracking-widest rounded-full shadow-sm">
                Popular
              </span>
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Dual TV Combo AMC</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-black text-slate-950">₹2,499</span>
                    <span className="text-xs text-slate-400 font-medium ml-1">/year</span>
                  </div>
                </div>

                <hr className="border-slate-100" />

                <ul className="space-y-3.5">
                  {[
                    'Protection for up to 2 TVs in one home',
                    '2 full panel cleaning & diagnostics visits',
                    'Display software updates & calibration',
                    'Priority same-day technician visit',
                    '20% discount on motherboard/panel repair'
                  ].map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600 font-semibold">
                      <span className="text-primary-600 font-bold">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50">
                <a
                  href={`https://wa.me/918586887887?text=Hi, I am interested in the Dual TV Combo AMC Plan (₹2,499/year).`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white text-center font-extrabold text-xs rounded-xl shadow-sm transition-all active:scale-[0.98] block"
                >
                  Enquire on WhatsApp
                </a>
              </div>
            </div>

            
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all relative">
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Full Home Electronics AMC</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-black text-slate-950">₹3,999</span>
                    <span className="text-xs text-slate-400 font-medium ml-1">/year</span>
                  </div>
                </div>

                <hr className="border-slate-100" />

                <ul className="space-y-3.5">
                  {[
                    'Covers all TVs, home theaters & soundbars',
                    '3 scheduled preventative maintenance checks',
                    'Zero diagnostics/visiting fee on call-outs',
                    'Priority same-day priority repair visit',
                    'Free standby TV unit during major repairs'
                  ].map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600 font-semibold">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50">
                <a
                  href={`https://wa.me/918586887887?text=Hi, I am interested in the Full Home Electronics AMC Plan (₹3,999/year).`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white text-center font-extrabold text-xs rounded-xl shadow-sm transition-all active:scale-[0.98] block"
                >
                  Enquire on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section> */}




      {/* ── Testimonials ── */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center" data-aos="fade-up">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">What partners say</h2>
            <p className="text-slate-500 text-sm font-medium">Trusted by leading brands across the industry.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <div key={t.name} data-aos="fade-up" data-aos-delay={index * 100} className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-6 font-medium">"{t.text}"</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-200/60">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{t.name}</p>
                    <p className="text-[10px] text-primary-600 font-bold uppercase tracking-wider mt-0.5">{t.service}</p>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center max-w-xl mx-auto" data-aos="fade-up">
            <span className="inline-block px-3 py-1 rounded-full bg-primary-50 text-primary-700 font-bold text-[10px] tracking-widest uppercase mb-4 border border-primary-100">
              People Also Ask
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-2 mb-2">Common Questions — TV & Electronics Repair</h2>
            <p className="text-sm text-slate-500 font-medium">Quick answers to common questions about our repair doorstep services.</p>
          </div>
          <FaqAccordion />
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative py-16 bg-white border-t border-slate-200/60 overflow-hidden">
        {/* Soft Glow */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-50/50 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-indigo-50/50 blur-[90px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid lg:grid-cols-12 gap-8 items-center">

            {/* Left Side: Content */}
            <div className="lg:col-span-7 text-left space-y-4" data-aos="fade-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold uppercase tracking-wider">
                Get Started
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Partner with us today
              </h2>
              <p className="text-slate-655 text-sm leading-relaxed max-w-xl font-medium">
                Whether it's B2B electronic servicing, panel repairs, or sourcing high-quality speakers, RC RepairCart is your trusted partner.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href="/book"
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-primary-600/10 hover:-translate-y-0.5"
                >
                  Book a Repair
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 hover:border-slate-300 transition-all shadow-sm hover:-translate-y-0.5"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Right Side: Image */}
            <div className="lg:col-span-5 relative" data-aos="fade-left">
              {/* Glowing spots */}
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-blue-400/5 rounded-full blur-2xl pointer-events-none" />

              <div className="relative h-[280px] w-full max-w-5400px] mx-auto lg:mr-0  overflow-hidden shadow-lg border border-slate-200/80 bg-white">
                <Image
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"
                  alt="Partner with us"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>


    </div>
  );
}
