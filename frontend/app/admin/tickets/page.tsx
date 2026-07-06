'use client';

import { useState } from 'react';
import { Search, Loader2, ChevronLeft, ChevronRight, ChevronDown, Ticket as TicketIcon } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi } from '@/lib/api/admin';
import type { Ticket, TicketStatus } from '@/types';

const STATUS_LABELS: Record<TicketStatus, string> = {
  tv_received:         'Received',
  diagnosis_completed: 'Diagnosed',
  parts_ordered:       'Parts Ordered',
  repair_in_progress:  'In Progress',
  quality_check:       'Quality Check',
  ready_for_delivery:  'Ready',
  delivered:           'Delivered',
};

const STATUS_COLORS: Record<TicketStatus, string> = {
  tv_received:         'bg-blue-50 text-blue-700 border border-blue-200',
  diagnosis_completed: 'bg-cyan-50 text-cyan-700 border border-cyan-200',
  parts_ordered:       'bg-orange-50 text-orange-700 border border-orange-200',
  repair_in_progress:  'bg-yellow-50 text-yellow-800 border border-yellow-200',
  quality_check:       'bg-indigo-50 text-indigo-700 border border-indigo-200',
  ready_for_delivery:  'bg-teal-50 text-teal-700 border border-teal-200',
  delivered:           'bg-green-50 text-green-700 border border-green-200',
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
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-xl text-white shadow-sm shrink-0">
            <TicketIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Support Tickets</h1>
            <p className="text-xs text-slate-400 font-semibold">{paginatedData?.total ?? 0} active tickets in system</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Search by ticket ID or customer name..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500/20 font-medium text-slate-700 placeholder:text-slate-400 transition-shadow" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500/20 font-medium text-slate-700 w-full sm:w-48 cursor-pointer transition-shadow">
          <option value="">All Statuses</option>
          {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3 text-left">Ticket ID</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Service Type</th>
                <th className="px-4 py-3 text-left">Technician</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Scheduled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={6} className="py-12 text-center"><Loader2 className="h-6 w-6 animate-spin text-cyan-500 mx-auto" /></td></tr>
              ) : tickets.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">No tickets found matching your criteria.</td></tr>
              ) : tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-4 py-3">
                    <span className="font-mono text-[10px] font-bold text-cyan-700 bg-cyan-50 border border-cyan-150 px-2 py-1 rounded-md">{ticket.ticketId}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800 text-xs">{ticket.customerName}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{ticket.customerPhone}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-500">{SERVICE_LABELS[ticket.serviceType] ?? ticket.serviceType}</td>
                  <td className="px-4 py-3 font-semibold text-slate-500">
                    {ticket.technicianName ?? <span className="text-slate-300 italic">Unassigned</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative inline-block">
                      <select value={ticket.status}
                        onChange={(e) => updateMutation.mutate({ id: ticket.id, status: e.target.value })}
                        className={`text-[10px] font-bold pl-2.5 pr-6 py-0.5 rounded-full border border-transparent cursor-pointer focus:ring-1 focus:ring-cyan-500/25 appearance-none text-left ${STATUS_COLORS[ticket.status]}`}>
                        {ALL_STATUSES.map((s) => <option key={s} value={s} className="bg-white text-slate-800 font-normal">{STATUS_LABELS[s]}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none opacity-60" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {ticket.scheduledAt ? (
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-800">
                          {new Date(ticket.scheduledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Scheduled</p>
                      </div>
                    ) : ticket.preferredDate ? (
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-700">
                          {ticket.preferredDate} at {ticket.preferredTime}
                        </p>
                        <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Preferred Slot</p>
                      </div>
                    ) : (
                      <span className="text-slate-400 font-semibold">—</span>
                    )}
                    {ticket.address && (
                      <p className="text-[10px] text-slate-400 font-medium truncate max-w-[200px] mt-1" title={ticket.address}>
                        {ticket.address}
                      </p>
                    )}
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
    </div>
  );
}
