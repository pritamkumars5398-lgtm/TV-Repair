'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, Ticket, UserCheck, Package,
  FileText, CreditCard, BarChart2, Settings, Globe,
  LogOut, Menu, Bell, ChevronRight, Wrench, ChevronDown, User,
  MessageSquare,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/stores/auth-store';
import { authApi } from '@/lib/api/auth';

const allNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'manager'] },
  { href: '/admin/tickets', label: 'Repairs', icon: Ticket, roles: ['admin', 'manager', 'technician'] },
  { href: '/admin/leads', label: 'Leads', icon: Users, roles: ['admin', 'manager'] },
  { href: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare, roles: ['admin', 'manager'] },
  { href: '/admin/customers', label: 'Customers', icon: UserCheck, roles: ['admin', 'manager'] },
  { href: '/admin/technicians', label: 'Technicians', icon: Wrench, roles: ['admin', 'manager'] },
  // { href: '/admin/inventory',   label: 'Inventory',    icon: Package,         roles: ['admin'] },
  // { href: '/admin/invoices',    label: 'Invoices',     icon: FileText,        roles: ['admin', 'manager'] },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard, roles: ['admin'] },
  { href: '/admin/products', label: 'Products', icon: Package, roles: ['admin', 'manager'] },
  { href: '/admin/blogs', label: 'Blogs', icon: Globe, roles: ['admin', 'manager'] },
  { href: '/admin/feedback', label: 'Feedback', icon: MessageSquare, roles: ['admin', 'manager'] },
  { href: '/admin/reports', label: 'Reports', icon: BarChart2, roles: ['admin', 'manager'] },
  // { href: '/admin/content', label: 'Website', icon: Globe, roles: ['admin'] },
  { href: '/admin/settings', label: 'Settings', icon: Settings, roles: ['admin'] },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // If it's the login page, render it full screen without the dashboard layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = allNavItems.filter((item) =>
    !user?.role || item.roles.includes(user.role)
  );

  async function handleLogout() {
    try { await authApi.logout(); } catch { /* ignore */ }
    clearAuth();
    toast.success('Logged out');
    router.push('/admin/login');
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <Link href="/" onClick={() => setSidebarOpen(false)}>
          <Image src="/logo.png" alt="RepairCart" width={140} height={45} className="h-7 w-auto" />
        </Link>
      </div>

      <div className="px-6 py-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {user?.role === 'admin' ? 'System Admin' : 'Branch Manager'}
        </p>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-0.5 overflow-y-auto">
        <p className="px-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${active
                ? 'bg-primary-50 text-primary-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}>
              <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-primary-600' : 'text-slate-400'}`} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <button onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors">
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 z-20">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-slate-900/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-50 flex flex-col w-64 bg-white">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-1.5 rounded-md text-slate-500 hover:bg-slate-100 transition-colors" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold text-slate-800">
              {navItems.find((n) => pathname.startsWith(n.href))?.label ?? 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Search (Mock) */}
            <div className="hidden md:flex items-center bg-slate-100 rounded-md px-3 py-1.5 border border-slate-200">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input type="text" placeholder="Search..." className="bg-transparent border-none focus:outline-none text-sm ml-2 text-slate-700 placeholder:text-slate-400 w-40" />
            </div>

            <button className="relative p-1.5 rounded-md text-slate-500 hover:bg-slate-100 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            <div className="relative">
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded-md transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-sm font-semibold">
                  {user?.name?.[0]?.toUpperCase() ?? 'A'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-slate-700 leading-tight">{user?.name ?? 'Admin User'}</p>
                  <p className="text-[10px] text-slate-500 uppercase">{user?.role ?? 'Admin'}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400 ml-1" />
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-800 truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <Link href="/admin/settings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                    <User className="h-4 w-4" /> Profile
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 w-full text-left">
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-slate-50/50">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
