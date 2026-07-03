'use client';

import { FileText, Download, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { customerApi } from '@/lib/api/customer';
import type { Invoice } from '@/types';

const STATUS_COLORS = {
  DRAFT: 'bg-neutral-100 text-neutral-600',
  SENT:  'bg-blue-100 text-blue-700',
  PAID:  'bg-green-100 text-green-700',
};

export default function CustomerInvoicesPage() {
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['customer-invoices'],
    queryFn: () => customerApi.getInvoices().then((r) => r.data),
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Invoices</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Download invoices for your repair services.</p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-card">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        ) : !invoices?.length ? (
          <div className="p-10 text-center">
            <FileText className="h-10 w-10 text-neutral-200 mx-auto mb-3" />
            <p className="text-sm text-neutral-500">No invoices yet.</p>
          </div>
        ) : (
          <>
            <div className="hidden sm:grid grid-cols-[1fr_1fr_1fr_80px_80px] gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 bg-neutral-50 rounded-t-xl border-b border-neutral-100">
              <span>Invoice #</span>
              <span>Ticket</span>
              <span>Date</span>
              <span>Total</span>
              <span>Status</span>
            </div>
            <div className="divide-y divide-neutral-100">
              {invoices.map((inv: Invoice) => (
                <div key={inv.id} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_80px_80px] gap-2 sm:gap-4 px-5 py-4 items-center">
                  <p className="font-mono text-sm font-bold text-primary-700">{inv.invoiceNumber}</p>
                  <p className="font-mono text-sm text-neutral-600">{inv.ticketId}</p>
                  <p className="text-sm text-neutral-500">{new Date(inv.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  <p className="font-semibold text-sm text-neutral-900">₹{inv.total.toLocaleString('en-IN')}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[inv.status]}`}>{inv.status}</span>
                    {inv.pdfUrl && (
                      <a
                        href={inv.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded hover:bg-neutral-100 text-neutral-500 hover:text-primary-600 transition-colors"
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
