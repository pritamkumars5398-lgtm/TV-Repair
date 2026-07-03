"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';

import {
  Tv, Zap, Wrench, Monitor, Lightbulb, Sparkles,
  Speaker, Shield, Headphones, Music, Truck, CheckCircle2, ArrowRight,
  Check, Target, TrendingUp, Clock, ShieldCheck, Users, Settings, BarChart, Briefcase, CalendarClock, PhoneCall, Smartphone, Factory,
  Recycle, RefreshCw, Warehouse, PackageCheck, ClipboardCheck, ArrowDown, Building2, CheckSquare, FileText, Activity, ClipboardList, MapPin, Search, Eye, Award, Layers, Video, SearchCode, Tags, Scale
} from 'lucide-react';

import img1 from "../../../assets/img/Picture1.png";
import img2 from "../../../assets/img/Picture2.png";
import img3 from "../../../assets/img/Picture3.png";
import img4 from "../../../assets/img/Picture4.png";
import img5 from "../../../assets/img/Picture5.png";
import img6 from "../../../assets/img/Picture6.png";
import img7 from "../../../assets/img/Picture7.png";
import img8 from "../../../assets/img/Picture8.png";
import img9 from "../../../assets/img/Picture9.png";
import img10 from "../../../assets/img/Picture10.png";
import img11 from "../../../assets/img/Picture11.png";
import img12 from "../../../assets/img/Picture12.png";
import img13 from "../../../assets/img/Picture13.png";
import img14 from "../../../assets/img/Picture14.png";
import img15 from "../../../assets/img/Picture15.png";
import img16 from "../../../assets/img/Picture16.png";
import img17 from "../../../assets/img/Picture17.png";

const solutions = [
  { icon: Target, title: 'One Stop Solution', desc: 'For Services & Products' },
  { icon: Briefcase, title: 'Project Management', desc: 'Expert handling of projects' },
  { icon: TrendingUp, title: 'Resource Optimization', desc: 'Maximum output, minimum waste' },
  { icon: Zap, title: 'Efficiency Enhancement', desc: 'Streamlined operational flow' },
  { icon: Settings, title: 'Ease of Operation', desc: 'User-friendly processes' },
  { icon: Users, title: 'Technician Tracking', desc: 'Real-time staff monitoring' },
  { icon: Monitor, title: 'Login Access', desc: 'Book and Manage Services' },
  { icon: BarChart, title: 'Online Invoice & Billing', desc: 'Digital financial management' },
];

const currentCapabilities = [
  'Product Screening & Repair',
  'Product Refurbishment (ETN)',
  'Parts Cannibalization',
  'PCBs/Component Level Repair',
  'Parts Swap Services',
  'On-site FA Services',
  'On-site Sorting Services',
  'Domestic RMA Services',
  'Domestic Logistics / Transportation',
  'Buffer parts Inventory Management',
  'SWAP / Parts distribution Management'
];

const usps = [
  'Booking of services in just few clicks',
  'Professional Backend Service Infrastructure',
  'TAT (Turn around time) Guarantee',
  'Skilled, Certified & Security cleared manpower',
  'Fully Automatized Process & SOP',
  'Real Time MIS',
  'Customized Solution',
  'Extended Working Hours'
];

const panelFeatures = [
  'Clean Room Class 1000 & 10000 sq ft',
  'ESD safe work environment',
  'CCTV for monitoring product IN & OUT',
  'Biometric Access control',
  'Fire alarm system safety',
  '24x7 Backup power facility',
  'Quality Process oriented work flow',
  'Web enabled software for RMA',
  'Sequel trained Key engineers',
  "Key repair equipment for 19 to 85 inches",
  'Imported consumables',
  'Calibrated instruments'
];

const mobileFeatures = [
  'Clean Room Class 1000 & 10000',
  'ESD safe work environment',
  'CCTV for monitoring product IN & OUT',
  'Biometric Access control',
  'Fire alarm system for safety',
  '24x7 Backup power facility',
  'Quality Process oriented work flow',
  'Web enabled software for RMA',
  'Sequel trained Key engineers',
  "Key repair equipment For MOBILE & Display",
  'Imported consumables',
  'Calibrated instruments'
];

const speakerFeatures = [
  'Production area 13000 sq ft',
  'CCTV for monitoring product IN & OUT',
  'Biometric Access control',
  'Fire alarm system for safety',
  '24x7 Backup power facility',
  'Quality Process oriented work flow',
  'Web enabled software for RMA',
  'Sequel trained Key engineers',
  "Key repair equipment",
  'Imported consumables',
  'Calibrated instruments'
];

const mobileDisplayRefurbishment = [
  "Capability to repair Mobile Phone Displays OGS",
  "Dedicated unit to replace Glasses, Touch Panels",
  "Rectifies Broken Glass, Non working Touch Panel",
  "> 3000 repairs successfully completed for major brands",
  "Aims to support OEMs with quality spares from abroad",
  "Helps OEMs save major costs on Display replacements"
];

const rmaActivities = [
  "Receiving of Defective LCD/LED Panels",
  "Screening (Physical & Functional)",
  "Segregation of IW and OW Panels",
  "Apply RMA for IW Panels",
  "Carry out IW / OW Panel Repairs in the same facility",
  "Shipping to ASPs / ASCs",
  "Buffer Management"
];

const doaManagement = [
  "DOA stocks offer significant opportunity for cost reduction.",
  "Assist in checking these stocks at our Master Location.",
  "Repair & refurbish these products for redeployment."
];

const processQuality = [
  { icon: CheckSquare, text: 'Repair status tracking through Unique ID' },
  { icon: FileText, text: 'Maintenance of Repair History' },
  { icon: Activity, text: 'Corrective & Preventive Actions (PR&R)' },
  { icon: ClipboardList, text: 'Process audit' },
];

const logistics = [
  'We provide Led Tv pickup drop facilities in Delhi NCR.',
  'We maintain TAT for pickup within 24 hours.',
  'We repair All brands like Sony, Samsung, LG, Mi...',
  'We close all calls in Max 7 days.',
  'Partners in NCR: Sargum, Intex, Bajaj, Croma, Reliance'
];

const cleanRoomFeatures = [
  'Class 1000 clean room area of 1000 sq ft',
  'Class 10000 clean room area of 2000 sq ft',
  'Bonding, Cleaning in class 1000 clean room',
  'Assembly in class 2000 Clean Room'
];

const cleanRoomCapacity = [
  'LCD / LED Panel machines to repair up to 85 Inch',
  'Average capacity of 2000 no\'s per month (1 shift)',
  'Total of 6000 no\'s per month on 3 shifts / day'
];

const areaOperations = [
  {
    title: 'IQC, Dismantle Area',
    icon: Search,
    color: 'teal',
    features: [
      'IQC Inspection Capacity of 200 units/day',
      'FTR Inspection Techniques',
      'Process and Report Tracking Software',
      '5S System',
      'Daily MIS Report'
    ]
  },
  {
    title: 'Clean Room Area',
    icon: Award,
    color: 'blue',
    features: [
      'Class 1000 Clean Area Setup',
      'Production Capacity 120 units/day',
      'Process and Report Tracking Software',
      '5S System',
      'Daily Process Audit Report'
    ]
  },
  {
    title: 'Assembly Area',
    icon: Settings,
    color: 'indigo',
    features: [
      'Class 10000 Clean Area Setup',
      'Assembly Capacity of 120 units/day',
      'Process and Report Tracking Software',
      '5S System',
      'Daily Engineer\'s Performance Report'
    ]
  },
  {
    title: 'Workshop Area',
    icon: Wrench,
    color: 'rose',
    features: [
      'Workshop for Main Board, Power Supply',
      'Workshop Capacity of 80 units/day',
      'Process and Report Tracking Software',
      '5S System',
      'Daily MIS Report'
    ]
  }
];

const discrepancyManagement = [
  'Outbound packing recorded through CCTV',
  'Recorded data shared to recipient if discrepancy arises',
  'Small & High value parts packing with Hologram Stickers',
  'Inbound shipment opened under CCTV',
  'Photographs taken if physical discrepancy exists',
  'Consolidated bag key tags monitored until destination'
];

const partnershipProcess = [
  'Continuous measurement through statistical techniques',
  'Controlled documented procedures',
  'Periodical Process audit',
  'Corrective and preventive actions',
  'Failure analysis',
  'Continual improvements',
  'Skills evaluation and mapping'
];

const partnershipQuality = [
  'Performance measurement for all business processes',
  'Well defined audit schedules',
  '100% OQA inspection',
  'Sampling (OBA)'
];

export default function ServicesPage() {
  useEffect(() => {
    AOS.init({ once: true, duration: 800, offset: 100 });
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* Hero */}
      <section className="relative bg-[#020617] text-white pt-28 pb-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0">
          <Image src={img1} alt="Services bg" fill priority className="object-cover opacity-20 mix-blend-luminosity" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary-300/40 via-[#020617]/90 to-[#020617]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center" data-aos="zoom-in">
          <p className="text-primary-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Discover</p>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Our <span className="text-white bg-clip-text bg-gradient-to-r from-primary-400 to-orange-300">Services</span> & Features
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto font-medium leading-relaxed">
            From panel repairs and mobile servicing to high-scale speaker manufacturing, explore the robust infrastructure and unmatched USPs of Longwell Electronics.
          </p>
        </div>
      </section>

      {/* Current Capabilities */}
      <section className="py-0 relative z-10 -mt-16 mx-4 sm:mx-auto max-w-6xl">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-10" data-aos="fade-up">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900">Current Capabilities</h2>
            <p className="mt-1.5 text-slate-500 text-xs font-medium uppercase tracking-wider">Total Solutions</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {currentCapabilities.map((cap, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700 transition-colors">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary-500" /> {cap}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions For You */}
      <section className="py-20 relative overflow-hidden bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-2xl font-extrabold text-slate-900">Solution <span className="text-primary-600">For You</span></h2>
            <p className="text-slate-500 text-sm font-medium max-w-2xl mx-auto mt-2">Comprehensive operational and management solutions designed to streamline your business workflow.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {solutions.map((item, i) => (
              <div key={i} data-aos="fade-up" data-aos-delay={i * 50} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-primary-200 hover:bg-slate-50 transition-all group">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-600 transition-colors border border-primary-100">
                  <item.icon className="w-5 h-5 text-primary-600 group-hover:text-white transition-colors" strokeWidth={2} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">{item.title}</h3>
                <p className="text-xs font-medium text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parts Discrepancy Management */}
      <section className="relative py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-black overflow-hidden">

        {/* Background Effects */}
        <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-red-600/20 blur-[140px]" />
        <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-blue-600/20 blur-[160px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left Side */}
            <div data-aos="fade-right">

              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-red-500/20 bg-red-500/10 mb-6">
                <Video className="w-5 h-5 text-red-400" />
                <span className="text-red-300 text-sm font-semibold tracking-wide">
                  Quality Control System
                </span>
              </div>

              <h2 className="text-5xl font-extrabold text-white leading-tight">
                Parts
                <br />
                <span className="text-red-400">
                  Discrepancy
                </span>
                <br />
                Management
              </h2>

              <p className="mt-6 text-lg text-slate-300 leading-8 max-w-xl">
                Our advanced inventory verification process ensures every component is
                tracked with complete transparency, minimizing errors and delivering
                accurate repair operations.
              </p>

              <div className="mt-10 flex gap-8">

                <div>
                  <h3 className="text-4xl font-bold text-red-400">
                    99.9%
                  </h3>
                  <p className="text-slate-400 mt-2">
                    Inventory Accuracy
                  </p>
                </div>

                <div>
                  <h3 className="text-4xl font-bold text-red-400">
                    24×7
                  </h3>
                  <p className="text-slate-400 mt-2">
                    Tracking System
                  </p>
                </div>

              </div>

            </div>

            {/* Right Side */}

            <div className="grid sm:grid-cols-2 gap-6">

              {discrepancyManagement.map((text, i) => (

                <div
                  key={i}
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 transition-all duration-500 hover:-translate-y-2 hover:border-red-500/40 hover:bg-white/10 hover:shadow-[0_20px_60px_rgba(239,68,68,0.2)]"
                >

                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-red-500/10 via-transparent to-transparent" />

                  <div className="relative">

                    <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">

                      {i === 2 ? (
                        <Tags className="w-7 h-7 text-red-400" />
                      ) : (
                        <SearchCode className="w-7 h-7 text-red-400" />
                      )}

                    </div>

                    <p className="text-slate-200 leading-7">
                      {text}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>
      </section>

      <section className="relative py-24 bg-white">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT */}
            <div data-aos="fade-right">

              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-sm font-semibold mb-8">
                Precision & Quality
              </div>

              <h2 className="text-5xl font-black leading-tight text-slate-900 mb-6">
                Process &
                <span className="block text-blue-600">
                  Quality Control
                </span>
              </h2>

              <p className="text-slate-600 text-lg leading-8 mb-10 max-w-xl">
                We maintain service excellence through process control,
                inspection systems and continuous quality monitoring.
              </p>

              <div className="grid sm:grid-cols-2 gap-5">

                {processQuality.map((item, index) => (
                  <div
                    key={index}
                    className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
              transition
              duration-300
              hover:border-blue-300
              hover:-translate-y-1
              "
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-blue-600" />
                    </div>

                    <p className="text-sm text-slate-700 font-medium leading-7">
                      {item.text}
                    </p>
                  </div>
                ))}

              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div data-aos="fade-left">

              <div
                className="
          relative
          h-[350px]
          lg:h-[500px]
          rounded-[28px]
          overflow-hidden
          border
          border-slate-200
          "
              >

                <Image
                  src={img2}
                  alt="Quality Control"
                  fill
                  className="object-cover transition duration-700 hover:scale-[1.03]"
                />

                <div
                  className="
            absolute
            bottom-6
            left-6
            right-6
            bg-white/95
            rounded-2xl
            border
            border-slate-200
            p-5
            "
                >

                  <h4 className="text-xl font-bold text-slate-900 mb-2">
                    100% Quality Validation
                  </h4>

                  <p className="text-slate-600 text-sm leading-7">
                    Every production and repair cycle is verified before final delivery.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Centers Overview */}
      <section className="py-20 relative bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-2xl font-extrabold text-slate-900">World-Class <span className="text-primary-600">Facilities</span></h2>
            <p className="text-slate-500 text-sm font-medium mt-2">State-of-the-art repair and manufacturing centers equipped with cutting-edge technology.</p>
          </div>

          <div className="space-y-16">
            {/* Panel Repair */}
            <div className="grid lg:grid-cols-2 gap-8 items-center bg-white p-8 rounded-2xl border border-slate-200 shadow-sm" data-aos="fade-up">
              <div className="order-2 lg:order-1 relative h-[300px] rounded-xl overflow-hidden shadow-sm border border-slate-100">
                <Image src={img3} alt="Panel Repair Center" fill className="object-cover" />
              </div>
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 font-bold text-xs mb-4 border border-primary-100">
                  <Tv className="w-3.5 h-3.5" /> Panel Repair Center
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Advanced Panel Repair Features</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {panelFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                      <span className="text-slate-600 text-[11px] font-medium leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Mobile Repair */}
            <div className="grid lg:grid-cols-2 gap-8 items-center bg-white p-8 rounded-2xl border border-slate-200 shadow-sm" data-aos="fade-up">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 font-bold text-xs mb-4 border border-blue-100">
                  <Smartphone className="w-3.5 h-3.5" /> MOBILE Repair Center
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Mobile & Display Repair Features</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {mobileFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span className="text-slate-600 text-[11px] font-medium leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative h-[300px] rounded-xl overflow-hidden shadow-sm border border-slate-100">
                <Image src={img4} alt="Mobile Repair Center" fill className="object-cover" />
              </div>
            </div>

            {/* Speaker Mfg */}
            <div className="grid lg:grid-cols-2 gap-8 items-center bg-white p-8 rounded-2xl border border-slate-200 shadow-sm" data-aos="fade-up">
              <div className="order-2 lg:order-1 relative h-[300px] rounded-xl overflow-hidden shadow-sm border border-slate-100">
                <Image src={img5} alt="Speaker Manufacture" fill className="object-cover" />
              </div>
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 font-bold text-xs mb-4 border border-orange-100">
                  <Factory className="w-3.5 h-3.5" /> Speaker & Intercom
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Manufacturing Features</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {speakerFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                      <span className="text-slate-600 text-[11px] font-medium leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* USP Section */}
      <section className="py-20 bg-[#020617] relative overflow-hidden text-white border-y border-slate-800">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900/20 via-[#020617] to-[#020617]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <h2 className="text-3xl font-extrabold mb-4">Our <span className="text-primary-400">USP</span></h2>
              <p className="text-slate-400 text-sm font-medium mb-6 leading-relaxed">
                We pride ourselves on offering unmatched service quality, speed, and reliability. Here is why industry leaders choose us.
              </p>
              <div className="flex flex-col gap-3">
                {usps.map((usp, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="mt-0.5 bg-primary-500/20 rounded-md p-1 shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-primary-400" />
                    </div>
                    <p className="text-slate-200 text-xs font-medium leading-snug">{usp}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative" data-aos="fade-left">
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl border border-white/10">
                <Image src={img6} alt="USP" fill className="object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white text-slate-900 p-5 rounded-xl shadow-md border border-slate-100">
                <div className="flex items-center gap-3 mb-1">
                  <div className="bg-emerald-100 text-emerald-600 p-1.5 rounded-lg">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm">Guaranteed TAT</h4>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">Fast turnarounds with quality control.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operational Areas Overview */}
      <section className="py-20 relative bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-2xl font-extrabold text-slate-900">Core Operational <span className="text-primary-600">Areas</span></h2>
            <p className="text-slate-500 text-sm font-medium mt-2 max-w-2xl mx-auto">Standardized 5S workflows and reporting across all our critical facility areas.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {areaOperations.map((area, idx) => (
              <div key={idx} data-aos="fade-up" data-aos-delay={idx * 50} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-${area.color}-50 text-${area.color}-600 border border-${area.color}-100`}>
                  <area.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-4">{area.title}</h3>
                <div className="space-y-2.5">
                  {area.features.map((feat, i) => (
                    <div key={i} className="flex gap-2 text-slate-500 text-[11px] font-medium items-start">
                      <Eye className={`w-3 h-3 text-${area.color}-500 shrink-0 mt-0.5`} />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Display Refurbishment */}
      {/* Mobile Display Refurbishment */}
      <section className="relative py-24 bg-white overflow-hidden">

        {/* Soft Glow */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-50 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-cyan-50 blur-[150px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6">

          {/* Heading */}
          <div
            className="text-center mb-16"
            data-aos="fade-up"
          >

            <span className="
      inline-flex
      px-5
      py-2
      rounded-full
      bg-blue-50
      border
      border-blue-100
      text-blue-700
      font-semibold
      text-sm
      mb-5
      ">
              Specialized Services
            </span>

            <h2 className="text-5xl font-black text-slate-900">

              Repair & Refurbishment of

              <span className="block text-blue-600">
                Mobile Displays
              </span>

            </h2>

            <p className="mt-5 text-slate-500 max-w-2xl mx-auto">
              Advanced display restoration, repair and refurbishment powered by
              modern equipment and strict quality control.
            </p>

          </div>

          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* LEFT IMAGES */}
            <div
              data-aos="fade-right"
              className="grid grid-cols-2 gap-5"
            >

              <div className="space-y-5">

                <div className="relative h-[220px] rounded-[28px] overflow-hidden group border border-slate-200">

                  <Image
                    src={img7}
                    alt=""
                    fill
                    className="
              object-cover
              transition
              duration-700
              group-hover:scale-105
              "
                  />

                </div>

                <div className="relative h-[320px] rounded-[28px] overflow-hidden group border border-slate-200">

                  <Image
                    src={img8}
                    alt=""
                    fill
                    className="
              object-cover
              transition
              duration-700
              group-hover:scale-105
              "
                  />

                </div>

              </div>

              <div className="space-y-5 pt-12">

                <div className="relative h-[320px] rounded-[28px] overflow-hidden group border border-slate-200">

                  <Image
                    src={img9}
                    alt=""
                    fill
                    className="
              object-cover
              transition
              duration-700
              group-hover:scale-105
              "
                  />

                </div>

                <div className="relative h-[220px] rounded-[28px] overflow-hidden group border border-slate-200">

                  <Image
                    src={img10}
                    alt=""
                    fill
                    className="
              object-cover
              transition
              duration-700
              group-hover:scale-105
              "
                  />

                </div>

              </div>

            </div>

            {/* RIGHT FEATURES */}
            <div
              data-aos="fade-left"
              className="space-y-5"
            >

              {mobileDisplayRefurbishment.map((item, index) => (

                <div
                  key={index}
                  className="
            flex
            items-start
            gap-4
            rounded-2xl
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

                  <div
                    className="
              w-12
              h-12
              rounded-xl
              bg-blue-50
              flex
              items-center
              justify-center
              shrink-0
              "
                  >

                    <ShieldCheck className="w-5 h-5 text-blue-600" />

                  </div>

                  <p className="text-slate-600 leading-7 text-sm font-medium">
                    {item}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </div>
      </section>

      {/* Logistics and Pickup */}
      {/* Logistics & Support */}
      <section className="py-24 bg-white relative overflow-hidden border-y border-white">

        {/* Background Blur */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-orange-300/20 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6">

          <div className="grid lg:grid-cols-12 gap-14 items-center">

            {/* Images */}
            <div
              className="lg:col-span-7 order-2 lg:order-1"
              data-aos="fade-right"
            >

              <div className="grid grid-cols-2 gap-6">

                <div className="relative h-[450px] rounded-3xl bg-white p-3 shadow-2xl border border-slate-200 overflow-hidden group">
                  <Image
                    src={img11}
                    alt="Pickup Van"
                    fill
                    className="object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="relative h-[450px] rounded-3xl bg-white p-3 shadow-2xl border border-slate-200 overflow-hidden group">
                  <Image
                    src={img12}
                    alt="Service Center"
                    fill
                    className="object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

              </div>

            </div>

            {/* Text */}
            <div
              className="lg:col-span-5 order-1 lg:order-2"
              data-aos="fade-left"
            >

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-amber-200 shadow-sm mb-6">

                <Truck className="w-4 h-4 text-amber-600" />

                <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
                  Logistics & Support
                </span>

              </div>

              <h2 className="text-4xl font-bold text-slate-900 leading-tight mb-5">

                LED TV Pickup
                <br />

                <span className="text-amber-600">
                  & Drop Services
                </span>

              </h2>

              <p className="text-slate-600 leading-7 mb-8">
                Fast, secure and professional logistics support across Delhi NCR.
                Our trained team ensures safe pickup, transit and doorstep delivery
                with complete tracking.
              </p>

              <div className="space-y-4">

                {logistics.map((item, i) => (

                  <div
                    key={i}
                    data-aos="fade-up"
                    data-aos-delay={i * 80}
                    className="flex items-start gap-4 rounded-2xl bg-white p-4 border border-amber-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">

                      <MapPin className="w-5 h-5 text-amber-600" />

                    </div>

                    <p className="text-sm leading-6 text-slate-700 font-medium">
                      {item}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* DOA & Recycling Workflows */}
      <section className="py-20 bg-slate-50 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-2xl font-extrabold text-slate-900">Management & <span className="text-primary-600">Recycling</span></h2>
            <p className="text-slate-500 text-sm font-medium mt-2 max-w-2xl mx-auto">Structured workflows to handle DOA effectively and responsibly recycle beyond repair products.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* DOA Management */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200" data-aos="fade-up">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 border border-blue-100">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">DOA Management</h3>
              <div className="space-y-2 mb-8">
                {doaManagement.map((text, i) => (
                  <p key={i} className="text-slate-500 text-xs font-medium leading-relaxed flex gap-2 items-start">
                    <span className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 shrink-0" /> {text}
                  </p>
                ))}
              </div>

              <div className="relative h-48 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                <Image src={img13} alt="DOA" fill className="object-cover" />
              </div>
            </div>

            {/* Recycling */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200" data-aos="fade-up" data-aos-delay="100">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 border border-emerald-100">
                <Recycle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Recycling of Products</h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed mb-8">
                Longwell electronics can assist its partners in recycling the "Beyond Economic Repair" products in an appropriate and environmentally friendly manner.
              </p>

              <div className="relative h-48 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                <Image src={img14} alt="Recycling" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden mx-4 sm:mx-auto max-w-5xl mb-8 rounded-2xl bg-[#020617] text-white shadow-xl border border-slate-800" data-aos="zoom-in">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-900/40 via-[#020617] to-[#020617]" />
        <div className="mx-auto max-w-2xl px-4 relative text-center">
          <h2 className="text-2xl font-extrabold mb-3">Ready to work with the best?</h2>
          <p className="text-slate-400 text-sm font-medium mb-8 max-w-lg mx-auto">Get in touch with our experts to discuss how our state-of-the-art facilities can handle your requirements.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white text-sm font-bold rounded-md shadow-sm hover:bg-primary-700 transition-all border border-transparent">
            Contact Us Today <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
