'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { publicApi } from '@/lib/api/public';
import { useCustomerStore } from '@/lib/stores/customer-store';
import User from '../../../assets/img/User1 (1).png';

export default function WebsiteLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userData, setUserData] = useState<{ name: string } | null>(null);
  const [form, setForm] = useState({ email: '', password: '' });
  const setAuth = useCustomerStore((state) => state.setAuth);

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email.includes('@')) { toast.error('Enter a valid email address'); return; }
    if (form.password.length < 6) { toast.error('Enter a valid password'); return; }

    setLoading(true);

    try {
      const data = await publicApi.loginCustomer(form);
      setAuth(
        { id: data.id, name: data.name, email: data.email },
        data.token
      );
      setUserData({ name: data.name });
      setShowSuccess(true);

      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex font-sans">
      {/* Left Side - Image (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden select-none">
        <Image
          src={User}
          alt="Premium Service"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        <div className="absolute bottom-12 left-12 right-12 z-10 text-white animate-in slide-in-from-bottom-4 duration-500 fade-in">
          <div className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold mb-4">
            ✨ Welcome to the future of repairs
          </div>
          <h2 className="text-3xl font-extrabold mb-3 leading-tight">
            Premium Service,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">Right at your doorstep.</span>
          </h2>
          <p className="text-sm text-slate-300 font-medium max-w-sm leading-relaxed">
            Track your repairs in real-time, view detailed invoices, and experience world-class support with our expert technicians.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
        {/* Subtle Background Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        <div className="w-full max-w-xs relative z-10 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="mb-6 text-center lg:text-left">
            <h1 className="text-xl font-bold text-slate-805 tracking-tight">Welcome Back</h1>
            <p className="mt-1 text-xs text-slate-400 font-semibold">Please sign in to manage your bookings.</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="rajesh@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary-500/20 text-slate-850 placeholder:text-slate-350"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
                  <Link href="#" className="text-[10px] font-bold text-primary-650 hover:text-cyan-600 transition-colors">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary-500/20 text-slate-850 placeholder:text-slate-350"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white font-bold py-2.5 rounded-lg text-xs transition-all shadow-sm disabled:opacity-60 mt-4"
              >
                {loading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <><ArrowRight className="h-4 w-4" /> Sign In</>}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs font-semibold text-slate-400">
              Don't have an account?{' '}
              <Link href="/signup" className="text-primary-650 font-bold hover:text-cyan-650 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Success Modal Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-[280px] p-5 text-center animate-in zoom-in-95 duration-300">
            <div className="w-10 h-10 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mb-3 mx-auto">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="text-sm font-bold text-slate-850 mb-1">Welcome Back!</h3>
            <p className="text-[10px] text-slate-400 font-semibold mb-4">
              {userData?.name}, you have successfully signed in.
            </p>
            <div className="flex flex-col items-center gap-1.5">
              <Loader2 className="w-4 h-4 text-primary-500 animate-spin" />
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Redirecting...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
