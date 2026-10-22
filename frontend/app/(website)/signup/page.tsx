'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, UserPlus, Phone, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { publicApi } from '@/lib/api/public';
import { useCustomerStore } from '@/lib/stores/customer-store';

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [step, setStep] = useState<'DETAILS' | 'OTP'>('DETAILS');
  const [form, setForm] = useState({ phone: '' });
  const [otp, setOtp] = useState('');

  const setAuth = useCustomerStore((state) => state.setAuth);

  useEffect(() => {
    setCheckingAuth(false);
  }, []);

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSendOTP(e: React.FormEvent) {
    e.preventDefault();
    if (form.phone.length < 10) { toast.error('Enter a valid 10-digit phone number'); return; }

    setLoading(true);

    try {
      await publicApi.sendCustomerAuthOTP({ phone: form.phone });
      toast.success('OTP sent to your phone!');
      setStep('OTP');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length < 6) { toast.error('Enter a valid 6-digit OTP'); return; }

    setLoading(true);
    try {
      const data = await publicApi.verifyCustomerAuthOTP({ phone: form.phone, otp });
      setAuth(
        { id: data.id, name: data.name, email: data.email },
        data.token
      );
      localStorage.setItem('customer_has_signed_up', 'true');
      toast.success('Account created successfully!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex font-sans">
      {/* Left Side - Image (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden select-none">
        <Image
          src="/realimages/ASSEMBLY/DSC05238.webp"
          alt="Premium Service"
          fill
          className="object-cover opacity-100"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute bottom-12 left-12 right-12 z-10 text-white animate-in slide-in-from-bottom-4 duration-500 fade-in">
          <div className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold mb-4">
            🚀 Join thousands of happy customers
          </div>
          <h2 className="text-3xl font-extrabold mb-3 leading-tight">
            Seamless Repairs,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">Exceptional Quality.</span>
          </h2>
          <p className="text-sm text-slate-300 font-medium max-w-sm leading-relaxed">
            Create an account to book repairs in seconds, track status, and manage your entire service history online.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 relative overflow-hidden">
        {/* Subtle Background Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sign In</h1>
            <p className="mt-2 text-sm text-slate-500 font-medium">Log in or create an account to continue.</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-6">
            {step === 'DETAILS' ? (
              <form onSubmit={handleSendOTP} className="space-y-5">
                <div>
                  <label className="block text-sm font-extrabold text-slate-700 uppercase tracking-wider mb-3">Mobile Number</label>
                  <div className="relative flex items-center rounded-sm overflow-hidden border border-slate-200 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:border-primary-300">
                    {/* Left section with flag and code */}
                    <div className="flex items-center gap-2.5 pl-4 pr-4 py-4 bg-slate-50/80 border-r border-slate-200">
                      <img src="https://flagcdn.com/w40/in.png" alt="India" className="w-[22px] h-[15px] object-cover rounded-[2px] shadow-sm" />
                      <span className="text-slate-300 font-black text-sm leading-none">•</span>
                      <span className="text-slate-700 font-extrabold text-[15px] leading-none tracking-wide">+91</span>
                    </div>
                    {/* Right section with input */}
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter your mobile number"
                      className="w-full pl-4 pr-4 py-4 bg-transparent text-slate-800 text-[15px] font-bold focus:outline-none placeholder:text-slate-400 placeholder:font-medium tracking-wide"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white font-extrabold py-3.5 rounded-xl text-sm transition-all active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none mt-6"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Send OTP <ArrowRight className="h-5 w-5" /></>}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-5 animate-in slide-in-from-right-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Enter OTP</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="••••••"
                      className="w-full text-center tracking-[0.5em] text-xl py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-800"
                      required
                    />
                  </div>
                  <p className="mt-3 text-xs text-center text-slate-500 font-medium">
                    OTP sent to {form.phone}.{' '}
                    <button type="button" onClick={() => setStep('DETAILS')} className="text-primary-600 font-bold hover:underline">Change</button>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white font-extrabold py-3.5 rounded-xl text-sm transition-all active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none mt-6"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><UserPlus className="h-5 w-5" /> Verify & Login</>}
                </button>
              </form>
            )}
          </div>

          <div className="mt-8 text-center">
            {/* Removed redundant login link */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WebsiteRegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    }>
      <RegisterFormContent />
    </Suspense>
  );
}
