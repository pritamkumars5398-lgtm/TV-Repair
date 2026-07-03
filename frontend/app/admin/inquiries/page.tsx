'use client';

import { useState } from 'react';
import { Search, Loader2, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi } from '@/lib/api/admin';
import type { Lead, LeadStatus, LeadSource } from '@/types';

const STATUS_COLORS: Record<LeadStatus, string> = {
  NEW:                 'bg-blue-50 text-blue-700 border-blue-200',
  CONTACTED:           'bg-cyan-50 text-cyan-700 border-cyan-200',
  INSPECTION_SCHEDULED:'bg-violet-50 text-violet-700 border-violet-200',
  TV_RECEIVED:         'bg-orange-50 text-orange-700 border-orange-200',
  REPAIR_IN_PROGRESS:  'bg-yellow-50 text-yellow-800 border-yellow-200',
  QUALITY_CHECK:       'bg-indigo-50 text-indigo-700 border-indigo-200',
  READY:               'bg-teal-50 text-teal-700 border-teal-200',
  DELIVERED:           'bg-green-50 text-green-700 border-green-200',
  CLOSED:              'bg-slate-50 text-slate-600 border-slate-200',
};

const SOURCE_COLORS: Record<LeadSource, string> = {
  WEBSITE:    'bg-blue-50/70 text-blue-600 border border-blue-100',
  WHATSAPP:   'bg-green-50/70 text-green-600 border border-green-100',
  CHATBOT:    'bg-purple-50/70 text-purple-600 border border-purple-100',
  PHONE_CALL: 'bg-orange-50/70 text-orange-600 border border-orange-100',
  FACEBOOK:   'bg-indigo-50/70 text-indigo-600 border border-indigo-100',
  GOOGLE:     'bg-red-50/70 text-red-600 border border-red-100',
  REFERRAL:   'bg-teal-50/70 text-teal-600 border border-teal-100',
};

const STATUSES: LeadStatus[] = ['NEW','CONTACTED','INSPECTION_SCHEDULED','TV_RECEIVED','REPAIR_IN_PROGRESS','QUALITY_CHECK','READY','DELIVERED','CLOSED'];

export default function AdminInquiriesPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-inquiries', page, statusFilter, search],
    queryFn: () => adminApi.getLeads({ page, limit: 12, status: statusFilter || undefined, search, serviceType: 'PRODUCT_INQUIRY' }),
    placeholderData: (prev) => prev,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lead> }) => adminApi.updateLead(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-inquiries'] });
      toast.success('Inquiry updated');
    },
    onError: () => toast.error('Update failed'),
  });

  const paginatedData = data?.data;
  const inquiries: Lead[] = paginatedData?.items ?? [];
  const total = paginatedData?.total ?? 0;
  const totalPages = paginatedData?.totalPages ?? 1;

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-indigo-500 rounded-xl text-white shadow-sm shrink-0">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Product Inquiries</h1>
            <p className="text-xs text-slate-400 font-semibold">{total} total product inquiries</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Search by name or phone number..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/20 font-medium text-slate-700 placeholder:text-slate-400 transition-shadow" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/20 font-medium text-slate-700 w-full sm:w-48 cursor-pointer transition-shadow">
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3 text-left">Customer Info</th>
                <th className="px-4 py-3 text-left">Source</th>
                <th className="px-4 py-3 text-left min-w-[280px]">Product Requirement</th>
                <th className="px-4 py-3 text-left">Current Status</th>
                <th className="px-4 py-3 text-left">Date Added</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={6} className="py-12 text-center"><Loader2 className="h-6 w-6 animate-spin text-indigo-500 mx-auto" /></td></tr>
              ) : inquiries.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">No inquiries found matching your criteria.</td></tr>
              ) : inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800 text-xs">{inquiry.name}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{inquiry.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${SOURCE_COLORS[inquiry.source]}`}>{inquiry.source}</span>
                  </td>
                  <td className="px-4 py-3">
                    {inquiry.message ? (
                      <p className="text-[11px] text-slate-500 font-medium whitespace-pre-wrap max-w-[400px]">
                        {inquiry.message}
                      </p>
                    ) : (
                      <span className="text-[10px] text-slate-300 italic">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <select value={inquiry.status}
                      onChange={(e) => updateMutation.mutate({ id: inquiry.id, data: { status: e.target.value as LeadStatus } })}
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-transparent cursor-pointer focus:ring-1 focus:ring-indigo-500/25 appearance-none text-center ${STATUS_COLORS[inquiry.status]}`}>
                      {STATUSES.map((s) => <option key={s} value={s} className="bg-white text-slate-800 font-normal">{s.replace(/_/g, ' ')}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-slate-400 font-semibold">{new Date(inquiry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="px-4 py-3">
                    <a href={`tel:${inquiry.phone}`} className="inline-flex items-center justify-center px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 border border-slate-200/60 hover:border-indigo-200 text-slate-600 hover:text-indigo-600 text-[10px] font-bold rounded-lg transition-colors">
                      Call Now
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50/50">
            <p className="text-xs font-semibold text-slate-400">Showing page <span className="font-bold text-slate-700">{page}</span> of {totalPages}</p>
            <div className="flex gap-1.5">
              <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-all shadow-sm">
                <ChevronLeft className="h-4 w-4 text-slate-600" />
              </button>
              <button onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-all shadow-sm">
                <ChevronRight className="h-4 w-4 text-slate-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
