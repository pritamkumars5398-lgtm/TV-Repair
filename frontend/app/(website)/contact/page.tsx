'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Phone, Mail, MapPin, Clock, MessageCircle, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { publicApi } from '@/lib/api/public';
import { contactSchema, type ContactInput } from '@/lib/validations/booking';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [leadId, setLeadId] = useState('');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactInput) => {
    try {
      const response: any = await publicApi.submitLead({ ...data, email: data.email || undefined });
      toast.success('Form submitted successfully! We will contact you soon.');
      reset();
    } catch {
      toast.error('Failed to submit. Please call or WhatsApp us directly.');
    }
  };

  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '9811881117';

  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Longwell Electronics',
    url: 'https://www.longwellelectronics.com/contact',
    telephone: '+919811881117',
    email: 'imrankhanik8463@gmail.com',
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
      telephone: '+919811881117',
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
      <section className="relative overflow-hidden bg-slate-950 py-24 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-primary-900/30 via-slate-950 to-slate-950" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="max-w-2xl">
              <div data-aos="fade-down" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-primary-300 backdrop-blur-md shadow-lg mb-6">
                <ShieldCheck className="h-4 w-4 text-white" />
                <span className='text-white'> Fast response · Genuine parts · Doorstep service</span>
              </div>
              <h1 data-aos="fade-up" data-aos-delay="100" className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.05]">
                Let’s get your device <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-orange-300">fixed.</span>
              </h1>
              <p data-aos="fade-up" data-aos-delay="200" className="mt-6 text-lg leading-relaxed text-slate-300 font-light max-w-xl">
                Whether you need a quick repair quote, an urgent service request, or a product question, our team is ready to help.
              </p>
              <div data-aos="fade-up" data-aos-delay="300" className="mt-10 flex flex-col sm:flex-row gap-4">
                <a
                  href={`https://wa.me/${wa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:bg-emerald-400 hover:-translate-y-1"
                >
                  Chat on WhatsApp <MessageCircle className="ml-2 h-5 w-5" />
                </a>
                <a
                  href="tel:9876543210"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-8 py-4 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white/30 hover:-translate-y-1"
                >
                  Call now <Phone className="ml-2 h-5 w-5" />
                </a>
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl" data-aos="fade-left" data-aos-delay="200">
              <div className="grid gap-5 sm:grid-cols-2">
                {([
                  { label: 'Response time', value: 'Within 2 hrs' },
                  { label: 'Service', value: 'Doorstep & pickup' },
                  { label: 'Warranty', value: '30-day guarantee' },
                  { label: 'Brands', value: 'Samsung, LG, Sony' },
                ]).map((item, i) => (
                  <div key={item.label} data-aos="zoom-in" data-aos-delay={300 + (i * 100)} className="rounded-3xl border border-white/10 bg-slate-900/50 p-5 hover:bg-slate-900/80 transition-colors">
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{item.label}</p>
                    <p className="mt-2 text-xl font-bold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[3rem] border border-slate-100 bg-white p-8 sm:p-12 shadow-xl shadow-slate-200/50" data-aos="fade-right">
                <>
                  <div className="mb-10">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary-600 mb-2">Send a message</p>
                    <h2 className="text-4xl font-bold text-slate-900 mb-3">Tell us what you need</h2>
                    <p className="text-base leading-relaxed text-slate-600">
                      Share your issue or service requirement and we’ll help you with the right plan.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-bold text-slate-700">Full Name *</label>
                        <input
                          {...register('name')}
                          placeholder="Your name"
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20 hover:bg-white"
                        />
                        {errors.name && <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-bold text-slate-700">Phone Number *</label>
                        <input
                          {...register('phone')}
                          placeholder="10-digit mobile"
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20 hover:bg-white"
                        />
                        {errors.phone && <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.phone.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Email</label>
                      <input
                        {...register('email')}
                        type="email"
                        placeholder="Optional"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20 hover:bg-white"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Service Type *</label>
                      <select
                        {...register('serviceType')}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20 hover:bg-white appearance-none cursor-pointer"
                      >
                        <option value="">Select a service</option>
                        <option value="PANEL_REPAIR">LED TV Panel Repair</option>
                        <option value="MOBILE_REPAIR">Mobile Glass/Touch Repair</option>
                        <option value="SPEAKER_MFG">Speaker Manufacturing</option>
                        <option value="DOA_MANAGEMENT">DOA Management</option>
                        <option value="RECYCLING">Recycling Services</option>
                      </select>
                      {errors.serviceType && <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.serviceType.message}</p>}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Message *</label>
                      <textarea
                        {...register('message')}
                        rows={5}
                        placeholder="Describe your issue or requirement..."
                        className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20 hover:bg-white"
                      />
                      {errors.message && <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.message.message}</p>}
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-primary-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-primary-600/30 transition-all hover:bg-primary-500 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isSubmitting ? 'Sending...' : 'Send message'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </button>
                    </div>
                  </form>
                </>
            </div>

            <div className="space-y-8">
              <div className="overflow-hidden rounded-[3rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50" data-aos="fade-left">
                <div className="h-64 sm:h-80">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14013.250486043455!2d77.3175!3d28.5885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce45f0d778d91%3A0xc3f1d3c7b64010a3!2sSector%2010%2C%20Noida%2C%20Uttar%20Pradesh%20201301!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Location"
                    className="grayscale contrast-125"
                  />
                </div>
              </div>

              <div className="rounded-[3rem] border border-slate-100 bg-slate-950 p-10 text-white shadow-2xl" data-aos="fade-left" data-aos-delay="100">
                <h3 className="text-2xl font-bold">Contact details</h3>
                <div className="mt-8 space-y-5">
                  {([
                    { icon: MapPin, label: 'Head Office', value: 'C-295 Sector 10 Noida, Gautam Buddha Nagar-201301' },
                    { icon: MapPin, label: 'Branch Office', value: 'B115 Sector 5 Noida, Gautam Buddha Nagar-201301' },
                    { icon: Phone, label: 'Phone', value: '+91 9811881117, +91 9811211948', href: 'tel:9811881117' },
                    { icon: Mail, label: 'Email', value: 'imrankhanik8463@gmail.com', href: 'mailto:imrankhanik8463@gmail.com' },
                    { icon: Clock, label: 'Hours', value: 'Mon–Sat: 9:00 AM – 7:00 PM' },
                  ]).map((item, index) => (
                    <div key={item.label} data-aos="fade-up" data-aos-delay={200 + (index * 100)} className="flex items-start gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-colors">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 shrink-0">
                        <item.icon className="h-5 w-5 text-primary-400" strokeWidth={2} />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="mt-1 block text-base font-medium text-white transition hover:text-primary-300">
                            {item.value}
                          </a>
                        ) : (
                          <p className="mt-1 text-base font-medium text-white">{item.value}</p>
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
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">We Value Your Feedback</h2>
            <p className="text-slate-600">Help us improve our services by sharing your experience.</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100" data-aos="fade-up" data-aos-delay="100">
            {feedbackSubmitted ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Thank You!</h3>
                <p className="text-slate-600 mb-6">Your feedback has been submitted successfully. We appreciate your time.</p>
                <button onClick={() => setFeedbackSubmitted(false)} className="text-primary-600 font-bold hover:text-primary-700">
                  Submit another response
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback(onFeedbackSubmit)} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Your Name *</label>
                    <input {...registerFeedback('name', { required: true })} type="text" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all" placeholder="John Doe" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Your Email</label>
                    <input {...registerFeedback('email')} type="email" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all" placeholder="john@example.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Rate your experience *</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-2 transition-all hover:scale-110 ${rating >= star ? 'text-amber-400 drop-shadow-md' : 'text-slate-200'}`}
                      >
                        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Message *</label>
                  <textarea {...registerFeedback('message', { required: true })} rows={4} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all resize-none" placeholder="Tell us what you liked or how we can improve..." required></textarea>
                </div>

                <button type="submit" disabled={isSubmittingFeedback} className="w-full rounded-xl bg-primary-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-1 hover:bg-primary-500 disabled:opacity-50">
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
