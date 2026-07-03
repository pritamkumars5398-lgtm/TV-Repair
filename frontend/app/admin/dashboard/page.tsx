'use client';

import { Users, Ticket, IndianRupee, Wrench, CreditCard, CheckCircle2, TrendingUp, TrendingDown, MapPin, Activity, ArrowRight, Clock, Package, type LucideIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, Area, AreaChart, CartesianGrid, BarChart, Bar } from 'recharts';
import { adminApi } from '@/lib/api/admin';
import type { RevenueDataPoint, LeadSourceDataPoint } from '@/types';

const KPI_CONFIG: Array<{ key: string; label: string; icon: LucideIcon; color: string; shadow: string; prefix?: string }> = [
  { key: 'newLeadsToday',       label: 'New Leads',          icon: Users,        color: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-500/10' },
  { key: 'activeTickets',       label: 'Active Tickets',     icon: Ticket,       color: 'from-amber-500 to-orange-500', shadow: 'shadow-orange-500/10' },
  { key: 'completedJobsToday',  label: 'Completed Today',    icon: CheckCircle2, color: 'from-teal-500 to-emerald-500', shadow: 'shadow-teal-500/10' },
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-cyan-500">Admin</span> 👋
          </h1>
          <p className="text-xs text-slate-500 font-medium">Here is what's happening with your repair business today.</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-100">
          <Activity className="h-3.5 w-3.5 text-cyan-500 animate-pulse" />
          <span>Live Overview</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {KPI_CONFIG.map(({ key, label, icon: Icon, color, prefix, shadow }) => {
          const raw = stats?.[key as keyof typeof stats] ?? 0;
          const value = prefix ? `${prefix}${Number(raw).toLocaleString('en-IN')}` : String(raw);
          return (
            <div key={key} className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center gap-4 hover:border-cyan-300 transition-colors">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} ${shadow} flex items-center justify-center text-white shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 tracking-tight">{stats ? value : '—'}</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-5">
        
        {/* Revenue trend */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-primary-50 rounded-lg">
                <TrendingUp className="h-4 w-4 text-primary-600" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800 text-sm">Revenue Overview</h2>
                <p className="text-[10px] text-slate-400 font-medium">Performance over the last 30 days</p>
              </div>
            </div>
          </div>
          {revenue?.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenue} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(v: string) => new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} dy={5} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '11px', fontWeight: 'bold' }}
                  formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} 
                />
                <Area type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-xs text-slate-400 font-medium">No data yet</div>
          )}
        </div>

        {/* Lead sources pie */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 flex flex-col">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-1.5 bg-indigo-50 rounded-lg">
              <TrendingDown className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-sm">Lead Sources</h2>
              <p className="text-[10px] text-slate-400 font-medium">Where your business comes from</p>
            </div>
          </div>
          {leadSources?.length ? (
            <div className="flex-1 min-h-[220px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={leadSources} dataKey="count" nameKey="source" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} stroke="none">
                    {leadSources.map((_: LeadSourceDataPoint, i: number) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '11px' }} />
                  <Legend iconType="circle" iconSize={6} wrapperStyle={{ fontSize: 10, fontWeight: 600, paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400 font-medium">No data yet</div>
          )}
        </div>
      </div>

      {/* Weekly & Products breakdown */}
      <div className="grid lg:grid-cols-3 gap-5">
        
        {/* Weekly Performance Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-1.5 bg-rose-50 rounded-lg">
              <Activity className="h-4 w-4 text-rose-500" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-sm">Weekly Performance</h2>
              <p className="text-[10px] text-slate-400 font-medium">New Leads vs Completed Jobs</p>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={WEEKLY_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} dy={5} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '11px', fontWeight: 'bold' }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Legend iconType="circle" iconSize={6} wrapperStyle={{ fontSize: 10, fontWeight: 600, paddingTop: '5px' }} />
              <Bar dataKey="leads" name="New Leads" fill="#06b6d4" radius={[3, 3, 0, 0]} barSize={12} />
              <Bar dataKey="completed" name="Completed Jobs" fill="#8b5cf6" radius={[3, 3, 0, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Products breakdown */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 flex flex-col">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-1.5 bg-amber-50 rounded-lg">
              <Package className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-sm">Product Services</h2>
              <p className="text-[10px] text-slate-400 font-medium">Top serviced categories</p>
            </div>
          </div>
          
          <div className="space-y-4 flex-1 justify-center flex flex-col">
            {PRODUCT_STATS.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">{item.name}</span>
                  <span className="font-bold text-slate-500">{item.count} units</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions horizontal navigation */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { href: '/admin/leads',   label: 'Manage New Leads',   sub: 'View and assign incoming leads', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', border: 'hover:border-blue-300' },
          { href: '/admin/tickets', label: 'Monitor Tickets',   sub: 'Track active repair statuses', icon: Ticket, color: 'text-orange-500', bg: 'bg-orange-50', border: 'hover:border-orange-300' },
          { href: '/admin/reports', label: 'Financial Reports',        sub: 'Revenue & performance metrics', icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'hover:border-emerald-300' },
        ].map((item) => (
          <a key={item.href} href={item.href}
            className={`flex items-center gap-3.5 p-4 rounded-xl border border-slate-200/80 shadow-sm ${item.border} hover:shadow-md transition-all group bg-white`}>
            <div className={`p-3 rounded-xl ${item.bg} ${item.color} group-hover:scale-105 transition-transform`}>
              <item.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 text-sm group-hover:text-primary-600 transition-colors truncate">{item.label}</p>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5 truncate">{item.sub}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}
