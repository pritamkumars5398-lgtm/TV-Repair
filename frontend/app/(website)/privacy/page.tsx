import Link from 'next/link';
import { Shield, Lock, Eye, FileText, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy - RepairCart',
  description: 'Learn about how RepairCart collects, uses, and protects your personal information and TV device repair data.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-[#020617] text-white border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-[#020617] to-[#020617]" />
        
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 mb-4">
            <Shield className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            At RepairCart, we prioritize the protection of your personal information, address data, and device service records.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <span>Last Updated: October 2026</span>
            <span>•</span>
            <span>Version 2.0</span>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 max-w-4xl mx-auto px-6">
        <div className="grid md:grid-cols-[250px_1fr] gap-10 items-start">
          
          {/* Quick Navigation Sidebar */}
          <aside className="sticky top-24 hidden md:block space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 px-3">
              Sections
            </h3>
            {[
              { label: 'Introduction', href: '#introduction' },
              { label: 'Information We Collect', href: '#collect' },
              { label: 'How We Use Data', href: '#use' },
              { label: 'Payment Gateway & Security', href: '#payments' },
              { label: 'Data Sharing & Protection', href: '#protection' },
              { label: 'Your Rights & Choices', href: '#rights' },
              { label: 'Contact Us', href: '#contact' },
            ].map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 rounded-lg hover:bg-slate-100 hover:text-blue-600 transition-colors"
              >
                <ChevronRight className="w-3 h-3 text-slate-400" />
                {item.label}
              </a>
            ))}
          </aside>

          {/* Policy Text */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-sm space-y-10">
            
            {/* Section 1 */}
            <div id="introduction" className="space-y-3 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" /> 1. Introduction
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Welcome to RepairCart (accessible at <Link href="/" className="text-blue-600 font-semibold hover:underline">repaircart.co.in</Link>). We respect your privacy and are committed to safeguarding the personal data you share when requesting television repairs, diagnostic visits, or using our customer portal.
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                This Privacy Policy explains what information we collect, how we use it to provide top-notch repair services, how payments are securely processed, and how you can manage your data.
              </p>
            </div>

            {/* Section 2 */}
            <div id="collect" className="space-y-4 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" /> 2. Information We Collect
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                We collect personal information directly from you when you book a repair, request a doorstep visit, or contact support:
              </p>
              <ul className="list-disc pl-5 text-xs text-slate-600 space-y-2">
                <li><strong>Contact & Address Details:</strong> Name, 10-digit mobile number, email address, and home/office address for technician visits and TV pickup/drop.</li>
                <li><strong>Device Information:</strong> TV brand (Sony, Samsung, LG, etc.), screen size, model number, fault description, and photos/videos of display defects uploaded during ticket creation.</li>
                <li><strong>Service Records:</strong> Assigned technician details, inspection reports, diagnostic estimates, repair invoices, and warranty status.</li>
                <li><strong>Communications:</strong> SMS notifications, WhatsApp updates, and OTP verification logs sent via authorized telecommunication channels (MSG91).</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div id="use" className="space-y-3 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" /> 3. How We Use Your Information
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your data is exclusively used for operational and service delivery purposes:
              </p>
              <ul className="list-disc pl-5 text-xs text-slate-600 space-y-2">
                <li>Dispatching certified technicians to your location for diagnosis.</li>
                <li>Sending booking confirmations, technician arrival OTPs, and real-time repair status updates.</li>
                <li>Generating digital estimates and transparent GST-compliant repair invoices.</li>
                <li>Providing after-repair warranty service and customer assistance.</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div id="payments" className="space-y-3 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" /> 4. Online Payment Security (Razorpay)
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                We use <strong>Razorpay</strong> as our secure, RBI-authorized third-party payment gateway partner for all digital payments including UPI, Net Banking, Credit Cards, and Debit Cards.
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>No Sensitive Card Storage:</strong> RepairCart never collects, stores, or handles your credit/debit card numbers, CVVs, or Net Banking credentials on our servers. All transactions are encrypted with bank-grade 128-bit SSL/TLS encryption through Razorpay&apos;s PCI-DSS compliant checkout interface.
              </p>
            </div>

            {/* Section 5 */}
            <div id="protection" className="space-y-3 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" /> 5. Data Sharing & Confidentiality
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                We strictly <strong>do not sell, rent, or trade</strong> your personal contact information to any third-party marketers or advertisers. Data is shared strictly on a need-to-know basis with:
              </p>
              <ul className="list-disc pl-5 text-xs text-slate-600 space-y-2">
                <li>Assigned field technicians for reaching your doorstep and servicing the device.</li>
                <li>Secure payment processors (Razorpay) for processing repair payments.</li>
                <li>Authorized SMS/telephony gateways (MSG91) for sending critical service OTPs and alerts.</li>
              </ul>
            </div>

            {/* Section 6 */}
            <div id="rights" className="space-y-3 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" /> 6. Your Rights
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                You have the right to access, update, or request the deletion of your account and personal information at any time. Simply contact our support team or reach out to our grievance desk.
              </p>
            </div>

            {/* Section 7 */}
            <div id="contact" className="space-y-4 border-t border-slate-100 pt-6 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900">
                7. Contact Our Privacy Officer
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                If you have questions or concerns regarding our privacy practices or data handling, please contact us:
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                  <span><strong>Email:</strong> <a href="mailto:support@repaircart.co.in" className="text-blue-600 hover:underline">support@repaircart.co.in</a></span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                  <span><strong>Phone:</strong> <a href="tel:8586887887" className="hover:underline">+91 8586-887-887</a> / <a href="tel:8586807887" className="hover:underline">+91 8586-807-887</a></span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Registered Office:</strong> C-295, Sector-10, Noida, Uttar Pradesh - 201301</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
