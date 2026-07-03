'use client';

import { useState } from 'react';
import { CreditCard, CheckCircle2, XCircle, Clock, RefreshCw, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import type { Payment, PaymentStatus } from '@/types';

const STATUS_CONFIG: Record<PaymentStatus, { label: string; icon: typeof CheckCircle2; color: string }> = {
  PENDING:  { label: 'Pending',  icon: Clock,        color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  CAPTURED: { label: 'Paid',     icon: CheckCircle2, color: 'bg-green-50 text-green-700 border-green-200' },
  FAILED:   { label: 'Failed',   icon: XCircle,      color: 'bg-red-50 text-red-700 border-red-200' },
  REFUNDED: { label: 'Refunded', icon: RefreshCw,    color: 'bg-slate-50 text-slate-600 border-slate-200' },
};

export default function AdminPaymentsPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-payments', statusFilter, page],
    queryFn: () => adminApi.getPayments({ status: statusFilter || undefined, page, limit: 20 }),
  });

  const paginatedData = data?.data;
  const payments: Payment[] = paginatedData?.items ?? [];
  const totalPages = paginatedData?.totalPages ?? 1;
  const total = payments.filter((p) => p.status === 'CAPTURED').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-xl text-white shadow-sm shrink-0">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Payments & Transactions</h1>
            <p className="text-xs text-slate-400 font-semibold">{paginatedData?.total ?? 0} transactions processed</p>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(Object.keys(STATUS_CONFIG) as PaymentStatus[]).map((status) => {
          const cfg = STATUS_CONFIG[status];
          const Icon = cfg.icon;
          const count = payments.filter((p) => p.status === status).length;
          return (
            <button key={status} onClick={() => setStatusFilter(statusFilter === status ? '' : status)}
              className={`bg-white rounded-xl border p-4 text-left transition-all flex items-center gap-3.5 ${statusFilter === status ? 'border-cyan-400 ring-2 ring-cyan-500/10 scale-[1.01]' : 'border-slate-200/80 hover:border-cyan-300 shadow-sm'}`}>
              <div className={`p-2 rounded-lg ${cfg.color} shrink-0`}><Icon className="h-4.5 w-4.5" /></div>
              <div>
                <p className="text-xl font-bold text-slate-800">{count}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">{cfg.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3 text-left">Transaction ID</th>
                <th className="px-4 py-3 text-left">Ticket ID</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Order Reference</th>
                <th className="px-4 py-3 text-left">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={6} className="py-12 text-center"><Loader2 className="h-6 w-6 animate-spin text-cyan-500 mx-auto" /></td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">No payments found matching your criteria.</td></tr>
              ) : payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-4 py-3">
                    <span className="font-mono text-[10px] text-slate-600 font-semibold">{payment.razorpayPaymentId || <span className="text-slate-300 italic">Pending</span>}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[10px] font-semibold text-slate-500">{payment.ticketId}</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-800">
                    ₹{payment.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${STATUS_CONFIG[payment.status].color}`}>
                      {STATUS_CONFIG[payment.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[10px] text-slate-400">{payment.razorpayOrderId || '—'}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 font-semibold">
                    {new Date(payment.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
