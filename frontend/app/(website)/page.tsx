import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Tv, Zap, Wrench, Monitor, Lightbulb, Sparkles,
  Speaker, Headphones, Shield, Clock, CheckCircle2,
  Star, ArrowRight, Phone, Mail, MapPin, ChevronRight,
} from 'lucide-react';
import { HeroSlideshow } from '@/components/website/HeroSlideshow';
import Repair from '../../assets/img/repai12.jpg'

export const metadata: Metadata = {
  title: 'Longwell Electronics — Electronics Repair & Manufacturing',
  description: 'Longwell Electronics — World class manufacturing and repair environment. LED TV Panel Repair, Mobile Glass Repair, Speaker Manufacturing, DOA Management.',
};

const services = [
  { icon: Tv, title: 'LED TV Panel Repair', desc: 'Repairing up to 85 inch panels with Class 100K clean room.' },
  { icon: Zap, title: 'Mobile Touch Repair', desc: 'Glass, Touch Panels, Reflectors, and Polarizers replacement.' },
  { icon: Speaker, title: 'Speaker Manufacturing', desc: 'Portable speakers, Home theater, Tower speakers.' },
  { icon: Wrench, title: 'Component Level Repair', desc: 'PCB, AC, Washing machine boards, and other electronics.' },
  { icon: Shield, title: 'DOA Management', desc: 'Check, repair, and refurbish DOA stocks for redeployment.' },
  { icon: Sparkles, title: 'Refurbishment (ETN)', desc: 'Equal to New product refurbishment.' },
  { icon: Clock, title: 'Parts Cannibalization', desc: 'Efficient parts swap and sorting services.' },
  { icon: Lightbulb, title: 'Recycling Support', desc: 'Recycling Beyond Economic Repair products appropriately.' },
];

const stats = [
  { value: '20,000+', label: 'Sq Ft Facility' },
  { value: '6,000+', label: 'Repairs / Month' },
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
  { name: 'OEM Partner', rating: 5, text: 'Longwell Electronics has helped us save major costs incurred towards mobile phone display replacements with their OGS repair capability.', service: 'Mobile Repair' },
  { name: 'Retail Brand', rating: 5, text: 'Their DOA management and ETN refurbishment has significantly reduced our cost and improved field redeployment.', service: 'DOA Management' },
  { name: 'Electronics Brand', rating: 5, text: 'The 20,000 sq ft facility and Class 1000/10000 clean rooms ensure perfect panel bonding and polarizer replacement.', service: 'Panel Repair' },
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
  name: 'Longwell Electronics',
  description: 'World class manufacturing and repair environment for LED TVs, Mobile phones, and Speakers.',
  url: 'https://www.longwellelectronics.com',
  telephone: '+919811881117',
  email: 'imrankhanik8463@gmail.com',
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
      <section className="relative bg-[#020617] text-white pt-28 pb-24 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-900/30 via-[#020617] to-[#020617]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div>
              <p className="text-primary-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4" data-aos="fade-up">
                Longwell Electronics
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-5" data-aos="fade-up" data-aos-delay="100">
                Total Solutions for<br />
                <span className="text-white bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-300">Electronics.</span>
              </h1>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8 max-w-lg font-medium" data-aos="fade-up" data-aos-delay="150">
                World class manufacturing and repair environment. We specialize in LED TV panels, mobile phone displays, speaker manufacturing, and DOA management.
              </p>
              <div className="flex flex-wrap gap-3" data-aos="fade-up" data-aos-delay="200">
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-md shadow-sm transition-all text-sm"
                >
                  Explore Services <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-md border border-white/10 transition-all text-sm"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Hero image card */}
            <div className="hidden lg:block relative" data-aos="fade-left" data-aos-delay="300">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-white/10 h-[380px]">
                <HeroSlideshow />
              </div>
              <div className="absolute -bottom-5 -left-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-3 shadow-lg flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">30-Day Warranty</p>
                  <p className="text-[10px] text-slate-300">On every repair</p>
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
            {services.map((svc) => (
              <Link
                key={svc.title}
                href="/book"
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
          <div className="mt-10 text-center">
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
                Longwell Electronics provides remarkable quality in products and services at best prices. With a 20,000 sq ft facility, clean rooms, and close relationships with Chinese spare part manufacturers, we ensure high yield percentages.
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


      {/* ── How It Works ── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">How it works</h2>
            <p className="text-sm text-slate-500 font-medium">Get your TV repaired in 4 simple steps.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Book Online', desc: 'Fill a quick form and pay ₹250 visit fee.', img: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&q=75' },
              { step: '02', title: 'Technician Visits', desc: 'Certified technician arrives at your home.', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=75' },
              { step: '03', title: 'Diagnosis', desc: 'We identify the issue and share an estimate.', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=75' },
              { step: '04', title: 'Repaired', desc: 'Your TV is fixed with a 30-day warranty.', img: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&q=75' },
            ].map((item, i) => (
              <div key={item.step} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="relative h-32 bg-slate-100 overflow-hidden">
                  <Image src={item.img} alt={item.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-slate-900/40" />
                  <span className="absolute bottom-2 left-3 text-3xl font-black text-white drop-shadow-sm">{item.step}</span>
                </div>
                <div className="p-4">
                  <p className="text-sm font-bold text-slate-900 mb-1">{item.title}</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center" data-aos="fade-up">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">What partners say</h2>
            <p className="text-slate-500 text-sm font-medium">Trusted by leading brands across the industry.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
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

      {/* ── CTA Banner ── */}
      <section className="relative py-20 bg-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-900/40 via-slate-900 to-slate-900" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center" data-aos="zoom-in">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Partner with us today</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mb-8 font-medium">Whether it's bulk DOA management, panel repairs, or sourcing high-quality speakers, Longwell Electronics is your trusted B2B partner.</p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/book" className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-md transition-all shadow-sm">
              Book a Repair
            </Link>
            <Link href="/contact" className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-md border border-white/20 transition-all">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* ── Contact Info ── */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: MapPin, title: 'Head Office', content: 'C-295 Sector 10 Noida,\nGautam Buddha Nagar-201301', href: undefined },
              { icon: Phone, title: 'Call Us', content: '+91 9811881117\n+91 9811211948', href: 'tel:9811881117', sub: 'Mon–Sat, 9am–7pm' },
              { icon: Mail, title: 'Email Us', content: 'imrankhanik8463@gmail.com\nlongwellpanelwork@gmail.com', href: 'mailto:imrankhanik8463@gmail.com', sub: 'Fast Response' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-primary-600">
                  <item.icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 mb-1">{item.title}</p>
                  {item.href ? (
                    <a href={item.href} className="text-xs font-medium text-slate-600 hover:text-primary-600 block transition-colors">{item.content}</a>
                  ) : (
                    <p className="text-xs font-medium text-slate-600 whitespace-pre-line">{item.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
