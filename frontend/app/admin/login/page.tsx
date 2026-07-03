'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Loader2, ArrowRight, Lock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores/auth-store';
import type { UserRole } from '@/types';

export default function AdminLoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('admin');
  const [loading, setLoading] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phone) && phone !== '1234567890') { 
      toast.error('Enter a valid 10-digit mobile number'); 
      return; 
    }
    if (!password) {
      toast.error('Enter your password');
      return;
    }
    setLoading(true);
    
    try {
      const res: any = await authApi.adminLogin({ phone, password });
      
      if (res && res.token) {
        setAuth({
          id: res._id || 'admin-dev',
          name: res.name || 'System Admin',
          email: res.email || '',
          phone: res.phone || phone,
          role: res.role || role
        }, res.token);
        
        setSuccessPopup(true);
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 2000);
      }
    } catch (error: any) {
      // Allow hardcoded bypass if backend is not running yet (for demo purposes)
      if (phone === '9876543210' && password === 'admin123') {
        setAuth({
          id: 'admin-dev',
          name: 'System Admin',
          email: 'admin@longwell.com',
          phone: phone,
          role: role
        }, 'mock-admin-token');
        setSuccessPopup(true);
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 2000);
      } else {
        toast.error(error.response?.data?.message || 'Invalid credentials or server down.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 relative overflow-hidden font-sans">
      
      {/* Clean Background Pattern (Optional subtle dots or just plain) */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/">
            <Image src="/logo.png" alt="RepairCart" width={140} height={48} className="h-10 w-auto mx-auto" />
          </Link>
          <div className="mt-8 inline-flex items-center justify-center w-16 h-16 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <Shield className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="mt-5 text-3xl font-extrabold text-slate-900 tracking-tight">Admin Portal</h1>
          <p className="mt-2 text-sm text-slate-500 font-medium tracking-wide">Authorised personnel only</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors appearance-none"
              >
                <option value="admin" className="text-slate-900">System Admin</option>
                <option value="manager" className="text-slate-900">Branch Manager</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Mobile Number</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-medium">+91</span>
                <input
                  type="tel" inputMode="numeric" maxLength={10}
                  value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="w-full pl-14 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors placeholder:text-slate-400 font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-medium">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors placeholder:text-slate-400 font-medium"
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-all shadow-sm disabled:opacity-60 hover:-translate-y-0.5">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><ArrowRight className="h-5 w-5" /> Login to Dashboard</>}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center mt-8 text-xs text-slate-500 font-medium">
          <Link href="/" className="hover:text-primary-600 transition-colors">← Return to Public Site</Link>
        </p>
      </div>
      
      {/* Success Popup Overlay */}
      {successPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white border border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center shadow-2xl animate-in zoom-in-90 duration-500 w-full max-w-sm text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 border border-emerald-200">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">Access Granted</h2>
            <p className="text-emerald-600 font-medium mb-8">Welcome back to the portal</p>
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Loading Dashboard...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
