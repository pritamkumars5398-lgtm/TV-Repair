"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  ArrowRight, ShieldCheck, CheckCircle2, History, Building2,
  MapPin, Settings, Cpu, HardDrive, CircleDot, Zap, Tv, Smartphone, Speaker, Truck
} from 'lucide-react';
import { CompanyProfile } from '@/components/website/CompanyProfile';

import img1 from "../../../assets/img/Picture15.png";
import img2 from "../../../assets/img/Picture16.png";
import img3 from "../../../assets/img/Picture17.png";

const journey = [
  { year: '1984', title: 'Audio Cassettes' },
  { year: '1987', title: 'Push button phone' },
  { year: '1992', title: 'Walkman & Audio cassette player' },
  { year: '1995', title: 'Video games' },
  { year: '2002', title: 'Intercom' },
  { year: '2004', title: 'Multimedia home theater system' },
  { year: '2008', title: 'LED Bulb' },
  { year: '2014', title: 'Mobile phone' },
  { year: '2018', title: 'LED TV, PCB of AC, Washing machine and other household electronics' },
];

const infraFeatures = [
  'We operate in an area of 20,000 sq feet state of art repairing center with latest Testing, Store, Bonding, Polarization machine, clean room and inspection and quality check center.',
  'ESD flooring with ESD protecting area.',
  'Class 100K clean room for panel work.',
  'Temperature maintain reliability room.',
  '4,000 sq. ft. clean room area.',
  '6,000 sq. ft. area for store.',
  '6,000 sq. ft. area for production (Speaker, Home theater, Multi line intercom system...)',
  '40ft container can park in our big parking space.',
  'Lift facility available for material movement.'
];

const whyUs = [
  'LONGWELL ELECTRONICS provides remarkable quality in products and services at best price. And our wide experience distinguishes us from others.',
  'We have a team of well qualified and experienced service engineers.',
  'Along with repair and manufacturing, Longwell Electronics is Expertise in import and export and marketing assistance for their client.',
  'Longwell Electronics has experts to assist their clients how to reduce after sales cost.',
  'We have office in China also (SHENZHEN), so get Original Spare parts At BEST PRICE.'
];

const whatWeDo = [
  'The repairing service includes products like mobile phone (L1,L2,L3/L4 level), LED TV panels, power banks, air conditioner main board, multimedia speakers and many other electronics products which include PCB.',
  'The manufacturing of Portable speaker, Tower speaker, Home theater, Multi line intercom system...',
  'We are equipped with clean room of class 100k, Bonding machine, Polarizer machine, Vacuum machine, BGA Machine, Touch pressing machine and OGS (TOUCH SCREEN).'
];

const strengthsText = "We have a close relationship with Chinese players from same field who keep us updated with the trends and technology. As we have office in china also so we import and get almost all spare parts from there. This helps us to increase our yield percentage.";

const strengths = [
  'Display Repair upto 85Inch LED TV.',
  'Polarizer replacement facility.',
  'Yield up to 85% for field failure units and up to 90% for line rejection.',
  'Development Source for LED TV Strip.',
  'Motherboard repair up to L4 level.',
  'Own CRM for device tracking and repaired Product life cycle management.',
  'Reverse Logistics Management.'
];

const clientele = [
  { name: 'INTEX', color: 'text-red-600 font-black text-2xl tracking-tighter uppercase' },
  { name: 'AIWA', color: 'text-red-500 font-bold text-xl lowercase tracking-widest' },
  { name: 'SANSUI', color: 'text-slate-800 font-bold text-xl uppercase tracking-widest' },
  { name: 'BAJAJ', color: 'text-blue-800 font-bold text-lg bg-blue-50 px-2 rounded border border-blue-100' },
  { name: 'ARGU', color: 'text-blue-500 font-black text-2xl tracking-tighter' },
  { name: 'OSCAR', color: 'text-black font-black text-2xl uppercase tracking-tighter' },
  { name: 'ZEBRONICS', color: 'text-black bg-yellow-400 px-3 py-1 font-bold text-lg uppercase rounded' },
  { name: 'Zopper', color: 'text-slate-800 font-bold text-xl' },
  { name: 'MODISH', color: 'text-red-800 font-serif text-xl uppercase' },
  { name: 'VEEGO', color: 'text-purple-700 font-black text-2xl uppercase' },
  { name: 'FOXSKY', color: 'text-white bg-black px-3 py-1 font-bold text-lg uppercase rounded' },
  { name: 'amazon', color: 'text-black font-bold text-2xl lowercase border-b-4 border-orange-500 pb-0.5' },
  { name: 'MELBON', color: 'text-black font-serif font-black text-xl uppercase' },
  { name: 'croma', color: 'text-white bg-teal-600 px-4 py-1.5 font-bold text-lg lowercase tracking-widest rounded' },
  { name: 'Flipkart', color: 'text-blue-600 font-bold text-2xl italic' },
  { name: 'MURPHY', color: 'text-black font-bold text-xl uppercase italic border-2 border-green-600 px-2.5 py-0.5 rounded' },
  { name: 'F&D', color: 'text-black font-black text-2xl italic' },
  { name: 'Reliance digital', color: 'text-red-600 font-bold text-xl' },
  { name: 'impex', color: 'text-white bg-red-600 px-3 py-1 font-bold text-xl lowercase rounded' },
  { name: 'TMB', color: 'text-white bg-blue-600 px-4 py-1 font-bold text-lg rounded-lg' },
];

export default function AboutPageClient() {
  useEffect(() => {
    AOS.init({ once: true, duration: 800, easing: 'ease-out-cubic', offset: 100 });
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">

      {/* Premium Hero Section */}
      <section className="relative pt-28 pb-32 overflow-hidden bg-[#020617] text-white border-b border-slate-800">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0">
          <Image
            src={img1}
            alt="Facility Background"
            fill
            priority
            className="object-cover opacity-20 mix-blend-luminosity"
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-300/30 via-[#020617]/90 to-[#020617]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-12 items-center">

            {/* Left Content */}
            <div data-aos="fade-right">
              <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-bold text-[10px] uppercase tracking-widest mb-4 border border-cyan-500/20">
                About Us
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-5 leading-tight">
                World class <span className="text-white bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">manufacturing & repair</span> environment.
              </h1>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed font-medium max-w-lg">
                LONGWELL ELECTRONICS has a highly trained team dedicated to providing comprehensive electronics excellence.
              </p>

              <div className="bg-white/5 border-l-2 border-cyan-400 p-4 rounded-r-xl backdrop-blur-md mb-8">
                <p className="text-sm font-bold text-cyan-300 leading-snug">
                  "Quality service and customer satisfaction, we believe the most."
                </p>
              </div>

              <div className="flex gap-3">
                <Link href="/book" className="px-6 py-3 bg-primary-600 text-white text-sm font-bold rounded-md hover:bg-primary-700 transition-all shadow-sm">
                  Book a Repair
                </Link>
                <Link href="/contact" className="px-6 py-3 bg-white/5 text-white text-sm font-bold rounded-md border border-white/10 hover:bg-white/10 transition-all">
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Right Content - Glassmorphism Card */}
            <div data-aos="fade-left" className="relative hidden lg:block">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl">
                <h3 className="text-lg font-extrabold text-white mb-5 border-b border-white/10 pb-3">Our Expertise</h3>
                <div className="space-y-4">
                  {[
                    { icon: Tv, text: 'Refurb and repair of LED TV' },
                    { icon: Smartphone, text: 'Refurb and repair of mobile phones' },
                    { icon: Cpu, text: 'Repair of electronics pcb boards' },
                    { icon: Speaker, text: 'Manufacture Speakers, Home theater, Tower Speaker' },
                    { icon: Truck, text: 'Door to door pickup and drop service' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3 items-center group">
                      <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-primary-500/20 group-hover:border-primary-500/50 transition-colors">
                        <item.icon className="w-4 h-4 text-primary-400 group-hover:text-cyan-300 transition-colors" />
                      </div>
                      <p className="text-slate-300 text-xs font-medium group-hover:text-white transition-colors">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile View for the features */}
            <div className="lg:hidden mt-6 space-y-3">
              {[
                { icon: Tv, text: 'Refurb and repair of LED TV' },
                { icon: Smartphone, text: 'Refurb and repair of mobile phones' },
                { icon: Cpu, text: 'Repair of electronics pcb boards' },
                { icon: Speaker, text: 'Manufacture Speakers, Home theater' },
                { icon: Truck, text: 'Door to door pickup and drop service' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-center bg-white/5 p-3 rounded-xl border border-white/10">
                  <item.icon className="w-4 h-4 text-cyan-400 shrink-0" />
                  <p className="text-slate-300 font-medium text-xs">{item.text}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Our Values Section */}
      {/* Vision & Mission */}
      <section className="py-16 bg-white border-t border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-6">

          <div className="grid md:grid-cols-2 gap-8">

            {/* Vision */}
            <div
              data-aos="fade-up"
              className="rounded-2xl border border-slate-200 bg-slate-50 p-8 hover:border-primary-500 transition-all duration-300"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">

                </div>

                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
                  Our Vision
                </span>
              </div>

              <p className="text-lg font-semibold leading-8 text-slate-900">
                To become the leading electronics repair company by delivering
                reliable, high-quality and customer-focused repair solutions.
              </p>
            </div>

            {/* Mission */}
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              className="rounded-2xl border border-slate-200 bg-slate-50 p-8 hover:border-primary-500 transition-all duration-300"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">

                </div>

                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
                  Our Mission
                </span>
              </div>

              <p className="text-lg font-semibold leading-8 text-slate-900">
                To provide world-class repair services for all major electronics
                brands through skilled professionals, advanced technology and trusted
                customer support.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* What do we do? */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10" data-aos="fade-up">
          <h2 className="text-2xl font-extrabold text-slate-900">What else do we do?</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {whatWeDo.map((item, index) => (
            <div key={index} className="p-6 border border-slate-200 rounded-xl bg-white shadow-sm hover:border-primary-200 hover:shadow-md transition-all group" data-aos="fade-up" data-aos-delay={index * 50}>
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center mb-4 border border-slate-100 group-hover:bg-primary-50 transition-colors">
                {index === 0 ? <Settings className="w-5 h-5 text-slate-600 group-hover:text-primary-600" /> : index === 1 ? <Cpu className="w-5 h-5 text-slate-600 group-hover:text-primary-600" /> : <HardDrive className="w-5 h-5 text-slate-600 group-hover:text-primary-600" />}
              </div>
              <p className="text-slate-600 text-[11px] font-medium leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Our Strength */}
      <section className="relative py-28 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white">

        {/* Background Glow */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-50 blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-cyan-50 blur-[180px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">

          <div className="grid lg:grid-cols-12 gap-14 items-center">

            {/* LEFT */}
            <div
              className="lg:col-span-5"
              data-aos="fade-right"
            >

              <div
                className="
          inline-flex
          items-center
          px-5
          py-2
          rounded-full
          bg-blue-50
          border
          border-blue-100
          text-blue-700
          font-semibold
          mb-8
          "
              >

                Our Excellence

              </div>

              <h2
                className="
          text-5xl
          font-black
          leading-tight
          text-slate-900
          mb-6
          "
              >

                Our
                <span className="block text-blue-600">
                  Strength
                </span>

              </h2>

              <p
                className="
          text-slate-600
          text-lg
          leading-8
          mb-10
          "
              >
                {strengthsText}
              </p>

              {/* Highlight */}
              <div
                className="
          rounded-[28px]
          p-8
          bg-gradient-to-r
          from-blue-600
          to-cyan-600
          text-white
          "
              >

                <div className="flex items-center gap-5">

                  <div
                    className="
              w-16
              h-16
              rounded-2xl
              bg-white/20
              flex
              items-center
              justify-center
              "
                  >

                    <Zap className="w-8 h-8 text-yellow-300" />

                  </div>

                  <div>

                    <h3 className="text-3xl font-black">
                      90%
                    </h3>

                    <p className="text-blue-100">
                      Yield for line rejection parts
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* RIGHT */}
            <div
              className="lg:col-span-7"
              data-aos="fade-left"
            >

              <div className="grid sm:grid-cols-2 gap-5">

                {strengths.map((strength, index) => (

                  <div
                    key={index}
                    className="
              rounded-[24px]
              border
              border-slate-200
              bg-white
              p-6
              hover:border-blue-300
              hover:-translate-y-1
              transition
              duration-300
              "
                  >

                    <div className="flex gap-4">

                      <div
                        className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-blue-50
                  flex
                  items-center
                  justify-center
                  shrink-0
                  "
                      >

                        <CheckCircle2 className="w-6 h-6 text-blue-600" />

                      </div>

                      <p
                        className="
                  text-slate-700
                  leading-7
                  text-sm
                  font-medium
                  "
                      >
                        {strength}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Why Us? */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div data-aos="fade-right">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Why Choose Us?</h2>
              <div className="space-y-3">
                {whyUs.map((reason, index) => (
                  <div key={index} className="flex gap-3 items-start bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                    <p className="text-slate-600 text-xs font-medium leading-relaxed">{reason}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[350px] lg:h-[450px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm" data-aos="fade-left">
              <Image
                src={img2}
                alt="Why us"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10" data-aos="fade-up">
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center justify-center gap-2">
            <Building2 className="w-6 h-6 text-primary-600" /> Massive Infrastructure
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {infraFeatures.map((feature, index) => (
            <div key={index} className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:border-primary-200 transition-colors" data-aos="fade-up" data-aos-delay={index * 50}>
              <CircleDot className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
              <p className="text-slate-600 text-xs font-medium leading-relaxed">{feature}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-28 bg-gradient-to-b from-white to-slate-50 overflow-hidden">

        <div className="max-w-7xl mx-auto px-6">

          {/* Heading */}
          <div className="text-center mb-20" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">
              Our <span className="text-blue-600">Journey</span>
            </h2>

            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mx-auto mt-5" />

            <p className="text-slate-500 mt-4 max-w-xl mx-auto">
              A timeline of milestones that shaped our growth and success.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">

            {/* Center Line (desktop only) */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 rounded-full" />

            {/* Grid Layout (NO SCROLL) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-9 gap-10 md:gap-0">

              {journey.map((item, index) => {
                const isTop = index % 2 === 0;

                return (
                  <div
                    key={index}
                    className="relative flex flex-col items-center text-center"
                  >

                    {/* Top Card */}
                    <div className={`mb-6 ${isTop ? "block" : "hidden md:block md:opacity-0"}`}>
                      <div className="bg-white shadow-md border border-slate-100 rounded-xl p-4 w-44 hover:shadow-lg transition">
                        <p className="text-slate-700 text-sm font-medium">
                          {item.title}
                        </p>
                      </div>
                    </div>

                    {/* Year Circle */}
                    <div className="z-10 w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg flex items-center justify-center shadow-lg border-4 border-white">
                      {item.year}
                    </div>

                    {/* Bottom Card */}
                    <div className={`mt-6 ${!isTop ? "block" : "hidden md:block md:opacity-0"}`}>
                      <div className="bg-white shadow-md border border-slate-100 rounded-xl p-4 w-44 hover:shadow-lg transition">
                        <p className="text-slate-700 text-sm font-medium">
                          {item.title}
                        </p>
                      </div>
                    </div>

                  </div>
                );
              })}

            </div>
          </div>

        </div>
      </section>

      {/* Our Clientele */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">

          {/* Heading */}
          <div className="text-center mb-14" data-aos="fade-up">
            <span className="inline-block px-4 py-1 rounded-full bg-primary-50 text-primary-600 text-xs font-semibold tracking-widest uppercase mb-4">
              Trusted Partners
            </span>

            <h2 className="text-4xl font-bold text-slate-900">
              Our Clientele
            </h2>

            <p className="mt-3 text-slate-600 max-w-2xl mx-auto text-base">
              We proudly provide professional electronics repair and service
              solutions to leading brands and business partners.
            </p>
          </div>

          {/* Clients Slider */}
          <div
            className="relative flex overflow-hidden w-full group py-4"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {/* Edge Fade Masks */}
            <div className="absolute top-0 bottom-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

            <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
              {clientele.map((client, index) => (
                <div
                  key={index}
                  className="flex flex-shrink-0 items-center justify-center h-28 w-48 sm:w-56 mx-3 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <span
                    className={`${client.color} text-center px-4 font-bold tracking-wide grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition whitespace-normal`}
                  >
                    {client.name}
                  </span>
                </div>
              ))}
            </div>

            <div className="absolute top-4 flex animate-marquee2 group-hover:[animation-play-state:paused]">
              {clientele.map((client, index) => (
                <div
                  key={`copy-${index}`}
                  className="flex flex-shrink-0 items-center justify-center h-28 w-48 sm:w-56 mx-3 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <span
                    className={`${client.color} text-center px-4 font-bold tracking-wide grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition whitespace-normal`}
                  >
                    {client.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Text */}
          <div
            className="mt-14 text-center"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <p className="text-sm text-slate-500">
              Trusted by <span className="font-semibold text-slate-900">100+</span>
              {" "}business partners across India.
            </p>
          </div>

        </div>
      </section>


    </div>
  );
}
