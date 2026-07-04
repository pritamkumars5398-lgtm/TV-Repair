'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Activity } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/infrastructure', label: 'Infrastructure' },
  { href: '/products', label: 'Products' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/85 backdrop-blur-xl border-b border-slate-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.04)] py-2.5'
        : 'bg-white py-4 border-b border-slate-100'
        }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center group">
            <Image
              src="/logo.png"
              alt="Longwell Electronics"
              width={160}
              height={55}
              className="h-9 w-auto transition-transform group-hover:scale-105"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 flex-1 justify-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 text-[12px] xl:text-[13px] font-bold rounded-full transition-all duration-200 ${isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop right buttons */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Link
              href="/track"
              className="flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-primary-600 rounded-full transition-all border border-slate-200"
            >
              <Activity className="w-4 h-4 text-primary-500" /> Track Repair
            </Link>
            <Link
              href="/signup"
              className="flex items-center gap-1.5 px-5 py-2.5 text-[13px] font-bold text-slate-700 bg-white border border-slate-200 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 rounded-full transition-all shadow-sm group"
            >
              Sign Up
            </Link>
            <Link
              href="/book"
              className="flex items-center gap-1.5 px-6 py-2.5 text-[13px] font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-full transition-all shadow-[0_0_15px_rgba(37,99,235,0.25)] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:-translate-y-0.5"
            >
              Book Repair <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-primary-600 hover:bg-primary-50 transition-all border border-transparent hover:border-primary-100"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 border-b border-slate-200 bg-white/95 backdrop-blur-xl shadow-2xl">
          <div className="px-4 py-6 space-y-2 max-h-[85vh] overflow-y-auto">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 text-sm font-bold rounded-xl transition-all ${isActive
                    ? 'bg-primary-50 text-primary-700 border border-primary-100'
                    : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50 border border-transparent'
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-6 flex flex-col gap-3 border-t border-slate-100 mt-4">
              <div className="grid grid-cols-2 gap-3 mb-2">

                <Link
                  href="/signup"
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl transition-all border border-primary-100"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
              <Link
                href="/track"
                className="flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-primary-600 rounded-xl transition-all shadow-sm"
                onClick={() => setIsOpen(false)}
              >
                <Activity className="w-4 h-4 text-primary-500" /> Track Repair
              </Link>
              <Link
                href="/book"
                className="flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.25)]"
                onClick={() => setIsOpen(false)}
              >
                Book a Repair <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
