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
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-xl text-white shadow-sm shrink-0">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Business Reports</h1>
            <p className="text-xs text-slate-400 font-semibold">Business analytics and performance insights</p>
          </div>
        </div>
      </div>

      {/* Date range */}
      <div className="flex flex-wrap items-center gap-3 bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
        <p className="text-xs font-bold text-slate-700">Date Range:</p>
        <div className="flex items-center gap-2">
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-500/20 text-slate-700 outline-none" />
          <span className="text-slate-400 font-semibold text-xs">to</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-500/20 text-slate-700 outline-none" />
        </div>
        <div className="flex gap-1.5 border-l border-slate-200 pl-3 sm:ml-1">
          {[
            { label: '7d', days: 7 }, { label: '30d', days: 30 }, { label: '90d', days: 90 },
          ].map((p) => (
            <button key={p.label} onClick={() => { setFrom(toISO(new Date(Date.now() - p.days * 86400000))); setTo(toISO(new Date())); }}
              className="px-3 py-1.5 text-[10px] font-bold border border-slate-200 bg-slate-50 text-slate-600 rounded-lg hover:bg-cyan-50 hover:text-cyan-700 hover:border-cyan-200 transition-colors">
              Last {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 bg-white rounded-xl p-1 w-fit border border-slate-200/80 shadow-sm">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${tab === t ? 'bg-gradient-to-r from-primary-600 to-cyan-600 text-white shadow-sm' : 'bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Revenue tab */}
      {tab === 'Revenue' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
            <h2 className="text-sm font-bold text-slate-850 mb-4">Daily Revenue Growth</h2>
            {revenue?.length ? (
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenue} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 650 }} tickLine={false} axisLine={false}
                      tickFormatter={(v: string) => new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} dy={5} />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 650 }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '11px' }}
                      formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} 
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[240px] flex items-center justify-center text-xs font-semibold text-slate-400 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">No revenue data available for selected range</div>
            )}
          </div>
          {revenue?.length ? (
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: 'Total Revenue', value: `₹${(revenue as RevenueDataPoint[]).reduce((s, d) => s + d.revenue, 0).toLocaleString('en-IN')}` },
                { label: 'Daily Average', value: `₹${Math.round((revenue as RevenueDataPoint[]).reduce((s, d) => s + d.revenue, 0) / (revenue as RevenueDataPoint[]).length || 0).toLocaleString('en-IN')}` },
                { label: 'Best Day', value: `₹${Math.max(...(revenue as RevenueDataPoint[]).map((d) => d.revenue)).toLocaleString('en-IN')}` },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 hover:border-cyan-200 transition-colors">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}

      {/* Leads tab */}
      {tab === 'Leads' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 animate-in fade-in duration-300">
          <h2 className="text-sm font-bold text-slate-850 mb-4">Leads by Source</h2>
          {leadSources?.length ? (
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadSources} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <XAxis dataKey="source" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 650 }} tickLine={false} axisLine={false} dy={5} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 650 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '11px' }} cursor={{ fill: '#f1f5f9' }} />
                  <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[240px] flex items-center justify-center text-xs font-semibold text-slate-400 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">No lead data available</div>
          )}
        </div>
      )}

      {/* Technicians tab */}
      {tab === 'Technicians' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 text-center animate-in fade-in duration-300">
          <h2 className="text-sm font-bold text-slate-800 mb-2">Technician Performance</h2>
          <p className="text-xs font-medium text-slate-400">Coming soon — advanced technician analytics and performance metrics.</p>
        </div>
      )}
    </div>
  );
}
