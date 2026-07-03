'use client';

import { useState } from 'react';
import { CreditCard, CheckCircle2, XCircle, Clock, Loader2, RefreshCw } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { customerApi } from '@/lib/api/customer';
import type { Payment, PaymentStatus } from '@/types';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

const STATUS_CONFIG: Record<PaymentStatus, { label: string; icon: typeof CheckCircle2; color: string }> = {
  PENDING:  { label: 'Pending',  icon: Clock,         color: 'bg-yellow-100 text-yellow-700' },
  CAPTURED: { label: 'Paid',     icon: CheckCircle2,  color: 'bg-green-100 text-green-700' },
  FAILED:   { label: 'Failed',   icon: XCircle,       color: 'bg-red-100 text-red-700' },
  REFUNDED: { label: 'Refunded', icon: RefreshCw,     color: 'bg-gray-100 text-gray-600' },
};

export default function CustomerPaymentsPage() {
  const qc = useQueryClient();
  const [payingId, setPayingId] = useState<string | null>(null);

  const { data: payments, isLoading } = useQuery({
    queryKey: ['customer-payments'],
    queryFn: () => customerApi.getPayments().then((r) => r.data),
  });

  async function handlePayNow(payment: Payment) {
    setPayingId(payment.id);
    try {
      const order = await customerApi.createPaymentOrder(payment.ticketId);
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.data.amount,
        currency: 'INR',
        name: 'RepairCart',
        description: `Payment for ${payment.ticketId}`,
        order_id: order.data.razorpayOrderId,
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            await customerApi.verifyPayment(response);
            toast.success('Payment successful!');
            qc.invalidateQueries({ queryKey: ['customer-payments'] });
          } catch {
            toast.error('Payment verification failed. Contact us with your payment ID: ' + response.razorpay_payment_id);
          }
        },
        modal: {
          ondismiss: () => toast.warning('Payment cancelled'),
        },
        theme: { color: '#2563eb' },
      };
      new window.Razorpay(options).open();
    } catch {
      toast.error('Unable to initiate payment. Please try again.');
    } finally {
      setPayingId(null);
    }
  }

  const pending = (payments ?? []).filter((p: Payment) => p.status === 'PENDING');
  const history = (payments ?? []).filter((p: Payment) => p.status !== 'PENDING');

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Payments</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Manage pending payments and view transaction history.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      ) : (
        <>
          {/* Pending payments */}
          {pending.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Pending Payments</h2>
              {pending.map((p: Payment) => (
                <div key={p.id} className="bg-white rounded-xl border border-yellow-200 shadow-card p-5 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-mono text-sm font-bold text-primary-700">{p.ticketId}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <p className="text-2xl font-bold text-neutral-900">₹{p.amount.toLocaleString('en-IN')}</p>
                  <button
                    onClick={() => handlePayNow(p)}
                    disabled={payingId === p.id}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60"
                  >
                    {payingId === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                    Pay Now
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Transaction history */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-3">Transaction History</h2>
            <div className="bg-white rounded-xl border border-neutral-200 shadow-card divide-y divide-neutral-100">
              {history.length === 0 ? (
                <div className="p-10 text-center">
                  <CreditCard className="h-10 w-10 text-neutral-200 mx-auto mb-3" />
                  <p className="text-sm text-neutral-500">No payment history yet.</p>
                </div>
              ) : (
                history.map((p: Payment) => {
                  const cfg = STATUS_CONFIG[p.status];
                  const Icon = cfg.icon;
                  return (
                    <div key={p.id} className="flex items-center justify-between px-5 py-4 gap-4 flex-wrap">
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${cfg.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-mono text-sm font-medium text-neutral-800">{p.ticketId}</p>
                          <p className="text-xs text-neutral-400">{new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-neutral-900">₹{p.amount.toLocaleString('en-IN')}</p>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
