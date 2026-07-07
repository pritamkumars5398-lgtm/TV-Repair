import Link from 'next/link';
import { Scale, FileSpreadsheet, ShieldAlert, Award, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service - Inchell Corparation',
  description: 'Read the terms and conditions for TV repairs and electronics manufacturing services at Inchell Corparation.',
};

export default function TermsPage() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-[#020617] text-white border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-[#020617] to-[#020617]" />
        
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 mb-4">
            <Scale className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Welcome to Inchell Corparation. Please read these terms and conditions carefully before booking any repair services or placing manufacturing orders.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <span>Last Updated: July 4, 2026</span>
            <span>•</span>
            <span>Version 1.0</span>
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
              { label: 'Agreement to Terms', href: '#agreement' },
              { label: 'Booking & Repair Services', href: '#repairs' },
              { label: 'Pricing & Online Payment', href: '#payments' },
              { label: 'Warranty Policy', href: '#warranty' },
              { label: 'Limitation of Liability', href: '#liability' },
              { label: 'Governing Law', href: '#law' },
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

          {/* Terms Text */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-sm space-y-10">
            
            {/* Section 1 */}
            <div id="agreement" className="space-y-3 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-600" /> 1. Agreement to Terms
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                By accessing our website (<Link href="/" className="text-blue-600 font-semibold hover:underline">inchell.in</Link>), accessing the Customer Portal, or submitting a service booking, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, you should not access our services.
              </p>
            </div>

            {/* Section 2 */}
            <div id="repairs" className="space-y-3 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-600" /> 2. Booking & Repair Services
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                When booking a service, you must provide accurate, complete information regarding your contact details and the device details (brand, model, description of faults).
              </p>
              <ul className="list-disc pl-5 text-xs text-slate-600 space-y-2">
                <li><strong>Home Visit Booking:</strong> A home visit inspection will be scheduled depending on availability. A technician will assess the TV or electronics device.</li>
                <li><strong>Pickup & Drop Facility:</strong> If you select our pick & drop option, our team will pick up your TV, transport it to our Bangalore facility for diagnosis/repair, and return it. While we take maximum care during transport, we are not liable for pre-existing physical damage.</li>
                <li><strong>Diagnosis & Repair Estimates:</strong> Once the device is inspected, we will generate a repair estimate. You can approve or reject the estimate from the Customer Portal. We will only proceed with the repair upon your approval.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div id="payments" className="space-y-3 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-600" /> 3. Service Visit Fee & Payments
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                The booking request requires a non-refundable **₹250 service visit / diagnostic fee** which will be deducted from your final repair invoice.
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                All payments must be made online via our payment page. We integrate with <strong>Razorpay</strong> to process payments securely using UPI, credit/debit cards, and Net Banking. Payment confirmation must be verified before our technicians deliver the repaired device.
              </p>
            </div>

            {/* Section 4 */}
            <div id="warranty" className="space-y-3 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" /> 4. Limited Warranty Policy
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Inchell Corparation provides a warranty of **up to 90 days** on spare parts replaced during our repair service, unless specified otherwise in your invoice.
              </p>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold text-slate-900">
                What is NOT covered under warranty:
              </p>
              <ul className="list-disc pl-5 text-xs text-slate-600 space-y-2">
                <li>Physical damage, liquid logs (water damage), electrical surges, or tampering/repair by anyone outside of Inchell Corparation.</li>
                <li>Issues unrelated to the specific spare parts replaced during the original repair.</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div id="liability" className="space-y-3 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-blue-600" /> 5. Limitation of Liability
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                To the maximum extent permitted by law, Inchell Corparation and its directors, employees, or partners shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including data loss (e.g. settings or channel configurations), loss of use, or hardware damage arising out of the inspection, diagnostic, or repair process.
              </p>
            </div>

            {/* Section 6 */}
            <div id="law" className="space-y-3 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-600" /> 6. Governing Law
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                These Terms of Service and any service contract entered into with Inchell Corparation are governed by and construed in accordance with the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka.
              </p>
            </div>

            {/* Support section */}
            <div className="border-t border-slate-100 pt-6 text-xs text-slate-500 space-y-2">
              <p>For inquiries regarding our Terms of Service, please contact us at <a href="mailto:support@repaircart.co.in" className="text-blue-600 hover:underline">support@repaircart.co.in</a>.</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
