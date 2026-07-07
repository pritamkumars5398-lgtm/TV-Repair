import React from 'react';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

const journey = [
  { year: '1984', title: 'Audio Cassettes' },
  { year: '1987', title: 'Push button phone' },
  { year: '1992', title: 'Walkman & Audio cassette player' },
  { year: '1995', title: 'Video games' },
  { year: '2002', title: 'Intercom' },
  { year: '2004', title: 'Multimedia home theater system' },
  { year: '2008', title: 'LED Bulb' },
  { year: '2014', title: 'Mobile phone' },
  { year: '2018', title: 'LED TV, PCB of AC, Washing machine and other house hold electronics' },
];

const infraFeatures = [
  'We operate in area of 20000sq feet state of art repairing center with latest Testing, Store, Bonding, Polarization machine, clean room and inspection and quality check center.',
  'Esd flooring with esd protecting area.',
  'Class 100K clean room for panel work.',
  'Temprature maintain reliability room.',
  '4000 sq. ft. clean room area.',
  '6000 sq. ft. area for store.',
  '6000 sq. ft. area for production (Speaker, Home theater, Multi line intercom system...)',
  '40ft container can park have big parking space.',
  'Lift facility available for material movement.'
];

const whyUs = [
  'INCHELL CORPARATION provides remarkable quality in products and services at best price. And our wide experience distinguishes us from others.',
  'We have a team of well qualified and experienced service engineers.',
  'Along with repair and manufacturing, Inchell Corparation is Expertise in import and export and marketing assistance for their client.',
  'Inchell Corparation has experts to assist their clients how to reduce after sales cost.',
  'We have office in China also (SHENZHEN), so get Original Spare parts At BEST PRICE.'
];

const strengthsText = 'We have a close relationship with Chinese players from same field who keep us updated with the trends and technology. As we have office in china also so we import and get almost all spare parts from their. This help us to increase our yield percentage.';
const strengths = [
  'Display Repair upto 85Inch LED TV.',
  'Polarizer replacement facility.',
  'Yield up to 85% for field failure units and up to 90% for line rejection.',
  'Development Source for LED TV Strip.',
  'Motherboard repair up to L4 level.',
  'Own CRM for device tracking and repaired Product life cycle management.',
  'Reverse Logistics Management.',
  '100% OQA Inspection & Quality Assurance.'
];

export function CompanyProfile() {
  return (
    <>
      <section className="bg-slate-50 py-24 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="mb-16 text-center" data-aos="fade-up">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Our Journey</h2>
            <div className="mt-4 h-1 w-20 bg-primary-600 mx-auto rounded-full" />
          </div>
          
          <div className="relative border-l-4 border-primary-200 ml-4 md:ml-0 md:border-l-0">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-2 bg-gradient-to-r from-primary-400 via-primary-500 to-emerald-500 -translate-y-1/2 rounded-full" />
            
            <div className="flex flex-col md:flex-row md:justify-between gap-8 md:gap-4 relative z-10">
              {journey.map((item, index) => (
                <div key={item.title} className="relative pl-8 md:pl-0 flex-1 flex flex-col md:items-center text-left md:text-center group" data-aos="zoom-in" data-aos-delay={index * 50}>
                  <div className="absolute left-[-11px] md:left-auto md:top-1/2 md:-translate-y-1/2 w-5 h-5 bg-white border-4 border-primary-600 rounded-full group-hover:scale-150 transition-transform duration-300 z-10 shadow-md" />
                  
                  <div className={`mt-0 md:absolute w-full md:w-[150px] ${index % 2 === 0 ? 'md:bottom-full md:mb-12' : 'md:top-full md:mt-12'}`}>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 group-hover:-translate-y-1 transition-transform">
                      <span className="block text-xl font-bold text-primary-600 mb-1">{item.year}</span>
                      <span className="text-sm font-bold text-slate-700 leading-tight block">{item.title}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24 relative overflow-hidden border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] items-center">
            <div data-aos="fade-right">
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-6">Infrastructure</h2>
              <div className="h-1 w-20 bg-primary-600 rounded-full mb-8" />
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-8">
                <p className="text-lg text-slate-700 font-medium leading-relaxed">{infraFeatures[0]}</p>
              </div>
              <ul className="space-y-4">
                {infraFeatures.slice(1).map((feature, idx) => (
                  <li key={idx} className="flex gap-4 items-start" data-aos="fade-up" data-aos-delay={idx * 50}>
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                    <span className="text-base text-slate-600 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-square lg:aspect-auto lg:h-[700px] rounded-[3rem] overflow-hidden shadow-2xl" data-aos="zoom-in">
              <Image src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1000&q=80" alt="Infrastructure" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-900/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary-900/30 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid gap-16 lg:grid-cols-2">
            <div data-aos="fade-right">
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6">Why Us?</h2>
              <div className="h-1 w-20 bg-primary-500 rounded-full mb-8" />
              <div className="space-y-6">
                {whyUs.map((text, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <p className="text-slate-300 text-lg leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div data-aos="fade-left">
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6">Our Strength</h2>
              <div className="h-1 w-20 bg-primary-500 rounded-full mb-8" />
              <p className="text-slate-300 text-lg leading-relaxed mb-8 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                {strengthsText}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {strengths.map((strength, idx) => (
                  <div key={idx} className="flex items-start gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl">
                    <CheckCircle2 className="h-6 w-6 text-primary-400 shrink-0" />
                    <span className="text-sm font-medium text-slate-200">{strength}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
