'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Phone, Mail, MapPin, Clock, MessageCircle, CheckCircle2, ArrowRight, ShieldCheck, Star, Truck, Award } from 'lucide-react';
import { useState } from 'react';
import { publicApi } from '@/lib/api/public';
import { contactSchema, type ContactInput } from '@/lib/validations/booking';

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactInput) => {
    try {
      await publicApi.submitLead({ ...data, email: data.email || undefined });
      toast.success('Form submitted successfully! We will contact you soon.');
      reset();
    } catch {
      toast.error('Failed to submit. Please call or WhatsApp us directly.');
    }
  };

  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8586887887';

  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Inchell Corparation',
    url: 'https://www.inchellcorparation.com/contact',
    telephone: '+918586887887',
    email: 'support@repaircart.co.in',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'C-295 Sector 10',
      addressLocality: 'Noida',
      addressRegion: 'Uttar Pradesh',
      postalCode: '201301',
      addressCountry: 'IN',
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '19:00' },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+918586887887',
      contactType: 'customer service',
      availableLanguage: ['en', 'hi'],
    },
  };

  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [rating, setRating] = useState(5);
  const { register: registerFeedback, handleSubmit: handleSubmitFeedback, reset: resetFeedback, formState: { isSubmitting: isSubmittingFeedback } } = useForm();

  const onFeedbackSubmit = async (data: any) => {
    try {
      await publicApi.submitFeedback({ ...data, rating });
      setFeedbackSubmitted(true);
      toast.success('Thank you for your feedback!');
      resetFeedback();
    } catch {
      toast.error('Failed to submit feedback.');
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }} />

      {/* Hero section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 sm:py-20 font-sans border-b border-slate-200/60">
        {/* Technical Grid Pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-primary-100/40 via-white to-white pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1423662055905-359c27314d58?w=1600&q=80')] bg-cover bg-center opacity-25 pointer-events-none mix-blend-luminosity" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative mx-auto max-w-6xl px-4 z-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-150 bg-primary-50/50 px-3 py-1.5 text-[11px] font-extrabold text-primary-700 shadow-sm mb-5 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-pulse" />
                <span>Doorstep Repair & Pickup Service</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl leading-[1.1] mb-4">
                Let’s get your<br />device <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">fixed.</span>
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 font-medium max-w-lg">
                Whether you need a quick repair quote, an urgent service request, or a product question, our team is ready to help.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${wa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-xs font-extrabold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 hover:shadow-emerald-500/30 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  Chat on WhatsApp <MessageCircle className="ml-1.5 h-4.5 w-4.5" />
                </a>
                <a
                  href="tel:8586887887"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-xs font-extrabold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all hover:-translate-y-0.5 shadow-sm active:scale-[0.98]"
                >
                  Call Now <Phone className="ml-1.5 h-4.5 w-4.5 text-slate-400" />
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Response time', value: 'Within 2 hrs', desc: 'Fastest diagnostic TAT', icon: Clock, color: 'text-blue-650 bg-blue-50/70 border-blue-100' },
                  { label: 'Service Coverage', value: 'Doorstep & pickup', desc: 'Across Mumbai & Noida', icon: Truck, color: 'text-indigo-650 bg-indigo-50/70 border-indigo-100' },
                  { label: 'Warranty Policy', value: '30-day guarantee', desc: '100% genuine parts only', icon: ShieldCheck, color: 'text-emerald-655 bg-emerald-50/70 border-emerald-100' },
                  { label: 'Supported Brands', value: 'Samsung, LG, Sony', desc: 'All leading OEM models', icon: Award, color: 'text-amber-655 bg-amber-50/70 border-amber-100' },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all duration-300 hover:shadow-md hover:bg-white hover:border-primary-100/50 group">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${item.color} transition-all group-hover:scale-110`}>
                        <item.icon className="w-4.5 h-4.5" strokeWidth={2.5} />
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Verified</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                    <p className="mt-1 text-xs font-black text-slate-900 leading-tight">{item.value}</p>
                    <p className="mt-1 text-[9px] text-slate-500 font-semibold">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detail & Form Section */}
      <section className="bg-slate-50 py-16 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-6xl px-4 relative">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">

            {/* Contact Form */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary-600 mb-1">Send a message</p>
                <h2 className="text-xl font-bold text-slate-800">Tell us what you need</h2>
                <p className="text-xs text-slate-450 mt-1">
                  Share your issue or service requirement and we’ll help you with the right plan.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-500">Full Name *</label>
                    <input
                      {...register('name')}
                      placeholder="Your name"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-1 focus:ring-primary-500/20 hover:bg-white font-medium"
                    />
                    {errors.name && <p className="mt-1 text-[10px] font-semibold text-rose-500">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-500">Phone Number *</label>
                    <input
                      {...register('phone')}
                      placeholder="10-digit mobile"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-1 focus:ring-primary-500/20 hover:bg-white font-medium"
                    />
                    {errors.phone && <p className="mt-1 text-[10px] font-semibold text-rose-500">{errors.phone.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-500">Email Address <span className="text-slate-400 font-medium">(optional)</span></label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="john@example.com"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-1 focus:ring-primary-500/20 hover:bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-500">Service Type *</label>
                  <select
                    {...register('serviceType')}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-1 focus:ring-primary-500/20 hover:bg-white appearance-none cursor-pointer font-semibold"
                  >
                    <option value="">Select a service</option>
                    <option value="PANEL_REPAIR">LED TV Panel Repair</option>
                    <option value="SPEAKER_MFG">Speaker Manufacturing</option>
                    <option value="DOA_MANAGEMENT">DOA Management</option>
                    <option value="RECYCLING">Recycling Services</option>
                  </select>
                  {errors.serviceType && <p className="mt-1 text-[10px] font-semibold text-rose-500">{errors.serviceType.message}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-500">Message *</label>
                  <textarea
                    {...register('message')}
                    rows={3}
                    placeholder="Describe your issue or requirement..."
                    className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-1 focus:ring-primary-500/20 hover:bg-white font-medium"
                  />
                  {errors.message && <p className="mt-1 text-[10px] font-semibold text-rose-500">{errors.message.message}</p>}
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-primary-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-primary-500 transition-all hover:-translate-y-0.5 disabled:opacity-60"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Contacts & Map */}
            <div className="space-y-5">

              {/* Simple Clean Map Container */}
              <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm h-48">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14013.250486043455!2d77.3175!3d28.5885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce45f0d778d91%3A0xc3f1d3c7b64010a3!2sSector%2010%2C%20Noida%2C%20Uttar%20Pradesh%20201301!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location"
                  className="grayscale contrast-[1.05]"
                />
              </div>

              {/* Contact Details Card */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 text-slate-800 shadow-md space-y-4">
                <h3 className="text-sm font-bold border-b border-slate-100 pb-2 text-slate-900">Office Locations & Details</h3>
                <div className="grid gap-3.5 text-xs">
                  {[
                    { icon: MapPin, label: 'Head Office', value: 'C-295, Sector-10, Noida, UP-201301' },
                    { icon: MapPin, label: 'Branch Office', value: 'B-115, Sector-5, Noida, UP-201301' },
                    { icon: Phone, label: 'Phone Support', values: [
                      { text: '+91 8586887887', href: 'tel:8586887887' },
                      { text: '8586807887', href: 'tel:8586807887' }
                    ] },
                    { icon: Mail, label: 'Email Support', values: [
                      { text: 'support@repaircart.co.in', href: 'mailto:support@repaircart.co.in' },
                      { text: 'info@repaircart.in', href: 'mailto:info@repaircart.in' }
                    ] },
                    { icon: Clock, label: 'Business Hours', value: 'Mon–Sat: 9:00 AM – 7:00 PM' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100 hover:bg-slate-100/50 transition-colors">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white border border-slate-100 shrink-0">
                        <item.icon className="h-4.5 w-4.5 text-primary-600" strokeWidth={2} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{item.label}</p>
                        {item.values ? (
                          <div className="mt-0.5 flex flex-wrap items-center">
                            {item.values.map((v, i) => (
                              <span key={i}>
                                <a href={v.href} className="font-semibold text-slate-800 hover:text-primary-600 transition-colors">
                                  {v.text}
                                </a>
                                {i < item.values.length - 1 && <span className="mx-1 text-slate-400">,</span>}
                              </span>
                            ))}
                          </div>
                        ) : item.href ? (
                          <a href={item.href} className="mt-0.5 block font-semibold text-slate-800 hover:text-primary-600 transition-colors">
                            {item.value}
                          </a>
                        ) : (
                          <p className="mt-0.5 font-semibold text-slate-800">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Feedback Section */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-2xl px-4">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">We Value Your Feedback</h2>
            <p className="text-xs text-slate-450 mt-1">Help us improve our services by sharing your experience.</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 shadow-sm">
            {feedbackSubmitted ? (
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 border border-green-200 mb-3 animate-in zoom-in-50">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Thank You!</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">Your feedback has been submitted successfully. We appreciate your time.</p>
                <button onClick={() => setFeedbackSubmitted(false)} className="text-primary-650 text-xs font-bold hover:text-primary-750">
                  Submit another response
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback(onFeedbackSubmit)} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Your Name *</label>
                    <input {...registerFeedback('name', { required: true })} type="text" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/20 transition-all font-medium" placeholder="John Doe" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Your Email</label>
                    <input {...registerFeedback('email')} type="email" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/20 transition-all font-medium" placeholder="john@example.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Rate your experience *</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-1 transition-all ${rating >= star ? 'text-amber-400 drop-shadow-sm scale-105' : 'text-slate-200'}`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Message *</label>
                  <textarea {...registerFeedback('message', { required: true })} rows={3} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/20 transition-all resize-none font-medium" placeholder="Tell us what you liked or how we can improve..." required></textarea>
                </div>

                <button type="submit" disabled={isSubmittingFeedback} className="w-full rounded-lg bg-primary-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-primary-500 disabled:opacity-60 transition-all">
                  {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
