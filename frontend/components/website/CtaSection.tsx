import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface CtaBannerProps {
  title?: string;
  description?: string;
  primaryBtnText?: string;
  primaryBtnHref?: string;
  secondaryBtnText?: string;
  secondaryBtnHref?: string;
  badgeText?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export function CtaSection({
  title = 'Partner with us today',
  description = "Whether it's B2B electronic servicing, panel repairs, or sourcing high-quality speakers, RC RepairCart is your trusted partner.",
  primaryBtnText = 'Book a Repair',
  primaryBtnHref = '/book',
  secondaryBtnText = 'Contact Us',
  secondaryBtnHref = '/contact',
  badgeText = 'Get Started',
  imageSrc = '/realimages/BUILDING/DSC05423.webp',
  imageAlt = 'Partner with us - RC RepairCart Team',
}: CtaBannerProps) {
  return (
    <section className="relative py-16 bg-white border-t border-slate-200/60 overflow-hidden">
      {/* Soft Glow */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-50/50 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-indigo-50/50 blur-[90px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Side: Content */}
          <div className="lg:col-span-7 text-left space-y-4" data-aos="fade-right">
            {badgeText && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold uppercase tracking-wider">
                {badgeText}
              </span>
            )}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {title}
            </h2>
            <p className="text-slate-655 text-sm leading-relaxed max-w-xl font-medium">
              {description}
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              {primaryBtnText && primaryBtnHref && (
                <Link
                  href={primaryBtnHref}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-primary-600/10 hover:-translate-y-0.5 inline-flex items-center gap-2"
                >
                  {primaryBtnText}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
              {secondaryBtnText && secondaryBtnHref && (
                <Link
                  href={secondaryBtnHref}
                  className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 hover:border-slate-300 transition-all shadow-sm hover:-translate-y-0.5 inline-flex items-center gap-2"
                >
                  {secondaryBtnText}
                </Link>
              )}
            </div>
          </div>

          {/* Right Side: Image */}
          <div className="lg:col-span-5 relative" data-aos="fade-left">
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-blue-400/5 rounded-full blur-2xl pointer-events-none" />
            <div className="relative h-[260px] sm:h-[280px] w-full max-w-[400px] mx-auto lg:mr-0 rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-white">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
