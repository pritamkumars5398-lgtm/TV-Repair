'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { publicApi } from '@/lib/api/public';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

const inquirySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit number'),
  email: z.string().email().optional().or(z.literal('')),
  productInterest: z.string().min(1),
  message: z.string().min(10, 'Describe your requirement (min 10 chars)'),
});
type InquiryInput = z.infer<typeof inquirySchema>;

export default function ProductsPage() {
  const [category, setCategory] = useState('All');
  const [modal, setModal] = useState<{ open: boolean; product: string }>({ open: false, product: '' });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['public-products'],
    queryFn: publicApi.getProducts,
  });

  const approvedProducts = products.filter((p: any) => p.isApproved !== false);
  
  // Hardcoded categories so they are always visible even if empty
  const defaultCategories = [
    'All', 
    'Home Theater', 
    'Home Audio', 
    'Commercial', 
    'Subwoofer', 
    'Outdoor', 
    'Studio', 
    'Accessories'
  ];
  
  // Combine hardcoded with any new dynamic ones, keeping unique
  const dynamicCategories: string[] = Array.from(new Set(approvedProducts.map((p: any) => p.category as string)));
  const categories: string[] = Array.from(new Set([...defaultCategories, ...dynamicCategories])) as string[];
  
  const filtered = category === 'All' ? approvedProducts : approvedProducts.filter((p: any) => p.category === category);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
  });

  const onSubmit = async (data: InquiryInput) => {
    try {
      await publicApi.submitInquiry({ ...data, serviceType: 'PRODUCT_INQUIRY' });
      toast.success("Inquiry sent! We'll call you within 2 hours.");
      reset();
      setModal({ open: false, product: '' });
    } catch {
      toast.error('Failed to send. Please WhatsApp us directly.');
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative bg-slate-950 text-white pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-900/40 via-slate-950 to-slate-950" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1545454675-3479531426e2?w=1600&q=80')] bg-cover bg-center opacity-10 mix-blend-luminosity" />
        <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-primary-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p data-aos="fade-down" className="text-primary-400 text-sm font-bold uppercase tracking-[0.2em] mb-4">Products</p>
          <h1 data-aos="fade-up" data-aos-delay="100" className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight">Speaker <span className="text-white bg-clip-text bg-gradient-to-r from-primary-400 to-orange-300">Catalog</span></h1>
          <p data-aos="fade-up" data-aos-delay="200" className="text-slate-300 text-lg max-w-2xl mx-auto font-light leading-relaxed">Custom-manufactured speakers for home, studio, and commercial use. Contact us for a personalized quote tailored to your acoustic needs.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-14" data-aos="fade-up" data-aos-delay="100">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${category === cat
                  ? 'bg-primary-600 text-white shadow-primary-600/30 shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-primary-600 hover:border-primary-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="flex justify-center p-20"><Loader2 className="h-8 w-8 animate-spin text-primary-500" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center p-20 text-slate-500 font-medium">No products available at the moment.</div>
          ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((p: any, index: number) => (
              <div
                key={p._id}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="group bg-white border border-slate-100 rounded-3xl overflow-hidden hover:border-primary-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col"
              >
                <div className="relative h-64 bg-slate-100 overflow-hidden">
                  <Image
                    src={p.img}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 left-4">
                    <span className="text-xs font-bold text-white bg-slate-900/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full shadow-md">
                      {p.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{p.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-grow">{p.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {p.specs && p.specs.map((s: string) => (
                      <span key={s} className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md">{s}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-auto">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Price range</p>
                      <p className="text-base font-black text-primary-600">{p.price}</p>
                    </div>
                    <button
                      onClick={() => setModal({ open: true, product: p.name })}
                      className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-xl shadow-md shadow-primary-600/20 transition-all hover:-translate-y-0.5"
                    >
                      Get Quote <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Inquiry Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div
            className="bg-white rounded-3xl w-full max-w-lg shadow-2xl shadow-slate-900/50 border border-slate-100 relative overflow-hidden"
            data-aos="zoom-in"
            data-aos-duration="200"
          >
            {/* Modal Header */}
            <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Product Inquiry</h2>
                <p className="text-sm text-slate-500 mt-1">We will send you a custom quote within 2 hours.</p>
              </div>
              <button onClick={() => setModal({ open: false, product: '' })} className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Name *</label>
                    <input {...register('name')} placeholder="Full name" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors bg-slate-50 hover:bg-white focus:bg-white" />
                    {errors.name && <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Phone *</label>
                    <input {...register('phone')} placeholder="10-digit number" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors bg-slate-50 hover:bg-white focus:bg-white" />
                    {errors.phone && <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.phone.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Product *</label>
                  <input {...register('productInterest')} defaultValue={modal.product} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors bg-slate-50 font-semibold text-slate-700" readOnly />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Your Requirement *</label>
                  <textarea {...register('message')} rows={3} placeholder="Room size, usage, budget..." className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors bg-slate-50 hover:bg-white focus:bg-white resize-none" />
                  {errors.message && <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.message.message}</p>}
                </div>
                <div className="pt-2">
                  <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 text-white text-base font-bold rounded-xl shadow-lg shadow-primary-600/20 transition-all hover:-translate-y-0.5">
                    {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
