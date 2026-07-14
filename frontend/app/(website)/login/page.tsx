'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { publicApi } from '@/lib/api/public';
import { useCustomerStore } from '@/lib/stores/customer-store';
import User from '../../../assets/img/User1 (1).png';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userData, setUserData] = useState<{ name: string } | null>(null);
  const [form, setForm] = useState({ email: '', password: '' });
  const setAuth = useCustomerStore((state) => state.setAuth);

  useEffect(() => {
    const hasSignedUp = localStorage.getItem('customer_has_signed_up');
    const override = searchParams.get('override') === 'true';
    if (hasSignedUp !== 'true' && !override) {
      router.push('/signup');
    } else {
      if (override) {
        localStorage.setItem('customer_has_signed_up', 'true');
      }
      setCheckingAuth(false);
    }
  }, [router, searchParams]);

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
        router.push(redirect);
      }, 1500);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
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
          src={User}
          alt="Premium Service"
          fill
          className="object-cover opacity-100"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute bottom-12 left-12 right-12 z-10 text-white animate-in slide-in-from-bottom-4 duration-500 fade-in">
          <div className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold mb-4">
            ✨ Welcome to the future of repairs
          </div>
          <h2 className="text-3xl font-extrabold mb-3 leading-tight text-white">
            Premium Service,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">Right at your doorstep.</span>
          </h2>
          <p className="text-sm text-slate-300 font-medium max-w-sm leading-relaxed mt-3">
            Track your repairs in real-time, view detailed invoices, and experience world-class support with our expert technicians.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 relative overflow-hidden">
        {/* Subtle Background Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h1>
            <p className="mt-2 text-sm text-slate-500 font-medium">Please sign in to manage your bookings.</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-8 space-y-6">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="rajesh@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-800 placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Password</label>
                  <Link href="/forgot-password" className="text-xs font-bold text-primary-650 hover:text-cyan-650 transition-colors">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-800 placeholder:text-slate-400"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white font-extrabold py-3.5 rounded-xl text-sm transition-all shadow-md hover:shadow-lg active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none mt-6"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><ArrowRight className="h-5 w-5" /> Sign In</>}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm font-semibold text-slate-500">
              Don't have an account?{' '}
              <Link href="/signup?override=true" className="text-blue-600 font-bold hover:text-cyan-650 transition-colors">
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

export default function WebsiteLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}
