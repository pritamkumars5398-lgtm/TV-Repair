'use client';

import { FileText, Download, Loader2 } from 'lucide-react';

export default function AdminInvoicesPage() {
  const isLoading = false;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-2xl shadow-lg shadow-cyan-500/20 text-white">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Invoices</h1>
            <p className="text-sm text-slate-500 font-medium">Manage service invoices and estimates</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white rounded-2xl p-1.5 w-fit border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        {['Invoices', 'Estimates', 'Receipts'].map((t, i) => (
          <button key={t}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${i === 0 ? 'bg-gradient-to-r from-primary-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20' : 'bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4 text-left rounded-tl-3xl">Invoice #</th>
                <th className="px-6 py-4 text-left">Ticket</th>
                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-left">Amount</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left rounded-tr-3xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={7} className="py-20 text-center"><Loader2 className="h-8 w-8 animate-spin text-cyan-500 mx-auto" /></td></tr>
              ) : (
                <tr><td colSpan={7} className="py-24 text-center">
                  <FileText className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold text-lg">No invoices generated yet</p>
                  <p className="text-slate-400 font-medium text-sm mt-1">Invoices are automatically created after repair completion.</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
