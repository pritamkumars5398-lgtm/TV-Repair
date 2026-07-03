'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { adminApi } from '@/lib/api/admin';
import type { RevenueDataPoint } from '@/types';

const TABS = ['Revenue', 'Leads', 'Technicians'] as const;
type Tab = typeof TABS[number];

function toISO(date: Date) {
  return date.toISOString().split('T')[0];
}

export default function AdminReportsPage() {
  const [tab, setTab] = useState<Tab>('Revenue');
  const [from, setFrom] = useState(toISO(new Date(Date.now() - 30 * 86400000)));
  const [to, setTo] = useState(toISO(new Date()));

  const { data: revenue } = useQuery({
    queryKey: ['revenue-report', from, to],
    queryFn: () => adminApi.getRevenueChart(30).then((r) => r.data),
  });

  const { data: leadSources } = useQuery({
    queryKey: ['lead-sources-report'],
    queryFn: () => adminApi.getLeadSourceChart().then((r) => r.data),
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-2xl shadow-lg shadow-cyan-500/20 text-white">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Business Reports</h1>
            <p className="text-sm text-slate-500 font-medium">Business analytics and performance insights</p>
          </div>
        </div>
      </div>

      {/* Date range */}
      <div className="flex flex-wrap items-center gap-4 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5">
        <p className="text-sm font-bold text-slate-700">Date Range:</p>
        <div className="flex items-center gap-3">
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
            className="px-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-slate-700" />
          <span className="text-slate-400 font-medium text-sm">to</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
            className="px-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-slate-700" />
        </div>
        <div className="flex gap-2 border-l border-slate-100 pl-4 ml-2">
          {[
            { label: '7d', days: 7 }, { label: '30d', days: 30 }, { label: '90d', days: 90 },
          ].map((p) => (
            <button key={p.label} onClick={() => { setFrom(toISO(new Date(Date.now() - p.days * 86400000))); setTo(toISO(new Date())); }}
              className="px-4 py-2 text-xs font-bold border-none bg-slate-100 text-slate-600 rounded-xl hover:bg-cyan-50 hover:text-cyan-700 transition-colors">
              Last {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-2 bg-white rounded-2xl p-1.5 w-fit border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === t ? 'bg-gradient-to-r from-primary-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20' : 'bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Revenue tab */}
      {tab === 'Revenue' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Daily Revenue Growth</h2>
            {revenue?.length ? (
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} tickLine={false} axisLine={false}
                      tickFormatter={(v: string) => new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }}
                      formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} 
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[320px] flex items-center justify-center text-sm font-medium text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">No revenue data available for selected range</div>
            )}
          </div>
          {revenue?.length ? (
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { label: 'Total Revenue', value: `₹${(revenue as RevenueDataPoint[]).reduce((s, d) => s + d.revenue, 0).toLocaleString('en-IN')}` },
                { label: 'Daily Average', value: `₹${Math.round((revenue as RevenueDataPoint[]).reduce((s, d) => s + d.revenue, 0) / (revenue as RevenueDataPoint[]).length || 0).toLocaleString('en-IN')}` },
                { label: 'Best Day', value: `₹${Math.max(...(revenue as RevenueDataPoint[]).map((d) => d.revenue)).toLocaleString('en-IN')}` },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 hover:shadow-[0_8px_30px_rgb(6,182,212,0.1)] transition-shadow">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-800">{stat.value}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}

      {/* Leads tab */}
      {tab === 'Leads' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 animate-in fade-in duration-500">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Leads by Source</h2>
          {leadSources?.length ? (
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadSources} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="source" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }} cursor={{ fill: '#f1f5f9' }} />
                  <Bar dataKey="count" fill="#0ea5e9" radius={[6, 6, 6, 6]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[320px] flex items-center justify-center text-sm font-medium text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">No lead data available</div>
          )}
        </div>
      )}

      {/* Technicians tab */}
      {tab === 'Technicians' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 text-center animate-in fade-in duration-500">
          <h2 className="text-xl font-bold text-slate-800 mb-3">Technician Performance</h2>
          <p className="text-sm font-medium text-slate-500">Coming soon — advanced technician analytics and performance metrics.</p>
        </div>
      )}
    </div>
  );
}
