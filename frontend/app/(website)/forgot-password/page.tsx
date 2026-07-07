'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, Mail, Lock, KeyRound, ArrowLeft, ShieldCheck, Hash } from 'lucide-react';
import { toast } from 'sonner';
import { publicApi } from '@/lib/api/public';
import User from '../../../assets/img/User1 (1).png';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) {
      toast.error('Enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await publicApi.sendOTP({ email });
      toast.success('OTP sent successfully to your email.');
      setStep(2);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP. Please check your email.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length < 4) {
      toast.error('Enter a valid OTP');
      return;
    }

    setLoading(true);
    try {
      await publicApi.verifyOTP({ email, otp });
      toast.success('OTP verified successfully!');
      setStep(3);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await publicApi.resetPasswordWithOTP({
        email,
        otp,
        newPassword,
      });
      toast.success('Password reset successfully! Please login with your new password.');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
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
          className="object-cover opacity-100"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute bottom-12 left-12 right-12 z-10 text-white animate-in slide-in-from-bottom-4 duration-500 fade-in">
          <div className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold mb-4">
            🔒 Secure Password Reset
          </div>
          <h2 className="text-3xl font-extrabold mb-3 leading-tight text-white">
            Reset Password,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">Back in just a few clicks.</span>
          </h2>
          <p className="text-sm text-slate-300 font-medium max-w-sm leading-relaxed mt-3">
            Easily recover access to your TV Repair account using secure OTP verification.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 relative overflow-hidden">
        {/* Subtle Background Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="mb-8 text-center lg:text-left">
            {step === 1 ? (
              <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-cyan-600 transition-colors mb-4 uppercase tracking-wider">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            ) : (
              <button 
                onClick={() => setStep((s) => (s - 1) as any)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-cyan-600 transition-colors mb-4 uppercase tracking-wider"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Forgot Password</h1>
            <p className="mt-2 text-sm text-slate-500 font-medium">
              {step === 1 && 'Enter your registered email address to receive an OTP.'}
              {step === 2 && 'Enter the 6-digit OTP code sent to your email.'}
              {step === 3 && 'Choose a new, secure password for your account.'}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-6">
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail className="w-5 h-5" />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rajesh@example.com"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-800 placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white font-extrabold py-3.5 rounded-xl text-sm transition-all shadow-md hover:shadow-lg active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none mt-6"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Mail className="h-5 w-5" /> Send OTP</>}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">One-Time Password (OTP)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Hash className="w-5 h-5" />
                    </span>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full pl-11 pr-4 py-3 tracking-widest text-center bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-800 placeholder:text-slate-350"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white font-extrabold py-3.5 rounded-xl text-sm transition-all shadow-md hover:shadow-lg active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none mt-6"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><ShieldCheck className="h-5 w-5" /> Verify OTP</>}
                </button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">New Password</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock className="w-5 h-5" />
                    </span>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-800 placeholder:text-slate-400"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Confirm New Password</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <KeyRound className="w-5 h-5" />
                    </span>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><KeyRound className="h-5 w-5" /> Reset Password</>}
                </button>
              </form>
            )}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm font-semibold text-slate-500">
              Remembered your password?{' '}
              <Link href="/login" className="text-blue-600 font-bold hover:text-cyan-650 transition-colors">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
