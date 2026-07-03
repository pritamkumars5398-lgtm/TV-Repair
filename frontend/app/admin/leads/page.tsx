'use client';

import { useState } from 'react';
import { Search, Plus, Loader2, ChevronLeft, ChevronRight, X, Users } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi } from '@/lib/api/admin';
import type { Lead, LeadStatus, LeadSource, ServiceType } from '@/types';

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

export default function AdminLeadsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', phone: '', email: '', source: 'WEBSITE' as LeadSource, serviceType: 'TV_REPAIR' as ServiceType, message: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-leads', page, statusFilter, search],
    queryFn: () => adminApi.getLeads({ page, limit: 12, status: statusFilter || undefined, search, excludeServiceType: 'PRODUCT_INQUIRY' }),
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
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-xl text-white shadow-sm shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Leads Management</h1>
            <p className="text-xs text-slate-400 font-semibold">{total} active leads in pipeline</p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all">
          <Plus className="h-4 w-4" /> Add New Lead
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Search by name or phone number..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500/20 font-medium text-slate-700 placeholder:text-slate-400 transition-shadow" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500/20 font-medium text-slate-700 w-full sm:w-48 cursor-pointer transition-shadow">
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
                <th className="px-4 py-3 text-left">Service Type</th>
                <th className="px-4 py-3 text-left">Notes</th>
                <th className="px-4 py-3 text-left">Current Status</th>
                <th className="px-4 py-3 text-left">Date Added</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={7} className="py-12 text-center"><Loader2 className="h-6 w-6 animate-spin text-cyan-500 mx-auto" /></td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-slate-400 font-semibold">No leads found matching your criteria.</td></tr>
              ) : leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800 text-xs">{lead.name}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{lead.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${SOURCE_COLORS[lead.source]}`}>{lead.source}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-500">{lead.serviceType?.replace(/_/g, ' ') ?? '—'}</td>
                  <td className="px-4 py-3">
                    {lead.message ? (
                      <p className="text-[11px] text-slate-400 font-semibold line-clamp-1 max-w-[160px]" title={lead.message}>
                        {lead.message}
                      </p>
                    ) : (
                      <span className="text-[10px] text-slate-300 italic">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <select value={lead.status}
                      onChange={(e) => updateMutation.mutate({ id: lead.id, data: { status: e.target.value as LeadStatus } })}
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-transparent cursor-pointer focus:ring-1 focus:ring-cyan-500/25 appearance-none text-center ${STATUS_COLORS[lead.status]}`}>
                      {STATUSES.map((s) => <option key={s} value={s} className="bg-white text-slate-800 font-normal">{s.replace(/_/g, ' ')}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-slate-400 font-semibold">{new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="px-4 py-3">
                    <a href={`tel:${lead.phone}`} className="inline-flex items-center justify-center px-3 py-1.5 bg-slate-100 hover:bg-cyan-50 border border-slate-200/60 hover:border-cyan-200 text-slate-600 hover:text-cyan-600 text-[10px] font-bold rounded-lg transition-colors">
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
            <p className="text-xs font-semibold text-slate-400">Showing page <span className="font-bold text-slate-600">{page}</span> of {totalPages}</p>
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

      {/* Add Lead Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800">Add New Lead</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {(['name','phone','email'] as const).map((field) => (
                <div key={field}>
                  <label className="block text-xs font-bold text-slate-500 mb-1 capitalize">{field} {field === 'email' && <span className="text-slate-400 font-medium">(optional)</span>}</label>
                  <input type={field === 'email' ? 'email' : 'text'} value={newLead[field]}
                    onChange={(e) => setNewLead((l) => ({ ...l, [field]: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500/20 font-medium" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Source</label>
                <select value={newLead.source} onChange={(e) => setNewLead((l) => ({ ...l, source: e.target.value as LeadSource }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500/20 font-medium">
                  {(['WEBSITE','WHATSAPP','PHONE_CALL','FACEBOOK','GOOGLE','REFERRAL'] as LeadSource[]).map((s) =>
                    <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Notes</label>
                <textarea rows={2} value={newLead.message} onChange={(e) => setNewLead((l) => ({ ...l, message: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500/20 font-medium resize-none" />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                  Cancel
                </button>
                <button onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !newLead.name || !newLead.phone}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white text-xs font-bold py-2 rounded-lg shadow-sm transition-all disabled:opacity-60">
                  {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Lead'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
