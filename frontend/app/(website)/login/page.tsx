'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import { useRouter } from 'next/navigation';
import { publicApi } from '@/lib/api/public';
import { useCustomerStore } from '@/lib/stores/customer-store';
import User from '../../../assets/img/User1 (1).png'

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

      // Auto redirect after 2.5 seconds
      setTimeout(() => {
        router.push('/');
      }, 2500);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Left Side - Image (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-100 overflow-hidden">
        <Image
          src={User}
          alt="Premium Service"
          fill
          className="object-cover transition-transform duration-1000 hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />

        {/* Abstract Glowing Orbs */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary-500/30 rounded-full blur-3xl mix-blend-screen" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-500/30 rounded-full blur-3xl mix-blend-screen" />

        <div className="absolute bottom-16 left-16 right-16 z-10 text-white animate-in slide-in-from-bottom-8 duration-1000 fade-in">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-bold tracking-wide mb-6">
            ✨ Welcome to the future of repairs
          </div>
          <h2 className="text-4xl font-extrabold mb-4 leading-tight">
            Premium Service, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">Right at your doorstep.</span>
          </h2>
          <p className="text-lg text-slate-300 font-medium max-w-md leading-relaxed">
            Track your repairs in real-time, view detailed invoices, and experience world-class support with our expert technicians.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-50/50 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-50/50 rounded-full blur-3xl opacity-60 pointer-events-none" />

        <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Welcome Back</h1>
            <p className="mt-2 text-sm text-slate-500 font-medium">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="rajesh@example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:border-primary-100 focus:bg-white focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm placeholder:text-slate-300 placeholder:font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                <Link href="#" className="text-xs font-bold text-primary-600 hover:text-cyan-600 transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:border-primary-100 focus:bg-white focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm placeholder:text-slate-300 placeholder:font-medium"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 mt-8"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><ArrowRight className="h-5 w-5" /> Login to Account</>}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm font-medium text-slate-500">
              Don't have an account?{' '}
              <Link href="/signup" className="text-primary-600 font-bold hover:text-cyan-600 transition-colors">
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Success Modal Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-8 text-center animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-100 rounded-full blur-3xl opacity-50" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-100 rounded-full blur-3xl opacity-50" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-[bounce_1s_ease-in-out_infinite]">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-800 mb-2">Welcome Back!</h3>
              <p className="text-slate-500 font-medium mb-8">
                {userData?.name}, you have successfully logged in. Redirecting you to the homepage...
              </p>

              <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
