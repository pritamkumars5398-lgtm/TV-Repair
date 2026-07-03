'use client';

import { Users, Ticket, IndianRupee, Wrench, CreditCard, CheckCircle2, TrendingUp, TrendingDown, MapPin, Activity, ArrowRight, Clock, Package, type LucideIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, Area, AreaChart, CartesianGrid, BarChart, Bar } from 'recharts';
import { adminApi } from '@/lib/api/admin';
import type { RevenueDataPoint, LeadSourceDataPoint } from '@/types';

const KPI_CONFIG: Array<{ key: string; label: string; icon: LucideIcon; color: string; shadow: string; prefix?: string }> = [
  { key: 'newLeadsToday',       label: 'New Leads',          icon: Users,        color: 'from-blue-500 to-cyan-400', shadow: 'shadow-blue-500/20' },
  { key: 'activeTickets',       label: 'Active Tickets',     icon: Ticket,       color: 'from-amber-500 to-orange-400', shadow: 'shadow-orange-500/20' },
  { key: 'completedJobsToday',  label: 'Completed Today',    icon: CheckCircle2, color: 'from-teal-500 to-emerald-400', shadow: 'shadow-teal-500/20' },
];

const PIE_COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#f43f5e', '#64748b'];

const WEEKLY_DATA = [
  { day: 'Mon', leads: 24, completed: 18 },
  { day: 'Tue', leads: 35, completed: 25 },
  { day: 'Wed', leads: 18, completed: 20 },
  { day: 'Thu', leads: 42, completed: 35 },
  { day: 'Fri', leads: 30, completed: 28 },
  { day: 'Sat', leads: 15, completed: 12 },
  { day: 'Sun', leads: 10, completed: 8 },
];

const PRODUCT_STATS = [
  { name: 'LED TV Panel Repair', count: 145, percentage: 85, color: 'bg-cyan-500' },
  { name: 'Mobile Touch Repair', count: 98, percentage: 65, color: 'bg-indigo-500' },
  { name: 'Speaker Manufacturing', count: 52, percentage: 35, color: 'bg-amber-500' },
  { name: 'Motherboard Service', count: 35, percentage: 20, color: 'bg-rose-500' },
];

export default function AdminDashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.getDashboard().then((r) => r.data),
    refetchInterval: 60_000,
  });

  const { data: revenue } = useQuery({
    queryKey: ['revenue-chart'],
    queryFn: () => adminApi.getRevenueChart(30).then((r) => r.data),
  });

  const { data: leadSources } = useQuery({
    queryKey: ['lead-source-chart'],
    queryFn: () => adminApi.getLeadSourceChart().then((r) => r.data),
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-5 w-5 text-cyan-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full">Live Overview</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mt-2">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-cyan-500">Admin</span> 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Here is what's happening with your repair business today.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-6">
        {KPI_CONFIG.map(({ key, label, icon: Icon, color, prefix, shadow }) => {
          const raw = stats?.[key as keyof typeof stats] ?? 0;
          const value = prefix ? `${prefix}${Number(raw).toLocaleString('en-IN')}` : String(raw);
          return (
            <div key={key} className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 relative overflow-hidden group hover:border-cyan-200 transition-colors">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-50 to-slate-100 rounded-bl-full -mr-8 -mt-8 z-0 transition-transform group-hover:scale-110"></div>
              
              <div className={`relative z-10 w-12 h-12 rounded-2xl bg-gradient-to-br ${color} ${shadow} flex items-center justify-center text-white mb-4 shadow-lg transform group-hover:-translate-y-1 transition-transform`}>
                <Icon className="h-6 w-6" />
              </div>
              <p className="relative z-10 text-3xl font-black text-slate-800 tracking-tight mb-1">{stats ? value : '—'}</p>
              <p className="relative z-10 text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts & Map Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Revenue trend */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800 text-lg">Revenue Overview</h2>
                <p className="text-xs text-slate-500 font-medium">Performance over the last 30 days</p>
              </div>
            </div>
          </div>
          {revenue?.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v: string) => new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                  formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} 
                />
                <Area type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-sm text-slate-400 font-medium">No data yet</div>
          )}
        </div>

        {/* Lead sources pie */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <TrendingDown className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-lg">Lead Sources</h2>
              <p className="text-xs text-slate-500 font-medium">Where your business comes from</p>
            </div>
          </div>
          {leadSources?.length ? (
            <div className="flex-1 min-h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={leadSources} dataKey="count" nameKey="source" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} stroke="none">
                    {leadSources.map((_: LeadSourceDataPoint, i: number) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, fontWeight: 600, paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-slate-400 font-medium">No data yet</div>
          )}
        </div>
      </div>

      {/* Lower Section: Map & Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Weekly Activity Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-50 rounded-lg">
                <Activity className="h-5 w-5 text-rose-500" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800 text-lg">Weekly Performance Activity</h2>
                <p className="text-xs text-slate-500 font-medium">New Leads vs Completed Jobs</p>
              </div>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={WEEKLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, fontWeight: 600, paddingTop: '10px' }} />
              <Bar dataKey="leads" name="New Leads" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={24} />
              <Bar dataKey="completed" name="Completed Jobs" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Products Repaired Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Package className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-lg">Product Repairs</h2>
              <p className="text-xs text-slate-500 font-medium">Top serviced devices</p>
            </div>
          </div>
          
          <div className="space-y-6 flex-1 justify-center flex flex-col">
            {PRODUCT_STATS.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-slate-700">{item.name}</span>
                  <span className="font-bold text-slate-500">{item.count} units</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className={`h-2.5 rounded-full ${item.color}`} style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Activity Horizontal List */}
      <div className="grid sm:grid-cols-3 gap-6">
        {[
          { href: '/admin/leads',   label: 'Manage New Leads',   sub: 'View and assign incoming leads', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', border: 'hover:border-blue-200' },
          { href: '/admin/tickets', label: 'Monitor Tickets',   sub: 'Track active repair statuses', icon: Ticket, color: 'text-orange-500', bg: 'bg-orange-50', border: 'hover:border-orange-200' },
          { href: '/admin/reports', label: 'Financial Reports',        sub: 'Revenue & performance metrics', icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'hover:border-emerald-200' },
        ].map((item) => (
          <a key={item.href} href={item.href}
            className={`flex items-center gap-4 p-5 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${item.border} hover:shadow-lg transition-all group bg-white`}>
            <div className={`p-4 rounded-2xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
              <item.icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-800 text-base group-hover:text-primary-600 transition-colors">{item.label}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">{item.sub}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
          </a>
        ))}
      </div>
    </div>
  );
}
