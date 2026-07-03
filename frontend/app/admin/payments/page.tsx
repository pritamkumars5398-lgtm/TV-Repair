'use client';

import { useState } from 'react';
import { CreditCard, CheckCircle2, XCircle, Clock, RefreshCw, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import type { Payment, PaymentStatus } from '@/types';

const STATUS_CONFIG: Record<PaymentStatus, { label: string; icon: typeof CheckCircle2; color: string }> = {
  PENDING:  { label: 'Pending',  icon: Clock,        color: 'bg-yellow-100 text-yellow-700' },
  CAPTURED: { label: 'Paid',     icon: CheckCircle2, color: 'bg-green-100 text-green-700' },
  FAILED:   { label: 'Failed',   icon: XCircle,      color: 'bg-red-100 text-red-700' },
  REFUNDED: { label: 'Refunded', icon: RefreshCw,    color: 'bg-gray-100 text-gray-600' },
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-2xl shadow-lg shadow-cyan-500/20 text-white">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Payments & Transactions</h1>
            <p className="text-sm text-slate-500 font-medium">{paginatedData?.total ?? 0} transactions processed</p>
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
              className={`bg-white rounded-3xl border shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 text-left transition-all group ${statusFilter === status ? 'border-cyan-400 ring-4 ring-cyan-50 scale-[1.02]' : 'border-slate-100 hover:border-cyan-200 hover:shadow-[0_8px_30px_rgb(6,182,212,0.1)]'}`}>
              <div className={`inline-flex p-2 rounded-xl ${cfg.color} mb-4 shadow-sm group-hover:scale-110 transition-transform`}><Icon className="h-5 w-5" /></div>
              <p className="text-3xl font-black text-slate-800 mb-1">{count}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{cfg.label}</p>
            </button>
          );
        })}
      </div>

      {statusFilter === 'CAPTURED' && (
        <div className="flex justify-between items-center bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl px-6 py-4 text-white shadow-lg shadow-emerald-500/20 animate-in zoom-in-95 duration-300">
          <p className="font-bold">Total collected in view</p>
          <p className="text-2xl font-black">₹{total.toLocaleString('en-IN')}</p>
        </div>
      )}

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4 text-left rounded-tl-3xl">Ticket ID</th>
                <th className="px-6 py-4 text-left">Amount</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Transaction ID</th>
                <th className="px-6 py-4 text-left rounded-tr-3xl">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={5} className="py-20 text-center"><Loader2 className="h-8 w-8 animate-spin text-cyan-500 mx-auto" /></td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan={5} className="py-20 text-center">
                  <CreditCard className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400 font-medium">No payments found for this criteria.</p>
                </td></tr>
              ) : payments.map((p) => {
                const cfg = STATUS_CONFIG[p.status];
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-cyan-700 bg-cyan-50 px-3 py-1.5 rounded-lg border border-cyan-100">{p.ticketId}</span>
                    </td>
                    <td className="px-6 py-4 font-black text-slate-800 text-lg">₹{p.amount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] uppercase tracking-wider font-black px-3 py-1 rounded-full ${cfg.color}`}>{cfg.label}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        {p.razorpayPaymentId ?? 'Not generated'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs font-medium">{new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  </tr>
                );
              })}
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
