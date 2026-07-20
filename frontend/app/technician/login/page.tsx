'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Clock, Loader2, ArrowRight, UserCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores/auth-store';

type Step = 'phone' | 'otp';

export default function TechnicianLoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phone)) { toast.error('Enter a valid 10-digit mobile number'); return; }
    setLoading(true);
    try {
      await authApi.sendOtp(phone);
      toast.success('OTP sent to ' + phone);
      setStep('otp');
    } catch { toast.error('Failed to send OTP.'); }
    finally { setLoading(false); }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) { toast.error('Enter the 6-digit OTP'); return; }
    setLoading(true);
    try {
      const res = await authApi.verifyOtp(phone, otp, 'technician');
      setAuth(res.data.user, res.data.token);
      toast.success('Welcome, ' + res.data.user.name);
      router.push('/technician/dashboard');
    } catch { toast.error('Invalid OTP or not a technician account.'); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Panel - Illustration/Info */}
      <div className="hidden lg:flex lg:w-5/12 relative bg-primary-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1597849114675-9c869fb7a710?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-primary-950/90 to-primary-900/80"></div>
        
        <div className="relative z-10 w-full p-12 flex flex-col justify-between h-full">
          <div>
            <Link href="/" className="inline-block bg-white/10 p-2 px-4 rounded-xl backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all">
              <Image src="/logo.png" alt="RepairCart" width={140} height={48} className="h-7 w-auto brightness-0 invert" />
            </Link>
          </div>
          
          <div className="space-y-6 max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-semibold tracking-wide text-white uppercase">Authorized Portal</span>
            </div>
            
            <h1 className="text-4xl font-bold text-white leading-tight tracking-tight">
              Technician Workspace
            </h1>
            <p className="text-primary-100/90 text-base leading-relaxed">
              Manage your daily repair jobs, track earnings, and provide top-notch service to our customers all from one secure dashboard.
            </p>
            
            <div className="grid grid-cols-1 gap-4 pt-6">
              <div className="flex items-start gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition hover:bg-white/10">
                <ShieldCheck className="h-6 w-6 text-primary-300 shrink-0" />
                <div>
                  <h3 className="text-white font-medium text-sm">Secure Access</h3>
                  <p className="text-primary-200/70 text-xs mt-1 leading-relaxed">Verified professional portal with secure one-time password login.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition hover:bg-white/10">
                <Clock className="h-6 w-6 text-primary-300 shrink-0" />
                <div>
                  <h3 className="text-white font-medium text-sm">Real-time Updates</h3>
                  <p className="text-primary-200/70 text-xs mt-1 leading-relaxed">Get instant notifications and manage your active tickets effortlessly.</p>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-primary-200/50 text-xs font-medium">
            © {new Date().getFullYear()} RepairCart. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-12 relative bg-slate-50">
        <div className="w-full max-w-[420px] relative z-10">
          <div className="mb-8 lg:hidden text-center">
            <Link href="/" className="inline-block bg-white shadow-sm p-3 rounded-2xl border border-slate-100">
              <Image src="/logo.png" alt="RepairCart" width={140} height={48} className="h-8 w-auto mx-auto" />
            </Link>
          </div>

          <div className="bg-white rounded-[1.5rem] shadow-lg shadow-slate-200/50 border border-slate-100 p-8 sm:p-10 relative">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm mb-5 text-primary-600">
                <UserCircle2 className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Welcome Back</h2>
              <p className="mt-1.5 text-sm text-slate-500 font-medium">Sign in to your technician account</p>
            </div>

            {step === 'phone' ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Mobile Number</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium group-focus-within:text-primary-600 transition-colors">+91</span>
                    <input 
                      type="tel" 
                      inputMode="numeric" 
                      maxLength={10} 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} 
                      placeholder="98765 43210"
                      className="w-full pl-14 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm" 
                      required 
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md shadow-slate-900/10 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Get OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="bg-primary-50/50 border border-primary-100/50 text-slate-700 text-sm py-3 px-4 rounded-xl flex justify-between items-center shadow-sm">
                  <span>Code sent to <strong className="font-semibold text-slate-900">+91 {phone}</strong></span>
                  <button type="button" onClick={() => setStep('phone')} className="text-primary-600 font-semibold hover:underline text-xs">Edit</button>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Enter 6-digit Code</label>
                  <input 
                    type="text" 
                    inputMode="numeric" 
                    maxLength={6} 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                    placeholder="• • • • • •"
                    className="w-full text-center tracking-[0.5em] text-2xl px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm" 
                  />
                  <p className="text-center text-xs text-slate-400 mt-3 font-medium">Mock OTP is 123456</p>
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md shadow-primary-600/20 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><ArrowRight className="h-4 w-4" /> Verify & Access</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
