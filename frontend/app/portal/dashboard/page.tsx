'use client';

import Link from 'next/link';
import { Wrench, CreditCard, CheckCircle2, IndianRupee, ArrowRight, Clock, Plus } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { customerApi } from '@/lib/api/customer';
import { useQuery } from '@tanstack/react-query';
import type { Ticket } from '@/types';

const STATUS_LABELS: Record<string, string> = {
  tv_received: 'TV Received',
  diagnosis_completed: 'Diagnosis Done',
  parts_ordered: 'Parts Ordered',
  repair_in_progress: 'In Progress',
  quality_check: 'Quality Check',
  ready_for_delivery: 'Ready',
  delivered: 'Delivered',
};

const STATUS_COLORS: Record<string, string> = {
  tv_received: 'bg-blue-100 text-blue-700',
  diagnosis_completed: 'bg-cyan-100 text-cyan-700',
  parts_ordered: 'bg-orange-100 text-orange-700',
  repair_in_progress: 'bg-yellow-100 text-yellow-800',
  quality_check: 'bg-indigo-100 text-indigo-700',
  ready_for_delivery: 'bg-teal-100 text-teal-700',
  delivered: 'bg-green-100 text-green-700',
};

export default function CustomerDashboardPage() {
  const user = useAuthStore((s) => s.user);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['customer-dashboard'],
    queryFn: () => customerApi.getDashboard().then((r) => r.data),
  });

  const { data: repairsData, isLoading: repairsLoading } = useQuery({
    queryKey: ['customer-repairs-recent'],
    queryFn: () => customerApi.getRepairs({ limit: 5 }).then((r) => r.data),
  });

  const statCards = [
    { label: 'Active Repairs', value: stats?.activeTickets ?? 0,   icon: Wrench,         color: 'bg-blue-50 text-blue-600' },
    { label: 'Completed',      value: stats?.completedRepairs ?? 0, icon: CheckCircle2,   color: 'bg-green-50 text-green-600' },
    { label: 'Pending Payment',value: stats?.pendingPayments ?? 0,  icon: CreditCard,     color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Total Spent',    value: `₹${(stats?.totalSpent ?? 0).toLocaleString('en-IN')}`, icon: IndianRupee, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Greeting */}
      <div>
        <h1 className="text-xl font-bold text-neutral-900">
          Welcome back, {user?.name?.split(' ')[0] ?? 'there'} 👋
        </h1>
        <p className="text-sm text-neutral-500 mt-0.5">Here&apos;s an overview of your repair history.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-neutral-200 shadow-card p-4">
            <div className={`inline-flex p-2 rounded-lg ${color} mb-3`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-neutral-900">{statsLoading ? '—' : value}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Link
          href="/book"
          className="flex items-center gap-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl p-4 transition-colors group"
        >
          <Plus className="h-5 w-5 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-sm">Book a New Service</p>
            <p className="text-xs text-primary-200">Schedule TV repair or speaker service</p>
          </div>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="/track"
          className="flex items-center gap-3 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-800 rounded-xl p-4 transition-colors group"
        >
          <Clock className="h-5 w-5 shrink-0 text-primary-600" />
          <div className="flex-1">
            <p className="font-semibold text-sm">Track a Repair</p>
            <p className="text-xs text-neutral-500">Enter ticket ID to see live status</p>
          </div>
          <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Recent repairs */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <h2 className="font-semibold text-neutral-800">Recent Repairs</h2>
          <Link href="/portal/repairs" className="text-xs text-primary-600 hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {repairsLoading ? (
          <div className="p-8 text-center text-sm text-neutral-400">Loading...</div>
        ) : !repairsData?.items?.length ? (
          <div className="p-8 text-center">
            <Wrench className="h-10 w-10 text-neutral-200 mx-auto mb-3" />
            <p className="text-sm text-neutral-500">No repairs yet.</p>
            <Link href="/book" className="mt-3 inline-block text-sm text-primary-600 font-medium hover:underline">
              Book your first service →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-neutral-50">
            {repairsData.items.map((ticket: Ticket) => (
              <Link
                key={ticket.id}
                href={`/portal/repairs/${ticket.ticketId}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-neutral-50 transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-800 font-mono">{ticket.ticketId}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{ticket.device} · {new Date(ticket.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[ticket.status] ?? 'bg-neutral-100 text-neutral-600'}`}>
                    {STATUS_LABELS[ticket.status] ?? ticket.status}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
