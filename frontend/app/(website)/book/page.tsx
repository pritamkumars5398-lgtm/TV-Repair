'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { CheckCircle2, Upload, X, ChevronLeft, ChevronRight, Tv, MapPin, CreditCard, ShieldCheck } from 'lucide-react';
import Script from 'next/script';
import { useBookingStore } from '@/lib/stores/booking-store';
import { step1Schema, step2Schema, type Step1Input, type Step2Input } from '@/lib/validations/booking';
import { publicApi } from '@/lib/api/public';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];

const SERVICE_OPTIONS = [
  { value: 'TV_REPAIR', label: 'LED / Smart TV Repair' },
  { value: 'SPEAKER_REPAIR', label: 'Speaker Repair' },
  { value: 'HOME_VISIT', label: 'Home Visit (Assessment)' },
  { value: 'SPEAKER_INSTALL', label: 'Speaker Installation' },
  { value: 'HOME_THEATER', label: 'Home Theater Setup' },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { num: 1, label: 'Service', icon: Tv },
    { num: 2, label: 'Address', icon: MapPin },
    { num: 3, label: 'Payment', icon: CreditCard },
  ];

  return (
    <div className="flex items-center justify-between mb-8 relative px-4 sm:px-10">
      <div className="absolute top-1/2 left-8 right-8 sm:left-14 sm:right-14 h-[3px] bg-slate-100 -z-10 rounded-full transform -translate-y-1/2" />
      <div 
        className="absolute top-1/2 left-8 sm:left-14 h-[3px] bg-primary-600 -z-10 rounded-full transform -translate-y-1/2 transition-all duration-500 ease-in-out" 
        style={{ width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - ${currentStep === 1 ? '0px' : currentStep === 3 ? '40px' : '20px'})` }}
      />
      {steps.map((step) => {
        const isActive = currentStep === step.num;
        const isCompleted = currentStep > step.num;
        
        return (
          <div key={step.num} className="flex flex-col items-center bg-white px-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-[3px] border-white transition-all duration-300 shadow-sm ${isActive ? 'bg-primary-600 text-white shadow-primary-500/30 ring-4 ring-primary-50' : isCompleted ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
               {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-4 h-4" />}
            </div>
            <span className={`text-[10px] font-bold mt-2 uppercase tracking-wider ${isActive ? 'text-primary-700' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Step 1: Service Details ── */
function Step1({ onNext }: { onNext: (data: Step1Input) => void }) {
  const { formData, updateFormData } = useBookingStore();
  const [photos, setPhotos] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<Step1Input>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      name: formData.name || '',
      phone: formData.phone || '',
      email: formData.email || '',
      serviceType: formData.serviceType || 'TV_REPAIR',
      preferredDate: formData.preferredDate || '',
      preferredTime: formData.preferredTime || '',
      issueDescription: formData.issueDescription || '',
    },
  });

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).filter((f) => f.size <= 5 * 1024 * 1024);
    const combined = [...photos, ...newFiles].slice(0, 5);
    setPhotos(combined);
    updateFormData({ photos: combined });
  };

  const removePhoto = (idx: number) => {
    const updated = photos.filter((_, i) => i !== idx);
    setPhotos(updated);
    updateFormData({ photos: updated });
  };

  const onSubmit = (data: Step1Input) => {
    updateFormData(data);
    onNext(data);
  };

  const minDate = new Date().toISOString().split('T')[0];

  const inputClass = "w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-400 focus:bg-white";
  const labelClass = "block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Full Name *</label>
          <input {...register('name')} placeholder="Your full name" className={inputClass} />
          {errors.name && <p className="text-[10px] text-red-500 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Phone Number *</label>
          <input {...register('phone')} placeholder="10-digit mobile number" className={inputClass} />
          {errors.phone && <p className="text-[10px] text-red-500 mt-1">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Email Address</label>
        <input {...register('email')} type="email" placeholder="Optional" className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Service Type *</label>
        <div className="relative">
          <select {...register('serviceType')} className={`${inputClass} appearance-none cursor-pointer pr-8`}>
            {SERVICE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
        {errors.serviceType && <p className="text-[10px] text-red-500 mt-1">{errors.serviceType.message}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Preferred Date *</label>
          <input {...register('preferredDate')} type="date" min={minDate} className={inputClass} />
          {errors.preferredDate && <p className="text-[10px] text-red-500 mt-1">{errors.preferredDate.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Preferred Time *</label>
          <div className="relative">
            <select {...register('preferredTime')} className={`${inputClass} appearance-none cursor-pointer pr-8`}>
              <option value="">Select a time slot</option>
              {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          {errors.preferredTime && <p className="text-[10px] text-red-500 mt-1">{errors.preferredTime.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Describe the Issue *</label>
        <textarea {...register('issueDescription')} rows={2} placeholder="E.g., Screen is dark, no sound..." className={`${inputClass} resize-none`} />
        {errors.issueDescription && <p className="text-[10px] text-red-500 mt-1">{errors.issueDescription.message}</p>}
      </div>

      {/* Photo Upload */}
      <div>
        <label className={labelClass}>Upload Photos <span className="font-normal lowercase normal-case">(optional, max 5)</span></label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border border-dashed border-slate-300 rounded-md p-4 text-center cursor-pointer hover:border-primary-400 hover:bg-slate-50 transition-all flex flex-col items-center justify-center gap-1"
        >
          <Upload className="h-4 w-4 text-slate-400 mb-1" />
          <p className="text-xs font-semibold text-slate-600">Click to upload photos</p>
          <p className="text-[10px] text-slate-400">JPEG, PNG up to 5MB each</p>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        
        {photos.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {photos.map((f, i) => (
              <div key={i} className="relative group">
                <div className="h-12 w-12 rounded bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                  <img src={URL.createObjectURL(f)} alt={f.name} className="h-full w-full object-cover" />
                </div>
                <button type="button" onClick={() => removePhoto(i)} className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                  <X className="h-2 w-2" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-2">
        <button type="submit" className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-[0.98] uppercase tracking-wider shadow-md">
          Proceed to Address <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}

/* ── Step 2: Address ── */
function Step2({ onNext, onBack }: { onNext: (data: Step2Input) => void; onBack: () => void }) {
  const { formData, updateFormData } = useBookingStore();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<Step2Input>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      address: formData.address || '',
      area: formData.area || '',
      city: formData.city || 'Mumbai',
      pincode: formData.pincode || '',
      isPickup: formData.isPickup || false,
    },
  });

  const isPickup = watch('isPickup');

  const onSubmit = (data: Step2Input) => {
    updateFormData(data);
    onNext(data);
  };

  const inputClass = "w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-400 focus:bg-white";
  const labelClass = "block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className={labelClass}>Full Address *</label>
        <input {...register('address')} placeholder="Flat/House no., Building name, Street" className={inputClass} />
        {errors.address && <p className="text-[10px] text-red-500 mt-1">{errors.address.message}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Area / Locality *</label>
          <input {...register('area')} placeholder="e.g., Bandra West" className={inputClass} />
          {errors.area && <p className="text-[10px] text-red-500 mt-1">{errors.area.message}</p>}
        </div>
        <div>
          <label className={labelClass}>City *</label>
          <input {...register('city')} placeholder="City name" className={inputClass} />
          {errors.city && <p className="text-[10px] text-red-500 mt-1">{errors.city.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Pincode *</label>
        <input {...register('pincode')} placeholder="6-digit pincode" maxLength={6} className={inputClass} />
        {errors.pincode && <p className="text-[10px] text-red-500 mt-1">{errors.pincode.message}</p>}
      </div>

      {/* Pick & Drop Toggle */}
      <div className={`mt-6 rounded-md p-4 border transition-all cursor-pointer ${isPickup ? 'border-primary-500 bg-primary-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}>
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <input
              type="checkbox"
              id="isPickup"
              {...register('isPickup')}
              className="peer hidden"
            />
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isPickup ? 'bg-primary-600 border-primary-600' : 'border-slate-300 bg-white'}`}>
               {isPickup && <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />}
            </div>
          </div>
          <label htmlFor="isPickup" className="cursor-pointer flex-1">
            <p className="font-bold text-slate-800 text-sm">Enable Pick & Drop Service</p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              We'll pick up your TV, repair it at our workshop, and deliver it back. 
            </p>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onBack} className="flex-1 py-3 bg-slate-100 text-slate-700 text-xs font-extrabold rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider hover:-translate-y-0.5">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <button type="submit" className="flex-[2] py-3 bg-primary-600 hover:bg-primary-700 text-white text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider hover:-translate-y-0.5 shadow-md">
          Proceed to Payment <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}

/* ── Step 3: Payment ── */
function Step3({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const { formData, reset } = useBookingStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const serviceLabel = SERVICE_OPTIONS.find((o) => o.value === formData.serviceType)?.label || formData.serviceType;

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const response = await publicApi.createBooking(formData as Parameters<typeof publicApi.createBooking>[0]);
      const { razorpayOrderId, bookingId } = response as any;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: 25000,
        currency: 'INR',
        name: 'TV Repair Service',
        description: 'Service Visit Fee',
        order_id: razorpayOrderId,
        prefill: { name: formData.name, email: formData.email, contact: formData.phone },
        theme: { color: '#2563eb' },
        handler: async (payment: Record<string, string>) => {
          try {
            const verify: any = await publicApi.verifyPayment({
              razorpay_order_id: payment.razorpay_order_id,
              razorpay_payment_id: payment.razorpay_payment_id,
              razorpay_signature: payment.razorpay_signature,
              bookingId,
            });
            reset();
            router.push(`/booking/success?ticketId=${verify.ticketId}`);
          } catch {
            toast.error('Payment verification failed. Contact us with your payment ID.');
          }
        },
        modal: {
          ondismiss: () => {
            toast.warning('Payment cancelled. Your booking is not confirmed yet.');
            setIsProcessing(false);
          },
        },
      };

      new window.Razorpay(options).open();
    } catch {
      toast.error('Failed to create booking. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Order Summary */}
      <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 relative overflow-hidden">
        
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5">
          <CheckCircle2 className="text-primary-600 w-4 h-4" /> Order Summary
        </h3>
        
        <div className="space-y-3 relative z-10 text-sm">
          <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Customer</span>
            <span className="font-bold text-slate-800">{formData.name}</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Phone</span>
            <span className="font-bold text-slate-800">{formData.phone}</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Service</span>
            <span className="font-bold text-slate-800">{serviceLabel}</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Date & Time</span>
            <span className="font-bold text-slate-800">{formData.preferredDate} at {formData.preferredTime}</span>
          </div>
          <div className="flex justify-between items-start py-1.5 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Address</span>
            <span className="font-bold text-slate-800 text-right max-w-[60%] leading-snug">{formData.address}, {formData.area}, {formData.city} – {formData.pincode}</span>
          </div>
          {formData.isPickup && (
            <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Mode</span>
              <span className="font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded text-xs">Pick & Drop</span>
            </div>
          )}
          
          <div className="pt-2 flex justify-between items-end">
            <div>
              <span className="block text-slate-800 font-bold text-sm">Service Visit Fee</span>
              <span className="block text-[10px] text-slate-500 mt-0.5">Remaining cost shared post-diagnosis.</span>
            </div>
            <span className="font-black text-2xl text-slate-900">₹250</span>
          </div>
        </div>
      </div>

      {/* Payment Methods Info */}
      <div className="bg-white rounded-lg p-4 border border-slate-200">
        <p className="text-xs font-bold text-slate-600 mb-3 flex items-center gap-1.5">
          <CreditCard className="w-4 h-4 text-slate-400" /> Secure Payment
        </p>
        <div className="flex flex-wrap gap-2">
          {['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'PhonePe', 'GPay'].map((m) => (
            <span key={m} className="text-[10px] font-semibold px-2 py-1 bg-slate-50 text-slate-600 rounded border border-slate-200">{m}</span>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onBack} className="px-4 py-3 bg-slate-100 text-slate-700 text-xs font-extrabold rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider hover:-translate-y-0.5">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white text-xs font-extrabold rounded-xl transition-all flex items-center justify-center uppercase tracking-wider hover:-translate-y-0.5 shadow-md"
        >
          {isProcessing ? 'Processing...' : 'Pay ₹250 & Confirm'}
        </button>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function BookPage() {
  const { step, nextStep, prevStep } = useBookingStore();

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Very clean minimalist hero */}
      <section className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-24 pb-32 border-b border-slate-200/60 overflow-hidden">
        {/* Technical Grid Pattern & Soft Radial Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-100/40 via-white to-white pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1600&q=80')] bg-cover bg-center opacity-30 pointer-events-none" />

        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center z-10">
          <div className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-150 bg-primary-50/50 px-3.5 py-1.5 text-[11px] font-extrabold text-primary-700 shadow-sm mb-5 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-pulse" />
            <span>Book Repair Service in 60 seconds</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3 leading-none">
            Book your repair service
          </h1>
          <p className="text-xs md:text-sm text-slate-655 font-semibold">
            Expert technicians at your doorstep. Transparent pricing.
          </p>
        </div>
      </section>

      {/* Clean Form Container */}
      <section className="pb-20 relative z-10 -mt-20">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-8">
            <StepIndicator currentStep={step} />

            <div className="mt-6">
              {step === 1 && <Step1 onNext={nextStep} />}
              {step === 2 && <Step2 onNext={nextStep} onBack={prevStep} />}
              {step === 3 && <Step3 onBack={prevStep} />}
            </div>
          </div>
          
          {/* Trust Badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 opacity-70">
            <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
               <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" /> Certified Experts
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
               <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Genuine Parts
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
               <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" /> 30-Day Warranty
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
