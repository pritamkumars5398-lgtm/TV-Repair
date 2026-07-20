'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Loader2, ChevronLeft, ChevronRight, ChevronDown, Ticket as TicketIcon, MessageSquare } from 'lucide-react';
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
  
  // Estimate Modal State
  const [selectedTicketForEstimate, setSelectedTicketForEstimate] = useState<Ticket | null>(null);
  const [adminEstimateAmount, setAdminEstimateAmount] = useState('');
  const [adminEstimateBreakdown, setAdminEstimateBreakdown] = useState('');

  // Message Modal State
  const [selectedTicketForMessage, setSelectedTicketForMessage] = useState<Ticket | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [expectedDate, setExpectedDate] = useState('');

  const searchParams = useSearchParams();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-tickets', search, statusFilter, page],
    queryFn: () => adminApi.getTickets({ search: search || undefined, status: statusFilter || undefined, page, limit: 20 }),
  });

  const { data: techData } = useQuery({
    queryKey: ['admin-technicians'],
    queryFn: () => adminApi.getTechnicians({ limit: 100 }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => adminApi.updateTicket(id, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-tickets'] }); toast.success('Status updated'); },
    onError: () => toast.error('Update failed'),
  });

  const assignMutation = useMutation({
    mutationFn: ({ ticketId, technicianId }: { ticketId: string; technicianId: string }) => adminApi.assignTechnicianToTicket(ticketId, technicianId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-tickets'] }); toast.success('Technician assigned successfully'); },
    onError: () => toast.error('Failed to assign technician'),
  });

  const sendEstimateMutation = useMutation({
    mutationFn: () => adminApi.sendEstimateToCustomer(selectedTicketForEstimate!.ticketId, { amount: parseFloat(adminEstimateAmount), breakdown: adminEstimateBreakdown }),
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ['admin-tickets'] }); 
      toast.success('Estimate sent to customer!');
      setSelectedTicketForEstimate(null);
    },
    onError: () => toast.error('Failed to send estimate'),
  });

  const sendMessageMutation = useMutation({
    mutationFn: () => adminApi.sendMessageToCustomer(selectedTicketForMessage!.ticketId, { message: customMessage, date: expectedDate }),
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ['admin-tickets'] }); 
      toast.success('Message sent to customer!');
      setSelectedTicketForMessage(null);
      setCustomMessage('');
      setExpectedDate('');
      
      if (searchParams.get('action') === 'message') {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('action');
        newUrl.searchParams.delete('ticketId');
        window.history.replaceState({ path: newUrl.href }, '', newUrl.href);
      }
    },
    onError: () => toast.error('Failed to send message'),
  });

  const paginatedData = data?.data;
  const tickets: Ticket[] = paginatedData?.items ?? [];
  const technicians = techData?.data?.items ?? [];
  const totalPages = paginatedData?.totalPages ?? 1;

  useEffect(() => {
    const action = searchParams.get('action');
    const ticketId = searchParams.get('ticketId');
    if (action === 'message' && ticketId && tickets.length > 0) {
      const ticket = tickets.find((t) => t.ticketId === ticketId);
      if (ticket && !selectedTicketForMessage) {
        setSelectedTicketForMessage(ticket);
      }
    }
  }, [searchParams, tickets, selectedTicketForMessage]);

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
                <th className="px-4 py-3 text-right">Actions</th>
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
                    <div className="relative inline-block w-full max-w-[150px]">
                      <select
                        value={(ticket as any).technicianId || ''}
                        onChange={(e) => {
                          if (e.target.value) {
                            assignMutation.mutate({ ticketId: ticket.ticketId, technicianId: e.target.value });
                          }
                        }}
                        className="w-full text-[10px] font-bold pl-2.5 pr-6 py-1 rounded border border-slate-200 bg-slate-50 cursor-pointer focus:ring-1 focus:ring-cyan-500/25 appearance-none text-slate-700 hover:bg-white transition-colors"
                      >
                        <option value="">Unassigned</option>
                        {technicians.map((tech) => (
                          <option key={tech.id} value={tech.id}>
                            {tech.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none opacity-50" />
                    </div>
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
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-col items-end gap-2">
                      {(ticket as any).estimateStatus === 'pending_admin_review' && (
                        <button 
                          onClick={() => {
                            setSelectedTicketForEstimate(ticket);
                            setAdminEstimateAmount(((ticket as any).techAssessmentAmount || '').toString());
                            setAdminEstimateBreakdown((ticket as any).techAssessmentBreakdown || '');
                          }}
                          className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded hover:bg-amber-200 transition-colors"
                        >
                          Review Assessment
                        </button>
                      )}
                      {(ticket as any).estimateStatus === 'sent_to_customer' && (
                        <button 
                          onClick={() => {
                            setSelectedTicketForEstimate(ticket);
                            setAdminEstimateAmount(((ticket as any).adminEstimateAmount || (ticket as any).techAssessmentAmount || '').toString());
                            setAdminEstimateBreakdown((ticket as any).adminEstimateBreakdown || (ticket as any).techAssessmentBreakdown || '');
                          }}
                          className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded hover:bg-slate-200 transition-colors"
                        >
                          Edit Estimate
                        </button>
                      )}
                      {(ticket as any).estimateStatus === 'approved' && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">Approved</span>
                      )}
                      {(ticket as any).estimateStatus === 'rejected' && (
                        <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-1 rounded">Rejected</span>
                      )}
                      <button
                        onClick={() => setSelectedTicketForMessage(ticket)}
                        className="flex items-center gap-1 text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors mt-1"
                      >
                        <MessageSquare className="h-3 w-3" /> Message
                      </button>
                    </div>
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

      {/* Send Estimate Modal */}
      {selectedTicketForEstimate && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800">Send Estimate to Customer</h2>
              <button onClick={() => setSelectedTicketForEstimate(null)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">Technician's Assessment</p>
                <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{(selectedTicketForEstimate as any).techAssessmentBreakdown}</p>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Final Amount to Charge (₹)</label>
                <input type="number" value={adminEstimateAmount} onChange={e => setAdminEstimateAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Problem Description & Cost Breakdown</label>
                <textarea rows={4} value={adminEstimateBreakdown} onChange={e => setAdminEstimateBreakdown(e.target.value)}
                  placeholder="e.g. Problem: Speaker blown. Breakdown: Speaker cost ₹500, Labor ₹200."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 resize-none" />
              </div>
              
              <button onClick={() => sendEstimateMutation.mutate()} disabled={sendEstimateMutation.isPending || !adminEstimateAmount}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg text-sm transition-colors flex justify-center items-center gap-2">
                {sendEstimateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Approve & Send to Customer
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Send Message Modal */}
      {selectedTicketForMessage && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800">Message Customer</h2>
              <button onClick={() => setSelectedTicketForMessage(null)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Update Message for {selectedTicketForMessage.customerName}</label>
                <textarea rows={4} value={customMessage} onChange={e => setCustomMessage(e.target.value)}
                  placeholder="e.g. Your repair has started. We are waiting for the spare parts..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Expected Delivery Date (Optional)</label>
                <input type="date" value={expectedDate} onChange={e => setExpectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>
              
              <button onClick={() => sendMessageMutation.mutate()} disabled={sendMessageMutation.isPending || !customMessage}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition-colors flex justify-center items-center gap-2">
                {sendMessageMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
