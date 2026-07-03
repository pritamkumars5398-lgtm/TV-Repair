'use client';

import { useState } from 'react';
import { Search, Loader2, ChevronLeft, ChevronRight, Ticket as TicketIcon } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi } from '@/lib/api/admin';
import type { Ticket, TicketStatus } from '@/types';

const STATUS_LABELS: Record<TicketStatus, string> = {
  tv_received:         'TV Received',
  diagnosis_completed: 'Diagnosed',
  parts_ordered:       'Parts Ordered',
  repair_in_progress:  'In Progress',
  quality_check:       'Quality Check',
  ready_for_delivery:  'Ready',
  delivered:           'Delivered',
};

const STATUS_COLORS: Record<TicketStatus, string> = {
  tv_received:         'bg-blue-100 text-blue-700',
  diagnosis_completed: 'bg-cyan-100 text-cyan-700',
  parts_ordered:       'bg-orange-100 text-orange-700',
  repair_in_progress:  'bg-yellow-100 text-yellow-800',
  quality_check:       'bg-indigo-100 text-indigo-700',
  ready_for_delivery:  'bg-teal-100 text-teal-700',
  delivered:           'bg-green-100 text-green-700',
};

const ALL_STATUSES = Object.keys(STATUS_LABELS) as TicketStatus[];

const SERVICE_LABELS: Record<string, string> = {
  TV_REPAIR: 'TV Repair', SPEAKER_REPAIR: 'Speaker', HOME_VISIT: 'Home Visit',
  SPEAKER_INSTALL: 'Speaker Install', HOME_THEATER: 'Home Theater',
};

export default function AdminTicketsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-tickets', search, statusFilter, page],
    queryFn: () => adminApi.getTickets({ search: search || undefined, status: statusFilter || undefined, page, limit: 20 }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => adminApi.updateTicket(id, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-tickets'] }); toast.success('Status updated'); },
    onError: () => toast.error('Update failed'),
  });

  const paginatedData = data?.data;
  const tickets: Ticket[] = paginatedData?.items ?? [];
  const totalPages = paginatedData?.totalPages ?? 1;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-2xl shadow-lg shadow-cyan-500/20 text-white">
            <TicketIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Support Tickets</h1>
            <p className="text-sm text-slate-500 font-medium">{paginatedData?.total ?? 0} active tickets in system</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input type="text" placeholder="Search by ticket ID or customer name..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-medium text-slate-700 placeholder:text-slate-400" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-medium text-slate-700 w-full sm:w-64 appearance-none cursor-pointer">
          <option value="">All Statuses</option>
          {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4 text-left rounded-tl-3xl">Ticket ID</th>
                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-left">Service Type</th>
                <th className="px-6 py-4 text-left">Technician</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left rounded-tr-3xl">Scheduled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={6} className="py-20 text-center"><Loader2 className="h-8 w-8 animate-spin text-cyan-500 mx-auto" /></td></tr>
              ) : tickets.length === 0 ? (
                <tr><td colSpan={6} className="py-20 text-center text-slate-400 font-medium">No tickets found matching your criteria.</td></tr>
              ) : tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-bold text-cyan-700 bg-cyan-50 px-3 py-1.5 rounded-lg border border-cyan-100">{ticket.ticketId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{ticket.customerName}</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{ticket.customerPhone}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600">{SERVICE_LABELS[ticket.serviceType] ?? ticket.serviceType}</td>
                  <td className="px-6 py-4 font-medium text-slate-600">
                    {ticket.technicianName ?? <span className="text-slate-400 italic">Unassigned</span>}
                  </td>
                  <td className="px-6 py-4">
                    <select value={ticket.status}
                      onChange={(e) => updateMutation.mutate({ id: ticket.id, status: e.target.value })}
                      className={`text-xs font-bold px-3 py-1 rounded-full border-none cursor-pointer focus:ring-2 focus:ring-cyan-500/20 appearance-none text-center ${STATUS_COLORS[ticket.status]}`}>
                      {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                    {ticket.scheduledAt ? new Date(ticket.scheduledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
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
    </div>
  );
}
