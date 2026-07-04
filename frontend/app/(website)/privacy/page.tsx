import Link from 'next/link';
import { Shield, Lock, Eye, FileText, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy - Longwell Electronics',
  description: 'Learn about how Longwell Electronics collects, uses, and protects your personal information.',
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
            At Longwell Electronics, we prioritize the protection of your personal information and device data. Read below to understand our commitment to your privacy.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <span>Last Updated: July 4, 2026</span>
            <span>•</span>
            <span>Version 1.1</span>
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
                Welcome to Longwell Electronics (accessible at <Link href="/" className="text-blue-600 font-semibold hover:underline">longwell.in</Link>). We respect your privacy and are committed to protecting the personal data we collect from you or that you provide to us through our TV repair CRM, website, and customer portal.
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                This Privacy Policy explains what information we collect, how we use it, the conditions under which we may disclose it to others, and how we keep it secure.
              </p>
            </div>

            {/* Section 2 */}
            <div id="collect" className="space-y-4 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" /> 2. Information We Collect
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                We collect personal information directly from you when you request a service, sign up for an account, or contact our customer support. This includes:
              </p>
              <ul className="list-disc pl-5 text-xs text-slate-600 space-y-2">
                <li><strong>Identity & Contact Details:</strong> Name, phone number, email address, physical billing address, and repair pickup/delivery address.</li>
                <li><strong>Device Information:</strong> TV brand, model number, serial number, description of issues, and pictures of product issues (uploaded via our ticket creation page).</li>
                <li><strong>Payment Information:</strong> Transaction details, invoice information, and payment tokens. Payment details (e.g. UPI, cards, bank transfer) are processed directly by our secure payment gateway partner, <strong>Razorpay</strong>, and are not stored on our servers.</li>
                <li><strong>Communication Logs:</strong> Chat history, WhatsApp chats, support tickets, and general communication with our customer panel.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div id="use" className="space-y-3 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" /> 3. How We Use Your Data
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                We use the information we collect to run our operations, including:
              </p>
              <ul className="list-disc pl-5 text-xs text-slate-600 space-y-2">
                <li>Processing service bookings, dispatching technicians, and tracking repair statuses.</li>
                <li>Generating repair estimates, invoices, and automated payment receipts.</li>
                <li>Sending system alerts, status updates (via SMS, email, or WhatsApp), and payment reminders.</li>
                <li>Answering support queries, processing customer feedback, and conducting quality satisfaction surveys.</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div id="protection" className="space-y-3 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" /> 4. Data Sharing & Protection
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                We do not sell, rent, or trade your personal information with third parties. We only share information with trusted third-party service providers who assist us in operating our CRM system, processing payments (Razorpay), sending notifications (WhatsApp Business API / Twilio), and storing documents (AWS S3 / Cloudinary).
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                We implement industry-standard physical, electronic, and administrative security measures (such as SSL encryption, firewalls, and token authentication) to ensure your personal data is protected against unauthorized access, loss, or alteration.
              </p>
            </div>

            {/* Section 5 */}
            <div id="rights" className="space-y-3 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" /> 5. Your Rights & Choices
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                You have the right to access, update, or request the deletion of your personal data at any time. You can manage your profile settings in our customer portal or contact our support team. Additionally, you can choose to opt-in or opt-out of notifications in your profile settings.
              </p>
            </div>

            {/* Section 6 */}
            <div id="contact" className="space-y-4 border-t border-slate-100 pt-6 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900">
                6. Contact Our Privacy Officer
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                If you have any questions about this Privacy Policy or how we handle your personal data, please reach out to us:
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2 text-xs">
                <p><strong>Email:</strong> privacy@longwell.com</p>
                <p><strong>Phone:</strong> +91 98765 43210</p>
                <p><strong>Address:</strong> Longwell Electronics, 20,000 Sq. Ft. Facility, Bangalore, India</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
