'use client';

import { useState } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';

const HOME_FAQS = [
  {
    q: "How quickly can a technician reach my home in Noida?",
    a: "Our certified technicians usually arrive within 2 to 4 hours of your booking confirmation, covering Noida, Greater Noida, and major parts of Delhi NCR."
  },
  {
    q: "Is there a visiting or diagnostics fee?",
    a: "Yes, we charge a basic visit & diagnosis fee of ₹250. However, if you decide to go ahead with the repair service, this fee is fully adjusted in your final repair bill."
  },
  {
    q: "Do you service on Sundays and public holidays?",
    a: "Absolutely! We understand TV emergencies can happen anytime. Our doorstep inspection services are active 7 days a week, from 9:00 AM to 7:00 PM."
  },
  {
    q: "Which brands of televisions do you repair?",
    a: "We service and repair all major brands including Samsung, LG, Sony, Mi, OnePlus, TCL, Vu, Sansui, and more. Our experts handle LED, LCD, Smart, QLED, and OLED TVs."
  },
  {
    q: "Do you provide a warranty on repairs?",
    a: "Yes, we offer a 30-day service warranty on labor and up to 90 days of warranty on genuine spare parts replaced by our technicians."
  },
  {
    q: "How is the pricing decided? Are there hidden charges?",
    a: "We maintain 100% transparent pricing. The final estimate includes spare parts cost and labor charges. We only begin repairs after your explicit approval, ensuring zero hidden fees."
  }
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {HOME_FAQS.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 text-sm sm:text-base hover:bg-slate-50/50 transition-colors"
            >
              <span>{faq.q}</span>
              <span className="shrink-0 ml-4 text-primary-500">
                {isOpen ? (
                  <Minus className="w-5 h-5 transition-transform duration-300" />
                ) : (
                  <Plus className="w-5 h-5 transition-transform duration-300" />
                )}
              </span>
            </button>
            
            <div
              className={`transition-all duration-300 overflow-hidden ${
                isOpen ? 'max-h-40 border-t border-slate-100 bg-slate-50/30' : 'max-h-0'
              }`}
            >
              <p className="p-5 text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                {faq.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
