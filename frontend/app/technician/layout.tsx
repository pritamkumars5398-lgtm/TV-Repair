'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Briefcase, History, User, LogOut, Menu, Bell, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/stores/auth-store';
import { authApi } from '@/lib/api/auth';

const navItems = [
  { href: '/technician/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/technician/jobs',      label: 'My Jobs',    icon: Briefcase },
  { href: '/technician/history',   label: 'History',    icon: History },
  { href: '/technician/profile',   label: 'Profile',    icon: User },
];

export default function TechnicianLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    try { await authApi.logout(); } catch { /* ignore */ }
    clearAuth();
    toast.success('Logged out');
    router.push('/technician/login');
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-neutral-800">
        <Link href="/" onClick={() => setSidebarOpen(false)}>
          <Image src="/logo.png" alt="RepairCart" width={120} height={40} className="h-8 w-auto brightness-0 invert" />
        </Link>
        <p className="text-xs text-neutral-500 mt-2 font-medium uppercase tracking-wider">Technician Portal</p>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active ? 'bg-primary-600 text-white' : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
              }`}>
              <Icon className="h-4 w-4 shrink-0" />
              {label}
              {active && <ChevronRight className="h-3 w-3 ml-auto opacity-60" />}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-neutral-800">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.[0]?.toUpperCase() ?? 'T'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name ?? 'Technician'}</p>
            <p className="text-xs text-neutral-400">{user?.phone}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden">
      <aside className="hidden lg:flex lg:flex-col w-60 bg-neutral-900 shrink-0">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-50 flex flex-col w-60 bg-neutral-900">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <p className="text-sm font-semibold text-neutral-900">
              {navItems.find((n) => pathname.startsWith(n.href))?.label ?? 'Technician'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.[0]?.toUpperCase() ?? 'T'}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
