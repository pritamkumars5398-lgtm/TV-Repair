'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, Ticket, UserCheck, Package,
  FileText, CreditCard, BarChart2, Settings, Globe,
  LogOut, Menu, Bell, ChevronRight, Wrench, ChevronDown, User,
  MessageSquare, Loader2, Search
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/stores/auth-store';
import { authApi } from '@/lib/api/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';

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
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // Global Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { data: searchResults, isLoading: isSearchLoading } = useQuery({
    queryKey: ['globalSearch', debouncedSearch],
    queryFn: () => adminApi.globalSearch(debouncedSearch),
    enabled: debouncedSearch.length > 1,
  });

  const { data: notificationsData } = useQuery({
    queryKey: ['adminNotifications'],
    queryFn: () => adminApi.getNotifications(),
    refetchInterval: 30000,
    enabled: pathname !== '/admin/login',
  });

  const notifications = notificationsData?.data || [];
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const markReadMutation = useMutation({
    mutationFn: (id: string) => adminApi.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminNotifications'] });
    }
  });

  const handleNotificationClick = (n: any) => {
    if (!n.isRead) {
      markReadMutation.mutate(n.id);
    }
    setNotificationsOpen(false);
    if (n.link) {
      router.push(n.link);
    }
  };

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
            {/* Global Search */}
            <div className="hidden md:flex relative" ref={searchRef}>
              <div className="flex items-center bg-slate-100 rounded-md px-3 py-1.5 border border-slate-200">
                <Search className="w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search tickets, customers, leads..." 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  className="bg-transparent border-none focus:outline-none text-sm ml-2 text-slate-700 placeholder:text-slate-400 w-56 lg:w-72" 
                />
                {isSearchLoading && searchQuery.length > 1 && (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-400 ml-2" />
                )}
              </div>

              {searchOpen && searchQuery.length > 1 && (
                <div className="absolute top-full left-0 mt-2 w-80 lg:w-96 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-[400px] overflow-y-auto">
                  {searchResults?.data?.tickets?.length === 0 && searchResults?.data?.customers?.length === 0 && searchResults?.data?.leads?.length === 0 && !isSearchLoading && (
                    <div className="p-4 text-center text-sm text-slate-500">No results found for "{searchQuery}"</div>
                  )}

                  {searchResults?.data?.tickets && searchResults.data.tickets.length > 0 && (
                    <div className="py-2">
                      <div className="px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50">Tickets</div>
                      {searchResults.data.tickets.map((t: any) => (
                        <Link 
                          key={t._id} 
                          href={`/admin/tickets?search=${t.ticketId}`}
                          onClick={() => setSearchOpen(false)}
                          className="block px-4 py-2 hover:bg-slate-50 transition-colors"
                        >
                          <div className="font-semibold text-sm text-cyan-700">{t.ticketId}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{t.customerName} &bull; {t.status.replace(/_/g, ' ')}</div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {searchResults?.data?.customers && searchResults.data.customers.length > 0 && (
                    <div className="py-2 border-t border-slate-100">
                      <div className="px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50">Customers</div>
                      {searchResults.data.customers.map((c: any) => (
                        <Link 
                          key={c._id} 
                          href={`/admin/customers?search=${c.phone}`}
                          onClick={() => setSearchOpen(false)}
                          className="block px-4 py-2 hover:bg-slate-50 transition-colors"
                        >
                          <div className="font-semibold text-sm text-slate-800">{c.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{c.phone} &bull; {c.email}</div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {searchResults?.data?.leads && searchResults.data.leads.length > 0 && (
                    <div className="py-2 border-t border-slate-100">
                      <div className="px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50">Leads</div>
                      {searchResults.data.leads.map((l: any) => (
                        <Link 
                          key={l._id} 
                          href={`/admin/leads?search=${l.phone}`}
                          onClick={() => setSearchOpen(false)}
                          className="block px-4 py-2 hover:bg-slate-50 transition-colors"
                        >
                          <div className="font-semibold text-sm text-slate-800">{l.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{l.phone} &bull; {l.status}</div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-1.5 rounded-md text-slate-500 hover:bg-slate-100 transition-colors"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
                )}
              </button>
              
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50 max-h-96 overflow-y-auto">
                  <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                    <p className="text-sm font-semibold text-slate-800">Notifications</p>
                    {unreadCount > 0 && (
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">{unreadCount} New</span>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-slate-500">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n: any) => (
                      <div 
                        key={n.id} 
                        onClick={() => handleNotificationClick(n)}
                        className={`px-4 py-3 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${!n.isRead ? 'bg-blue-50/50' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <p className={`text-sm ${!n.isRead ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>{n.title}</p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
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
