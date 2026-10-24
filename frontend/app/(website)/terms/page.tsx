import Link from 'next/link';
import { Scale, FileSpreadsheet, ShieldAlert, Award, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service - RepairCart',
  description: 'Read the terms and conditions for LED TV repairs, diagnostic visits, and warranty services at RepairCart.',
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
            Terms & Conditions
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Welcome to RepairCart. Please review these terms of service carefully before scheduling diagnostic visits or approving television repairs.
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
              { label: 'Agreement to Terms', href: '#agreement' },
              { label: 'Booking & Repair Services', href: '#repairs' },
              { label: 'Diagnostic Fees & Payment', href: '#payments' },
              { label: 'Service & Parts Warranty', href: '#warranty' },
              { label: 'Limitation of Liability', href: '#liability' },
              { label: 'Governing Law', href: '#law' },
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

          {/* Terms Text */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-sm space-y-10">
            
            {/* Section 1 */}
            <div id="agreement" className="space-y-3 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-600" /> 1. Agreement to Terms
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                By accessing our website (<Link href="/" className="text-blue-600 font-semibold hover:underline">repaircart.co.in</Link>), using the customer portal, or booking an LED TV repair, you agree to be bound by these Terms and Conditions and our Privacy and Refund policies. If you do not agree, please do not use our services.
              </p>
            </div>

            {/* Section 2 */}
            <div id="repairs" className="space-y-3 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-600" /> 2. Booking & Doorstep Service
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                When scheduling a repair, you agree to provide complete and accurate details regarding your contact address, TV brand, screen size, and observable issues.
              </p>
              <ul className="list-disc pl-5 text-xs text-slate-600 space-y-2">
                <li><strong>Doorstep Diagnosis:</strong> A certified technician will visit your location to inspect the television and perform on-site diagnosis.</li>
                <li><strong>Lab Pickup & Safe Transport:</strong> If complex bonding or panel laser repair is required, the television is securely transported to our Noida facility. We perform a physical condition audit at the time of pickup using an OTP verification system.</li>
                <li><strong>Transparent Estimates:</strong> We will provide a transparent estimate before replacing any components. Repairs are executed only after your explicit approval.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div id="payments" className="space-y-3 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-600" /> 3. Inspection Fee & Payment Gateway
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                A standard doorstep diagnostic fee of <strong>₹250</strong> applies. When you approve the repair, this ₹250 inspection fee is completely waived and deducted from your final repair invoice.
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Razorpay Online Processing:</strong> All online payments are handled securely through <strong>Razorpay</strong> via UPI, Credit/Debit Cards, Net Banking, and authorized digital wallets. Invoices are generated upon payment confirmation.
              </p>
            </div>

            {/* Section 4 */}
            <div id="warranty" className="space-y-3 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" /> 4. Service & Parts Warranty Policy
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                RepairCart provides a warranty of up to <strong>45 to 90 days</strong> on repaired hardware components and replaced genuine spare parts (such as LED backlights, motherboards, power boards, and COF bonding).
              </p>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold text-slate-900">
                Warranty exclusions include:
              </p>
              <ul className="list-disc pl-5 text-xs text-slate-600 space-y-2">
                <li>Accidental physical drops, impact breaks, liquid ingress, or cracked screens occurring after delivery.</li>
                <li>Severe electrical voltage surges or unauthorized third-party repairs after our service.</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div id="liability" className="space-y-3 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-blue-600" /> 5. Limitation of Liability
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                RepairCart is committed to highest technical care. However, to the maximum extent permitted by applicable Indian law, RepairCart shall not be held liable for indirect, incidental, or secondary damages, loss of stored media/smart settings, or pre-existing internal board corrosion.
              </p>
            </div>

            {/* Section 6 */}
            <div id="law" className="space-y-3 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-600" /> 6. Governing Law & Jurisdiction
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                These terms are governed by the laws of India. Any disputes or claims arising shall be subject to the exclusive jurisdiction of the competent courts in Noida / Gautam Buddha Nagar, Uttar Pradesh.
              </p>
            </div>

            {/* Section 7 */}
            <div id="contact" className="space-y-4 border-t border-slate-100 pt-6 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900">
                7. Contact & Support Desk
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                For questions regarding these Terms or your service booking, please contact our support team:
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
                  <span><strong>Headquarters & Service Hub:</strong> B-115, Sector-5, Noida, Uttar Pradesh - 201301</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
