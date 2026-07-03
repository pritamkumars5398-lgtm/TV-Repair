'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores/auth-store';

type Step = 'details' | 'otp';

export default function CustomerRegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [step, setStep] = useState<Step>('details');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [otp, setOtp] = useState('');

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (form.name.length < 2) { toast.error('Enter your full name'); return; }
    if (!/^[6-9]\d{9}$/.test(form.phone)) { toast.error('Enter a valid 10-digit mobile number'); return; }
    setLoading(true);
    try {
      await authApi.sendOtp(form.phone);
      toast.success('OTP sent to ' + form.phone);
      setStep('otp');
    } catch {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) { toast.error('Enter the 6-digit OTP'); return; }
    setLoading(true);
    try {
      const res = await authApi.register({ ...form, otp });
      setAuth(res.data.user, res.data.token);
      toast.success('Account created! Welcome, ' + res.data.user.name);
      router.push('/portal/dashboard');
    } catch {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-100/40 via-slate-50 to-slate-50" />
      <div className="absolute -left-40 -bottom-40 w-96 h-96 bg-cyan-100/50 rounded-full blur-3xl" />
      
      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <Image src="/logo.png" alt="RepairCart" width={160} height={55} className="h-12 w-auto mx-auto transition-transform group-hover:scale-105" priority />
          </Link>
          <h1 className="mt-8 text-3xl font-extrabold text-slate-800 tracking-tight">Create Account</h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">Track repairs and manage your service history</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-cyan-500" />
          
          {step === 'details' ? (
            <form onSubmit={handleSendOtp} className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="Rajesh Kumar"
                  className="w-full px-4 py-3.5 bg-slate-50/50 border-2 border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:border-cyan-100 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 transition-all shadow-sm placeholder:text-slate-300 placeholder:font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold border-r border-slate-200 pr-3">+91</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    className="w-full pl-16 pr-4 py-3.5 bg-slate-50/50 border-2 border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:border-cyan-100 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 transition-all shadow-sm placeholder:text-slate-300 placeholder:font-medium"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email <span className="text-slate-400 normal-case font-medium">(optional)</span></label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="rajesh@example.com"
                  className="w-full px-4 py-3.5 bg-slate-50/50 border-2 border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:border-cyan-100 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 transition-all shadow-sm placeholder:text-slate-300 placeholder:font-medium"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 mt-4"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><UserPlus className="h-5 w-5" /> Send OTP</>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-50 to-cyan-50 rounded-2xl mb-4 shadow-inner border border-white">
                  <UserPlus className="h-8 w-8 text-cyan-600" />
                </div>
                <p className="text-sm font-medium text-slate-600">OTP sent to <span className="font-bold text-slate-800">+91 {form.phone}</span></p>
                <button type="button" onClick={() => setStep('details')} className="text-xs font-bold text-primary-600 hover:text-cyan-600 transition-colors mt-2">Change details</button>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">Enter 6-Digit OTP</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full text-center text-2xl tracking-[0.5em] font-bold px-4 py-3.5 bg-slate-50/50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-cyan-100 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 transition-all shadow-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm font-medium text-slate-500">
              Already have an account?{' '}
              <Link href="/portal/login" className="text-primary-600 font-bold hover:text-cyan-600 transition-colors">
                Login here
              </Link>
            </p>
          </div>
        </div>
        
        <p className="text-center mt-6 text-sm font-medium text-slate-400">
          <Link href="/" className="hover:text-slate-600 transition-colors inline-flex items-center gap-1">
            <UserPlus className="h-4 w-4 rotate-180 opacity-0 hidden" /> Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
