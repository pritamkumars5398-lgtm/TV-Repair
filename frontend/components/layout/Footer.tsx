import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Share2, Heart, Video } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 text-slate-600 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="space-y-5">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="RepairCart"
                width={140}
                height={48}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-sm leading-relaxed text-slate-500">
              Your trusted partner for LED repair and premium speaker manufacturing. Certified technicians, genuine parts, 30-day warranty.
            </p>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">We Fix It Right</p>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="#" aria-label="Facebook" className="hover:text-primary-600 transition-colors"><Share2 className="h-5 w-5" /></a>
              <a href="#" aria-label="Instagram" className="hover:text-primary-600 transition-colors"><Heart className="h-5 w-5" /></a>
              <a href="#" aria-label="YouTube" className="hover:text-primary-600 transition-colors"><Video className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Services</h3>
            <ul className="space-y-2.5 text-sm">
              {['LED TV Repair', 'Mobile Touch Repair', 'Speaker Manufacturing', 'Home Theater Install'].map((s) => (
                <li key={s}>
                  <Link href="/services" className="hover:text-primary-600 transition-colors">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/book', label: 'Book a Service' },
                { href: '/track', label: 'Track Repair' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/portal', label: 'Customer Login' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary-600 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-primary-500 shrink-0" />
                <span className="text-slate-500">123 Service Street, Electronics Hub, Mumbai – 400001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary-500 shrink-0" />
                <a href="tel:8586887887" className="hover:text-primary-600 transition-colors text-slate-500">+91 8586-887-887</a>
                  <a href="tel:8586807887" className="hover:text-primary-600 transition-colors text-slate-500">+91 8586-807-887</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary-500 shrink-0" />
                <a href="mailto:support@repaircart.co.in" className="hover:text-primary-600 transition-colors text-slate-500">support@repaircart.co.in info@repaircart.in</a>
              </li>
              <li className="text-xs text-slate-400 mt-2">Mon–Sat: 9:00 AM – 7:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {currentYear} RepairCart. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-primary-600 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary-600 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
