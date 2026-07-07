"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";

import infra1 from "../../../assets/img/Picture1.png";
import infra2 from "../../../assets/img/Picture2.png";
import infra3 from "../../../assets/img/Picture3.png";
import infra4 from "../../../assets/img/Picture4.png";
import infra5 from "../../../assets/img/Picture5.png";
import infra6 from "../../../assets/img/Picture12.png"
import infra7 from "../../../assets/img/Picture24.png"
import infra8 from "../../../assets/img/Picture6.png"
import infra9 from "../../../assets/img/Picture7.png"
import infra10 from "../../../assets/img/Picture8.png"
import infra11 from "../../../assets/img/Picture9.png"
import infra12 from "../../../assets/img/Picture24.png"


import {
  Building2,
  Wind,
  ShieldCheck,
  Box,
  Settings,
  ArrowRight,
} from "lucide-react";

const facilities = [
  {
    icon: Building2,
    title: "20,000 Sq. Ft. Area",
    desc: "Sprawling facility designed for high-volume manufacturing and repair.",
  },
  {
    icon: Wind,
    title: "Class 100K Clean Room",
    desc: "Air showered and specialized environments for precise panel bonding.",
  },
  {
    icon: Settings,
    title: "Automated SOPs",
    desc: "Fully automated standard operating procedures ensuring consistent high yield.",
  },
  {
    icon: ShieldCheck,
    title: "OQA Area",
    desc: "Dedicated Outgoing Quality Assurance zone for 100% inspection before dispatch.",
  },
  {
    icon: Box,
    title: "Advanced Packaging",
    desc: "Specialized packaging machines with shrink wrap and wooden boxes.",
  },
];

const images = [infra1, infra2, infra3, infra4, infra5, infra6, infra7, infra11, infra10, infra8, infra9, infra12];

export default function InfrastructurePageClient() {
  useEffect(() => {
    AOS.init({
      once: true,
      duration: 800,
      easing: "ease-out-cubic",
      offset: 100,
    });
  }, []);

  return (
    <div className="bg-slate-50 font-sans">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-50 pt-28 pb-32 border-b border-slate-200">
        <div className="absolute inset-0">
          <Image
            src={infra1}
            alt="Infrastructure"
            fill
            priority
            className="object-cover opacity-45"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/5 via-slate-50/20 to-slate-50/35" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" data-aos="zoom-in">
          <span className="inline-block px-3 py-1 rounded-full bg-primary-50 text-primary-700 font-bold text-[10px] uppercase tracking-widest mb-4 border border-primary-200">
            World Class Facility
          </span>

          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
            State-of-the-art<br />
            <span className="text-primary-600 bg-clip-text bg-gradient-to-r from-primary-600 to-cyan-600">Infrastructure</span>
          </h1>

          <p className="mx-auto max-w-2xl text-slate-600 text-sm font-medium">
            Explore our 20,000 sq. ft. repair and manufacturing facility
            equipped with advanced clean rooms, bonding machines, testing labs,
            PCB repair stations and quality inspection systems.
          </p>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-0 relative z-10 -mt-16 mx-4 sm:mx-auto max-w-6xl">
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 sm:p-10">
          <div className="text-center mb-10" data-aos="fade-up">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Facility Highlights
            </h2>
            <p className="mt-1.5 text-slate-500 text-xs font-medium uppercase tracking-wider">
              Designed for maximum productivity and quality.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {facilities.map((item, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="bg-slate-50 rounded-xl p-5 border border-slate-100 hover:border-primary-200 hover:bg-white hover:shadow-sm transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-primary-600 mb-3 shadow-sm group-hover:bg-primary-50 transition-colors">
                  <item.icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10" data-aos="fade-up">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Inside Our Facility
            </h2>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mt-1.5">
              Clean rooms, production, and testing environments.
            </p>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {images.map((img, index) => (
              <div
                key={index}
                data-aos="zoom-in"
                data-aos-delay={index * 50}
                className="overflow-hidden rounded-xl border border-slate-200 shadow-sm group break-inside-avoid relative"
              >
                <Image
                  src={img}
                  alt={`Infrastructure ${index + 1}`}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 bg-white border-t border-slate-200/60 overflow-hidden" data-aos="zoom-in">
        {/* Soft Glow */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-50/50 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-indigo-50/50 blur-[90px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid lg:grid-cols-12 gap-8 items-center">

            {/* Left Side: Content */}
            <div className="lg:col-span-7 text-left space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">Visit Our Infrastructure</h2>
              <p className="text-slate-655 text-sm font-medium leading-relaxed">
                Schedule a visit to our Noida manufacturing and repair facility.
              </p>
              <div className="pt-2">
                <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white text-xs font-bold rounded-xl hover:bg-primary-700 transition-all shadow-md shadow-primary-600/10 hover:-translate-y-0.5">
                  Contact Us <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Side: Image */}
            <div className="lg:col-span-5">
              <div className="relative h-[220px] w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-white">
                <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqZDFyBAJVQKmi_Gi4naD3fcyslGqVY1_IWqMTWFIQKQ&s=10"
                  alt="Visit Our Infrastructure"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}