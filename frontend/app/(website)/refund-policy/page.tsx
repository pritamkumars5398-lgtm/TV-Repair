import Link from 'next/link';
import { RefreshCw, Clock, AlertCircle, ShieldCheck, Mail, Phone, MapPin, ChevronRight, HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Refund and Cancellation Policy - RepairCart',
  description: 'Understand the cancellation and refund policy for LED TV repair services, diagnostic charges, and parts warranty at RepairCart.',
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-[#020617] text-white border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-[#020617] to-[#020617]" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 mb-4">
            <RefreshCw className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Refund & Cancellation Policy
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            At RepairCart, we strive to deliver transparent, reliable, and premium LED TV repair services. Here is our policy regarding service cancellations and payment refunds.
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
              { label: 'Overview', href: '#overview' },
              { label: 'Cancellation Policy', href: '#cancellation' },
              { label: 'Inspection / Visit Charges', href: '#visiting-fee' },
              { label: 'Refund Eligibility & Process', href: '#refunds' },
              { label: 'Warranty & Replacement', href: '#warranty' },
              { label: 'Support & Queries', href: '#contact' },
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

          {/* Main Card Content */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-sm space-y-10">

            {/* Section 1 */}
            <div id="overview" className="space-y-3 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" /> 1. Overview
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                This Refund and Cancellation Policy applies to all service requests, doorstep diagnostic visits, TV repairs, and component replacements booked via <Link href="/" className="text-blue-600 font-semibold hover:underline">repaircart.co.in</Link> or our customer support hotline.
              </p>
            </div>

            {/* Section 2 */}
            <div id="cancellation" className="space-y-4 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" /> 2. Cancellation Policy
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Customers may cancel or reschedule their service appointment subject to the following conditions:
              </p>
              <ul className="list-disc pl-5 text-xs text-slate-600 space-y-2">
                <li>
                  <strong>Before Technician Dispatch:</strong> You can cancel your booked service free of charge up to 2 hours before the scheduled appointment time or prior to technician departure.
                </li>
                <li>
                  <strong>After Technician Dispatch:</strong> If a technician is already en route or has arrived at your address, the doorstep visiting/inspection fee of ₹250 will be applicable to cover travel and technician time.
                </li>
                <li>
                  <strong>During TV Pickup / In-Facility Diagnostics:</strong> If you cancel a repair after approving TV pickup to our service lab, a nominal pickup & return logistics charge (₹350) will apply if repair is declined.
                </li>
              </ul>
            </div>

            {/* Section 3 */}
            <div id="visiting-fee" className="space-y-3 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" /> 3. Diagnostic & Inspection Fee
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our door-to-door diagnostic visit fee is <strong>₹250</strong>. 
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Important Note:</strong> If you proceed with the repair estimate provided by our technician, the ₹250 diagnostic fee is <strong>fully adjusted / waived off</strong> against your final repair invoice. If you decide not to proceed with the repair after on-site diagnosis, the ₹250 inspection fee is non-refundable as it covers the technician&apos;s physical time and diagnosis effort.
              </p>
            </div>

            {/* Section 4 */}
            <div id="refunds" className="space-y-4 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-blue-600" /> 4. Refund Eligibility & Timeline
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Refunds are processed in the following situations:
              </p>
              <ul className="list-disc pl-5 text-xs text-slate-600 space-y-2">
                <li>
                  <strong>Advance Online Payments:</strong> If you paid in advance online via Razorpay (UPI, Card, NetBanking) and cancelled before technician dispatch, a 100% full refund is initiated.
                </li>
                <li>
                  <strong>Unresolvable Hardware Fault:</strong> If we collected your TV for repair but the panel/motherboard cannot be repaired or genuine replacement components are obsolete/unavailable, any repair advance received (excluding the basic pickup charge) will be promptly refunded.
                </li>
                <li>
                  <strong>Double Payment / Transaction Failure:</strong> In case of duplicate debits or technical errors during Razorpay online transactions, the extra amount is automatically refunded.
                </li>
              </ul>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900">
                <p className="font-semibold mb-1">⏱ Refund Processing Time:</p>
                <p>
                  Once approved, refunds are credited back to the customer&apos;s <strong>original payment method</strong> (Bank Account, UPI, or Credit/Debit Card) within <strong>5 to 7 working days</strong>, as per standard banking and Razorpay payment gateway settlement guidelines.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div id="warranty" className="space-y-3 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" /> 5. Warranty & Post-Repair Support
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                All repairs performed by RepairCart include up to a <strong>45 to 90 days service & parts warranty</strong>. If the identical fault reoccurs within the warranty period, we will re-service or replace the defective part at zero additional charge. Warranty does not cover accidental physical impact, screen crack, external electrical surges, or water seepage.
              </p>
            </div>

            {/* Section 6 */}
            <div id="contact" className="space-y-4 border-t border-slate-100 pt-6 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900">
                6. Contact for Cancellation or Refund Requests
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                To request a cancellation, reschedule, or check the status of your refund, please contact our support desk with your Ticket / Booking ID:
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
                  <span><strong>Service Center & Registered Office:</strong> C-295, Sector-10, Noida, Uttar Pradesh - 201301</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
