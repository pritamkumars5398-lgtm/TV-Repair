import { Scale, ChevronRight, Mail, Phone, MapPin, Globe } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions - RepairCart',
  description: 'Read the terms and conditions for LED TV inspection, repair, pickup and delivery services provided by Repair Cart, operated by Inchell Corporation.',
};

type TermsSection = {
  id: string;
  title: string;
  text?: string;
  points?: string[];
};

const sections: TermsSection[] = [
  {
    id: 'customer-details',
    title: 'Customer Details & Address',
    text: 'Customers must provide accurate contact details, email address and complete pickup/delivery address. Any change in address or contact details must be communicated to Repair Cart before service completion.',
  },
  {
    id: 'warranty',
    title: 'Repair Warranty – 45 Days',
    points: [
      'Repair Cart provides a 45-day warranty on the specific fault repaired, starting from the date of delivery.',
      'The warranty covers the same repaired fault only.',
      'New or unrelated faults, physical damage, liquid damage, voltage fluctuations, mishandling or damage caused by external factors are not covered.',
      'Warranty claims are subject to inspection and verification by Repair Cart.',
      'Any additional repair or replacement outside the original fault will be chargeable.',
    ],
  },
  {
    id: 'dead-tv',
    title: 'Dead TV & Backlight-Off Cases',
    points: [
      'In cases where the TV is completely dead or the display does not turn on, the actual condition of the display panel and internal components may not be confirmed during the initial inspection.',
      'Repair Cart will inspect the TV after receiving it at its repair facility.',
      'If any existing display damage or other internal damage is identified, the customer will be informed before proceeding with the repair, wherever reasonably possible.',
      'Repair Cart will not be responsible for pre-existing defects or damage.',
    ],
  },
  {
    id: 'charges',
    title: 'Inspection & Pickup/Drop Charges',
    points: [
      'A service visit/inspection charge of ₹250 is applicable.',
      'If the customer approves the repair, the ₹250 inspection charge will be adjusted against the repair bill.',
      'If the customer declines the repair, the inspection charge of ₹250 will remain payable.',
      'Applicable pickup and delivery charges will be charged separately and communicated to the customer.',
      'Pickup and delivery charges are payable even if the customer subsequently declines the repair.',
    ],
  },
  {
    id: 'repair-risks',
    title: 'Repair-Related Risks',
    points: [
      'LED TV repair involves handling delicate electronic components, display assemblies, connectors and internal circuits.',
      'During the repair process, certain pre-existing weaknesses or hidden defects may become apparent.',
      'In rare cases, an existing fault or fragile component may deteriorate or suffer additional damage during repair attempts.',
      'Repair Cart will take reasonable precautions and exercise due care during the repair process. Any identified risk will be communicated to the customer wherever reasonably possible.',
    ],
  },
  {
    id: 'internal-damage',
    title: 'Internal Damage & Dead TV Inspection',
    points: [
      'For completely dead TVs or cases with suspected internal damage, the final assessment will be conducted at the Repair Cart facility after receiving the TV.',
      'Any additional damage or defect identified during inspection will be communicated to the customer before proceeding with further chargeable work, wherever possible.',
    ],
  },
  {
    id: 'unapproved-repair',
    title: 'TV Condition After Unapproved Repair',
    points: [
      'If a customer does not approve the proposed repair, the TV will be returned in its assessed condition.',
      'In certain cases, due to diagnostic testing or necessary repair attempts, the TV may not function or display exactly as it did before inspection.',
      'Repair Cart will communicate any such condition changes to the customer and will exercise reasonable care while handling the TV.',
    ],
  },
  {
    id: 'spare-parts',
    title: 'Spare Parts & Components',
    points: [
      'Repair Cart may use original, compatible or equivalent-quality spare parts depending on availability, technical compatibility and customer approval.',
      'Wherever a particular brand or specification of spare part is requested, its availability and price will be confirmed before installation.',
      'The repair may be declared unrepairable if the required spare part is unavailable or technically unsuitable.',
    ],
  },
  {
    id: 'refunds',
    title: 'Payment Refund Policy',
    points: [
      'Any eligible refund of payment will be processed through UPI/bank transfer within 72 hours of refund approval.',
      'Refunds will be made to the original payment source or another verified payment method agreed upon by Repair Cart.',
      "Applicable payment gateway or banking processing delays may be outside Repair Cart's control.",
    ],
  },
  {
    id: 'branding',
    title: 'Company Name, Logo & Branding',
    text: "Repair Cart's company name, logo, contact details and branding must be displayed correctly on all official invoices, receipts, communication and service documents.",
  },
  {
    id: 'remote-approval',
    title: 'Remote Approval Before Repair',
    points: [
      'Repair Cart will obtain customer approval before proceeding with any chargeable repair.',
      'Approval may be obtained through a recorded phone confirmation, WhatsApp message, SMS or email.',
      'Repair work involving additional costs will require separate customer approval.',
      'No chargeable repair work will be undertaken without customer approval, except for necessary non-destructive diagnostic checks previously disclosed to the customer.',
    ],
  },
  {
    id: 'no-work-without-approval',
    title: 'No Work Without Approval',
    text: 'If the customer does not provide the required repair approval, Repair Cart will not proceed with the proposed repair. Applicable inspection, pickup and delivery charges will remain payable.',
  },
  {
    id: 'smart-tv-data',
    title: 'Smart TV Data & Software',
    points: [
      'During repair, software-related issues, factory resets, firmware updates or motherboard replacement may result in the loss of stored data, applications, account information, settings and personal configurations.',
      'Customers are advised to back up their important data and account information before handing over the TV.',
      'Customers should also keep their login credentials and passwords secure.',
      'Repair Cart will take reasonable precautions but cannot guarantee the preservation of customer data during necessary repair procedures.',
    ],
  },
  {
    id: 'service-scope',
    title: 'Business Nature & Service Scope',
    text: 'Repair Cart operates primarily as an LED TV inspection and repair service provider. Services may include display panel repair, backlight repair, motherboard repair, power supply repair, component replacement and other related electronic repair services, depending on technical feasibility.',
  },
  {
    id: 'contact-information',
    title: 'Contact Information',
    text: 'Customers should provide an active mobile number and email address so that Repair Cart can communicate inspection results, repair approvals, payment updates, delivery schedules and service-related information.',
  },
  {
    id: 'unrepairable',
    title: 'Spare Parts Unavailability & Unrepairable Cases',
    points: [
      'If the required spare part is unavailable, discontinued or technically unsuitable, Repair Cart may declare the TV unrepairable.',
      'If the customer declines the quoted repair cost, the TV will be returned after payment of applicable inspection and logistics charges.',
      'If the customer declines repair due to spare-part unavailability, no repair charges will be collected.',
      'Any advance payment received for an unperformed repair will be refunded according to the refund policy.',
    ],
  },
  {
    id: 'data-accessories',
    title: 'Data Backup, Accessories & TV Handling',
    points: [
      'Customers are advised to back up their Smart TV data, remove personal USB devices and secure their account credentials before handing over the TV.',
      'Customers should inform Repair Cart about any existing physical damage, missing components or functional issues.',
      'All remotes, cables, stands and other accessories handed over must be recorded on the job sheet.',
      'Repair Cart will take reasonable care of the TV and accessories while they are in its custody.',
    ],
  },
  {
    id: 'complaints',
    title: 'Complaints, Customer Support & Escalation',
    points: [
      "Customers can raise complaints or service-related concerns through Repair Cart's official customer support channels.",
      'Every complaint will be registered and reviewed by the customer support team.',
      'Repair Cart will aim to acknowledge complaints within 24–48 working hours and provide an appropriate resolution or update.',
      'If the customer is not satisfied with the initial resolution, the complaint may be escalated to the service manager or management team.',
      'All complaints will be reviewed fairly and resolved in accordance with the applicable service warranty and consumer protection laws.',
    ],
  },
  {
    id: 'general',
    title: 'General Conditions',
    points: [
      'Repair estimates, spare-part availability and delivery timelines are subject to technical inspection and availability of components.',
      'Any additional repair work or cost must be communicated to the customer for approval.',
      'These Terms & Conditions shall be governed by the applicable laws of India.',
      'Nothing in these terms shall limit any statutory rights available to consumers under applicable Indian law.',
    ],
  },
];

function SectionLinks() {
  return (
    <>
      {sections.map((section, idx) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className="flex items-start gap-2 px-3 py-2 text-xs font-semibold text-slate-600 rounded-lg hover:bg-slate-100 hover:text-blue-600 transition-colors"
        >
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
          {idx + 1}. {section.title}
        </a>
      ))}
    </>
  );
}

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
          <p className="text-blue-300 text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-3">
            Repair Cart
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Terms & Conditions
          </h1>
          <p className="text-blue-300 text-sm md:text-base font-semibold">
            LED TV Repair Services
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <span>Last Updated: November 2026</span>
            <span>•</span>
            <span>Version 3.0</span>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-10 md:py-16 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-[260px_minmax(0,1fr)] gap-6 md:gap-10 items-start">

          {/* Quick Navigation Sidebar */}
          <aside className="sticky top-24 hidden md:block max-h-[calc(100vh-7rem)] overflow-y-auto space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 px-3">
              Sections
            </h3>
            <SectionLinks />
          </aside>

          {/* Quick Navigation for Mobile */}
          <details className="md:hidden bg-white border border-slate-200 rounded-2xl shadow-sm">
            <summary className="cursor-pointer px-5 py-4 text-sm font-bold text-slate-900">
              Jump to a section
            </summary>
            <div className="px-2 pb-3 space-y-1">
              <SectionLinks />
            </div>
          </details>

          {/* Terms Text */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-10">

            <div className="space-y-3 border-b border-slate-100 pb-8 text-sm text-slate-600 leading-relaxed">
              <p>
                These Terms & Conditions apply to all LED TV inspection, repair, pickup and delivery services provided by Repair Cart, operated by Inchell Corporation.
              </p>
              <p>
                By booking a repair service or handing over a television to Repair Cart, the customer agrees to the following terms and conditions.
              </p>
            </div>

            {sections.map((section, idx) => (
              <div key={section.id} id={section.id} className="space-y-3 scroll-mt-24">
                <h2 className="text-lg md:text-xl font-bold text-slate-900">
                  {idx + 1}. {section.title}
                </h2>
                {section.text && (
                  <p className="text-sm text-slate-600 leading-relaxed">{section.text}</p>
                )}
                {section.points && (
                  <ul className="list-disc pl-5 text-sm text-slate-600 leading-relaxed space-y-2">
                    {section.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Company Details */}
            <div id="contact" className="space-y-4 border-t border-slate-100 pt-8 scroll-mt-24">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-slate-900">Fix It Right</h2>
                <p className="text-sm text-slate-600 mt-1">Operated by Inchell Corporation</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>B-115, Sector 5, Noida, Uttar Pradesh – 201301</span>
                </div>
                <div className="flex items-start gap-2">
                  <Globe className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Website:</strong> <a href="https://www.repaircart.co.in" className="text-blue-600 hover:underline">www.repaircart.co.in</a></span>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Email:</strong> <a href="mailto:support@repaircart.co.in" className="text-blue-600 hover:underline">support@repaircart.co.in</a></span>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Customer Support:</strong> <a href="tel:+918586887887" className="hover:underline">8586 887 887</a> / <a href="tel:+918586807887" className="hover:underline">8586 807 887</a></span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
