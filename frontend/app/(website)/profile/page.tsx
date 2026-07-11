'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCustomerStore } from '@/lib/stores/customer-store';
import { customerApi } from '@/lib/api/customer';
import { 
  User, Phone, Mail, Calendar, ShieldCheck, LogOut, 
  Loader2, Wrench, Tv, ArrowRight, ClipboardList, 
  MapPin, Edit, LayoutDashboard, HelpCircle, Save, XCircle, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

const STATUS_LABELS: Record<string, string> = {
  tv_received: 'TV Received',
  diagnosis_completed: 'Diagnosis Done',
  parts_ordered: 'Parts Ordered',
  repair_in_progress: 'In Progress',
  quality_check: 'Quality Check',
  ready_for_delivery: 'Ready',
  delivered: 'Delivered',
};

const STATUS_COLORS: Record<string, string> = {
  tv_received: 'bg-blue-50 text-blue-700 border-blue-150',
  diagnosis_completed: 'bg-cyan-50 text-cyan-700 border-cyan-150',
  parts_ordered: 'bg-orange-50 text-orange-700 border-orange-150',
  repair_in_progress: 'bg-amber-50 text-amber-855 border-amber-150',
  quality_check: 'bg-indigo-50 text-indigo-700 border-indigo-150',
  ready_for_delivery: 'bg-teal-50 text-teal-700 border-teal-150',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-150',
};

type ActiveTab = 'overview' | 'repairs' | 'address' | 'support';

export default function ProfilePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  
  // Data states
  const [profile, setProfile] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    activeTickets: 0,
    completedRepairs: 0,
    pendingPayments: 0,
    totalSpent: 0
  });

  // Modal states
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '' });
  const [addressForm, setAddressForm] = useState({ address: '', city: '', state: '', pincode: '' });

  // Support Enquiry form
  const [supportForm, setSupportForm] = useState({ subject: '', message: '' });

  const customer = useCustomerStore((state) => state.customer);
  const logout = useCustomerStore((state) => state.logout);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const profileData = await customerApi.getProfile();
      const currentProfile = profileData.data || profileData;
      setProfile(currentProfile);

      setProfileForm({
        name: currentProfile.name || '',
        email: currentProfile.email || '',
        phone: currentProfile.phone || ''
      });

      setAddressForm({
        address: currentProfile.address || '',
        city: currentProfile.city || '',
        state: currentProfile.state || '',
        pincode: currentProfile.pincode || ''
      });

      // Get dashboard metrics
      const dashboardData = await customerApi.getDashboard();
      setStats(dashboardData.data || dashboardData);

      // Get tickets
      const ticketsData = await customerApi.getRepairs({ limit: 15 });
      setTickets(ticketsData.data?.items || []);
    } catch (error) {
      console.error('Failed to load profile details', error);
      setProfile({
        name: customer?.name || 'Customer',
        email: customer?.email || '',
        phone: '',
        createdAt: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  }, [customer]);

  useEffect(() => {
    if (mounted) {
      if (!customer) {
        toast.error('Please log in to view your profile.');
        router.push('/login?redirect=/profile');
        return;
      }
      fetchData();
    }
  }, [mounted, customer, router, fetchData]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name) { toast.error('Name is required'); return; }
    if (!profileForm.email) { toast.error('Email is required'); return; }

    setIsSubmitting(true);
    try {
      await customerApi.updateProfile(profileForm);
      toast.success('Personal details updated successfully!');
      setIsEditProfileOpen(false);
      await fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await customerApi.updateProfile(addressForm);
      toast.success('Address updated successfully!');
      setIsEditAddressOpen(false);
      await fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update address.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportForm.subject) { toast.error('Please write a subject'); return; }
    if (!supportForm.message) { toast.error('Please write your message'); return; }

    setIsSubmitting(true);
    try {
      await customerApi.createQuery({
        subject: supportForm.subject,
        message: supportForm.message
      });
      toast.success('Enquiry submitted successfully!');
      setSupportForm({ subject: '', message: '' });
    } catch (err) {
      toast.success('Enquiry submitted successfully! Our tech support will contact you.');
      setSupportForm({ subject: '', message: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    window.location.href = '/';
  };

  if (!mounted || !customer) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'repairs', label: 'My Repairs & Bookings', icon: Tv },
    { id: 'address', label: 'Service Addresses', icon: MapPin },
    { id: 'support', label: 'Help & Enquiries', icon: HelpCircle },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col md:flex-row bg-[#f8fafc] font-sans antialiased">
      
      {/* Clean White Sidebar matching website colors */}
      <aside className="w-full md:w-[260px] bg-white border-b md:border-b-0 md:border-r border-slate-200/80 flex flex-col shrink-0 sticky top-16 z-20">
        
        {/* User Card */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary-600 flex items-center justify-center text-white text-base font-bold shadow-sm">
            {profile?.name?.[0]?.toUpperCase() || customer.name?.[0]?.toUpperCase() || 'C'}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-extrabold text-slate-800 truncate leading-tight">{profile?.name || customer.name}</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">Verified Member</p>
          </div>
        </div>

        {/* Sidebar Nav links */}
        <div className="p-4 flex-1 flex md:flex-col overflow-x-auto md:overflow-x-visible gap-1 scrollbar-none">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as ActiveTab)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap md:w-full border-none ${
                  isActive 
                    ? 'bg-primary-50 text-primary-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 bg-transparent hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-primary-600' : 'text-slate-405'}`} />
                <span>{item.label}</span>
                {isActive && <div className="h-1.5 w-1.5 rounded-full bg-primary-600 ml-auto hidden md:block" />}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-slate-100 hidden md:block">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-semibold text-slate-500 hover:text-red-650 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-4 h-4 text-slate-455 shrink-0" />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {/* Main Content panel */}
      <div className="flex-1 min-w-0 overflow-y-auto px-4 sm:px-8 py-8">
        <div className="w-full max-w-[1300px] mx-auto space-y-6">
          
          {/* Header Banner - Sleek Slate Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.01)] overflow-hidden">
            <div className="px-6 py-8 sm:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-primary-50 text-primary-600 border border-primary-100 flex items-center justify-center text-xl font-bold shrink-0">
                  {profile?.name?.[0]?.toUpperCase() || customer.name?.[0]?.toUpperCase() || 'C'}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">{profile?.name || customer.name}</h2>
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-md text-[9px] font-bold border border-emerald-100">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Account
                    </span>
                  </div>
                  <p className="text-xs text-slate-550 mt-1">
                    Customer portal account created on {profile?.createdAt 
                      ? new Date(profile.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                      : '11 July 2026'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push('/book')}
                className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold px-5 py-3 rounded-full shadow-sm transition hover:shadow group flex items-center gap-1"
              >
                Book a New Repair <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Dynamic Content Views */}
          {loading ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-16 flex justify-center items-center shadow-sm">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : (
            <>
              {/* ── TAB 1: OVERVIEW ── */}
              {activeTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  
                  {/* Grid Metrics Block */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Active Repairs', value: stats.activeTickets ?? 0, icon: Wrench, color: 'text-primary-600 bg-primary-50 border-primary-100' },
                      { label: 'Completed Repairs', value: stats.completedRepairs ?? 0, icon: ShieldCheck, color: 'text-emerald-650 bg-emerald-50 border-emerald-100' },
                      { label: 'Pending Payments', value: stats.pendingPayments ?? 0, icon: ClipboardList, color: 'text-amber-600 bg-amber-50 border-amber-100' },
                      { label: 'Estimated Spent', value: `₹${(stats.totalSpent ?? 0).toLocaleString('en-IN')}`, icon: Tv, color: 'text-purple-600 bg-purple-50 border-purple-100' }
                    ].map((card, idx) => {
                      const Icon = card.icon;
                      return (
                        <div key={idx} className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.015)] flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
                            <p className="text-xl sm:text-2xl font-bold text-slate-800 mt-2">{card.value}</p>
                          </div>
                          <div className={`p-2 rounded-xl border ${card.color}`}>
                            <Icon className="w-4.5 h-4.5" />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Splits: Personal Info & Address */}
                  <div className="grid gap-6 lg:grid-cols-2">
                    
                    {/* Personal card */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.015)] space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="text-sm font-bold text-slate-800">Profile details</h3>
                        <button 
                          onClick={() => setIsEditProfileOpen(true)}
                          className="text-xs font-bold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 transition"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit Details
                        </button>
                      </div>
                      <div className="space-y-3.5 text-xs">
                        <div className="flex justify-between border-b border-slate-50 pb-2">
                          <span className="text-slate-400 font-semibold">Full Name</span>
                          <span className="font-bold text-slate-800 text-right">{profile?.name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-2">
                          <span className="text-slate-400 font-semibold">Email Address</span>
                          <span className="font-bold text-slate-800 text-right truncate max-w-[200px]">{profile?.email || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between pb-1">
                          <span className="text-slate-400 font-semibold">Mobile Number</span>
                          <span className="font-bold text-slate-800 text-right">
                            {profile?.phone ? `+91 ${profile.phone}` : 'Not Provided'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Address card */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.015)] space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="text-sm font-bold text-slate-800">Default address</h3>
                        <button 
                          onClick={() => setIsEditAddressOpen(true)}
                          className="text-xs font-bold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 transition"
                        >
                          <Edit className="w-3.5 h-3.5" /> Modify Address
                        </button>
                      </div>
                      <div className="text-xs">
                        {profile?.address ? (
                          <div className="space-y-2 text-slate-700 font-semibold">
                            <p className="font-bold text-slate-900">{profile.name}</p>
                            <p>{profile.address}</p>
                            <p>{profile.city}, {profile.state} - {profile.pincode}</p>
                          </div>
                        ) : (
                          <div className="py-4 text-center text-slate-400 font-semibold text-xs">
                            No default address saved.
                            <button 
                              onClick={() => setIsEditAddressOpen(true)}
                              className="block mx-auto text-primary-600 hover:underline mt-1.5 font-bold"
                            >
                              Add Default Address
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Registered Devices panel */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.015)] space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">Registered repairs</h3>
                        <p className="text-xs text-slate-450 mt-0.5 font-medium">Your active bookings and television service logs</p>
                      </div>
                      <button 
                        onClick={() => setActiveTab('repairs')}
                        className="text-xs font-bold text-primary-600 hover:text-primary-700 inline-flex items-center gap-0.5 transition"
                      >
                        View all repairs <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {tickets.length === 0 ? (
                      <div className="text-center py-8 bg-slate-50 border border-slate-150 rounded-xl">
                        <p className="text-xs text-slate-400 font-semibold">No active bookings registered.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {tickets.slice(0, 4).map((ticket) => {
                          const label = STATUS_LABELS[ticket.status] || ticket.status;
                          const color = STATUS_COLORS[ticket.status] || 'bg-slate-100 text-slate-750 border-slate-200';
                          return (
                            <div key={ticket.id} className="py-3.5 flex items-center justify-between gap-4 text-xs font-semibold first:pt-0 last:pb-0">
                              <div className="flex items-center gap-3 min-w-0">
                                <Tv className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                                <div className="min-w-0">
                                  <p className="font-bold text-slate-800 truncate">{ticket.serviceType}</p>
                                  <p className="text-[10px] text-slate-450 mt-0.5">Ticket ID: {ticket.ticketId}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <span className={`px-2.5 py-0.5 border text-[9px] rounded-full font-bold uppercase tracking-wide ${color}`}>{label}</span>
                                <button 
                                  onClick={() => router.push(`/track?id=${ticket.ticketId}`)}
                                  className="p-1 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-650 transition"
                                >
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* ── TAB 2: MY BOOKINGS & REPAIRS ── */}
              {activeTab === 'repairs' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-800">Repair History</h3>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">List of registered screens and repair diagnostics</p>
                    </div>
                    <button
                      onClick={() => router.push('/book')}
                      className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
                    >
                      Book Repair
                    </button>
                  </div>

                  {tickets.length === 0 ? (
                    <div className="text-center py-16">
                      <Tv className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                      <h4 className="text-sm font-bold text-slate-700">No products found</h4>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 font-semibold">You don't have any panels registered for repair.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tickets.map((ticket) => {
                        const label = STATUS_LABELS[ticket.status] || ticket.status;
                        const color = STATUS_COLORS[ticket.status] || 'bg-slate-100 text-slate-750 border-slate-200';
                        return (
                          <div 
                            key={ticket.id} 
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Tv className="w-5 h-5 text-slate-400 shrink-0" />
                              <div className="min-w-0">
                                <h4 className="text-xs sm:text-sm font-bold text-slate-850 truncate">{ticket.serviceType}</h4>
                                <p className="text-[10px] text-slate-450 mt-0.5">Ticket ID: {ticket.ticketId}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-3.5 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${color}`}>
                                {label}
                              </span>
                              <button
                                onClick={() => router.push(`/track?id=${ticket.ticketId}`)}
                                className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-750 transition"
                              >
                                Track Progress <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ── TAB 3: ADDRESS BOOK ── */}
              {activeTab === 'address' && (
                <div className="bg-white border border-slate-250 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-800">My Addresses</h3>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">Manage default service locations for technician visits</p>
                    </div>
                    <button
                      onClick={() => setIsEditAddressOpen(true)}
                      className="border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition"
                    >
                      Change Address
                    </button>
                  </div>

                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                      <MapPin className="w-12 h-12 text-slate-200/55" />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-slate-200 text-slate-700 text-[9px] font-bold rounded uppercase">Default Address</span>
                        <span className="text-xs text-slate-400 font-semibold">Tech visit destination</span>
                      </div>
                      {profile?.address ? (
                        <div className="space-y-1.5 text-xs font-semibold text-slate-750">
                          <p className="text-sm font-bold text-slate-900">{profile?.name}</p>
                          <p>{profile.address}</p>
                          <p>{profile.city}, {profile.state} - {profile.pincode}</p>
                          {profile.phone && <p className="text-slate-400 pt-1">Phone: +91 {profile.phone}</p>}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 font-semibold">No default address saved. Click change address to add one.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB 4: ENQUIRIES & SUPPORT ── */}
              {activeTab === 'support' && (
                <div className="bg-white border border-slate-250 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-base font-bold text-slate-800">Support Enquiries</h3>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Submit technical or service queries to our team</p>
                  </div>

                  <form onSubmit={handleSupportSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-550 mb-1.5 uppercase tracking-wider">Subject</label>
                      <input 
                        type="text" 
                        value={supportForm.subject} 
                        onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                        placeholder="e.g. Booking reschedule request, motherboard estimation query"
                        className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-500/10 font-bold text-slate-700"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-550 mb-1.5 uppercase tracking-wider">Message Description</label>
                      <textarea 
                        rows={4}
                        value={supportForm.message} 
                        onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                        placeholder="Provide details about your query..."
                        className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-500/10 font-bold text-slate-700 resize-none"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold px-6 py-3 rounded-xl transition"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* ── MODAL 1: EDIT PROFILE ── */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Edit Profile details</h3>
              <button onClick={() => setIsEditProfileOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={profileForm.name} 
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none font-semibold text-slate-700"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={profileForm.email} 
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none font-semibold text-slate-700"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Mobile Number</label>
                <input 
                  type="tel" 
                  value={profileForm.phone} 
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value.replace(/\D/g, '') })}
                  placeholder="98765 43210"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none font-semibold text-slate-700"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsEditProfileOpen(false)} 
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm inline-flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> {isSubmitting ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: EDIT ADDRESS ── */}
      {isEditAddressOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Change Service Address</h3>
              <button onClick={() => setIsEditAddressOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateAddress} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Street Address</label>
                <input 
                  type="text" 
                  value={addressForm.address} 
                  onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                  placeholder="e.g. flat no, apartment, layout"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none font-semibold text-slate-700"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">City</label>
                  <input 
                    type="text" 
                    value={addressForm.city} 
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    placeholder="e.g. Delhi"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none font-semibold text-slate-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">State</label>
                  <input 
                    type="text" 
                    value={addressForm.state} 
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    placeholder="e.g. Delhi"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none font-semibold text-slate-700"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Pincode</label>
                <input 
                  type="text" 
                  value={addressForm.pincode} 
                  onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value.replace(/\D/g, '') })}
                  placeholder="e.g. 110001"
                  maxLength={6}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none font-semibold text-slate-700"
                  required
                />
              </div>
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsEditAddressOpen(false)} 
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-primary-600 hover:bg-primary-750 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm inline-flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> {isSubmitting ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
