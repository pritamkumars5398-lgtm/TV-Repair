'use client';

import { useState } from 'react';
import { Search, Plus, Loader2, ChevronLeft, ChevronRight, X, Users } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi } from '@/lib/api/admin';
import type { Lead, LeadStatus, LeadSource, ServiceType } from '@/types';

const STATUS_COLORS: Record<LeadStatus, string> = {
  NEW:                 'bg-blue-100 text-blue-700',
  CONTACTED:           'bg-cyan-100 text-cyan-700',
  INSPECTION_SCHEDULED:'bg-violet-100 text-violet-700',
  TV_RECEIVED:         'bg-orange-100 text-orange-700',
  REPAIR_IN_PROGRESS:  'bg-yellow-100 text-yellow-800',
  QUALITY_CHECK:       'bg-indigo-100 text-indigo-700',
  READY:               'bg-teal-100 text-teal-700',
  DELIVERED:           'bg-green-100 text-green-700',
  CLOSED:              'bg-neutral-100 text-neutral-600',
};

const SOURCE_COLORS: Record<LeadSource, string> = {
  WEBSITE:    'bg-blue-50 text-blue-600',
  WHATSAPP:   'bg-green-50 text-green-600',
  CHATBOT:    'bg-purple-50 text-purple-600',
  PHONE_CALL: 'bg-orange-50 text-orange-600',
  FACEBOOK:   'bg-indigo-50 text-indigo-600',
  GOOGLE:     'bg-red-50 text-red-600',
  REFERRAL:   'bg-teal-50 text-teal-600',
};

const STATUSES: LeadStatus[] = ['NEW','CONTACTED','INSPECTION_SCHEDULED','TV_RECEIVED','REPAIR_IN_PROGRESS','QUALITY_CHECK','READY','DELIVERED','CLOSED'];

export default function AdminLeadsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', phone: '', email: '', source: 'WEBSITE' as LeadSource, serviceType: 'TV_REPAIR' as ServiceType, message: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-leads', page, statusFilter, search],
    queryFn: () => adminApi.getLeads({ page, limit: 10, status: statusFilter || undefined, search, excludeServiceType: 'PRODUCT_INQUIRY' }),
    placeholderData: (prev) => prev,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lead> }) => adminApi.updateLead(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-leads'] });
      toast.success('Lead updated');
    },
    onError: () => toast.error('Update failed'),
  });

  const createMutation = useMutation({
    mutationFn: () => adminApi.createLead(newLead),
    onSuccess: () => {
      toast.success('Lead created');
      setShowModal(false);
      setNewLead({ name: '', phone: '', email: '', source: 'WEBSITE', serviceType: 'TV_REPAIR', message: '' });
      qc.invalidateQueries({ queryKey: ['admin-leads'] });
    },
    onError: () => toast.error('Failed to create lead'),
  });

  const paginatedData = data?.data;
  const leads: Lead[] = paginatedData?.items ?? [];
  const total = paginatedData?.total ?? 0;
  const totalPages = paginatedData?.totalPages ?? 1;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-2xl shadow-lg shadow-cyan-500/20 text-white">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Leads Management</h1>
            <p className="text-sm text-slate-500 font-medium">{total} active leads in pipeline</p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-lg shadow-cyan-500/25 transition-all">
          <Plus className="h-5 w-5" /> Add New Lead
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input type="text" placeholder="Search by name or phone number..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-medium text-slate-700 placeholder:text-slate-400" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-medium text-slate-700 w-full sm:w-64 appearance-none cursor-pointer">
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4 text-left rounded-tl-3xl">Customer Info</th>
                <th className="px-6 py-4 text-left">Source</th>
                <th className="px-6 py-4 text-left">Service Type</th>
                <th className="px-6 py-4 text-left">Notes</th>
                <th className="px-6 py-4 text-left">Current Status</th>
                <th className="px-6 py-4 text-left">Date Added</th>
                <th className="px-6 py-4 text-left rounded-tr-3xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={7} className="py-20 text-center"><Loader2 className="h-8 w-8 animate-spin text-cyan-500 mx-auto" /></td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan={7} className="py-20 text-center text-slate-400 font-medium">No leads found matching your criteria.</td></tr>
              ) : leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{lead.name}</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{lead.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${SOURCE_COLORS[lead.source]}`}>{lead.source}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600">{lead.serviceType?.replace(/_/g, ' ') ?? '—'}</td>
                  <td className="px-6 py-4">
                    {lead.message ? (
                      <p className="text-xs text-slate-500 font-medium line-clamp-2 max-w-[200px]" title={lead.message}>
                        {lead.message}
                      </p>
                    ) : (
                      <span className="text-xs text-slate-300 italic">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <select value={lead.status}
                      onChange={(e) => updateMutation.mutate({ id: lead.id, data: { status: e.target.value as LeadStatus } })}
                      className={`text-xs font-bold px-3 py-1 rounded-full border-none cursor-pointer focus:ring-2 focus:ring-cyan-500/20 appearance-none text-center ${STATUS_COLORS[lead.status]}`}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs font-medium">{new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="px-6 py-4">
                    <a href={`tel:${lead.phone}`} className="inline-flex items-center justify-center px-4 py-2 bg-slate-100 hover:bg-cyan-50 text-slate-600 hover:text-cyan-600 text-xs font-bold rounded-xl transition-colors">
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
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <p className="text-sm font-medium text-slate-500">Showing page <span className="font-bold text-slate-700">{page}</span> of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 transition-all shadow-sm">
                <ChevronLeft className="h-5 w-5 text-slate-600" />
              </button>
              <button onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 transition-all shadow-sm">
                <ChevronRight className="h-5 w-5 text-slate-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Lead Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Add New Lead</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {(['name','phone','email'] as const).map((field) => (
                <div key={field}>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 capitalize">{field} {field === 'email' && <span className="text-slate-400 font-medium">(optional)</span>}</label>
                  <input type={field === 'email' ? 'email' : 'text'} value={newLead[field]}
                    onChange={(e) => setNewLead((l) => ({ ...l, [field]: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-medium" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Source</label>
                <select value={newLead.source} onChange={(e) => setNewLead((l) => ({ ...l, source: e.target.value as LeadSource }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-medium">
                  {(['WEBSITE','WHATSAPP','PHONE_CALL','FACEBOOK','GOOGLE','REFERRAL'] as LeadSource[]).map((s) =>
                    <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Notes</label>
                <textarea rows={2} value={newLead.message} onChange={(e) => setNewLead((l) => ({ ...l, message: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-medium resize-none" />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowModal(false)} className="px-5 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                  Cancel
                </button>
                <button onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !newLead.name || !newLead.phone}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white text-sm font-bold py-3 rounded-xl shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-60">
                  {createMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Lead'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
