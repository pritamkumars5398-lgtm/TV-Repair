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
      <section className="relative overflow-hidden bg-[#020617] pt-28 pb-32 border-b border-slate-800">
        <div className="absolute inset-0">
          <Image
            src={infra1}
            alt="Infrastructure"
            fill
            priority
            className="object-cover opacity-20 mix-blend-luminosity"
          />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-300/30 via-[#020617]/90 to-[#020617]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" data-aos="zoom-in">
          <p className="uppercase tracking-[0.2em] text-[10px] text-primary-400 font-bold mb-3">
            <span className="text-white">World Class Facility</span>
          </p>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            State-of-the-art<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-300">Infrastructure</span>
          </h1>

          <p className="mx-auto max-w-2xl text-slate-400 text-sm font-medium">
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
      <section className="py-20 bg-[#020617] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-900/40 via-[#020617] to-[#020617]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl" data-aos="fade-up">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-extrabold text-white">
                Visit Our Infrastructure
              </h2>
              <p className="text-slate-400 mt-2 text-sm font-medium max-w-md">
                Schedule a visit to our Noida manufacturing and repair facility.
              </p>
            </div>

            <Link
              href="/contact"
              className="px-6 py-3 rounded-md bg-primary-600 text-white text-sm font-bold shadow-sm hover:bg-primary-700 transition flex items-center justify-center shrink-0 border border-transparent"
            >
              Contact Us
              <ArrowRight className="inline ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}