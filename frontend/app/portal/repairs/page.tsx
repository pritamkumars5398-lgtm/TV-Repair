'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Wrench, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { customerApi } from '@/lib/api/customer';
import type { Ticket, TicketStatus } from '@/types';

const STATUS_LABELS: Record<TicketStatus, string> = {
  tv_received: 'TV Received',
  diagnosis_completed: 'Diagnosis Done',
  parts_ordered: 'Parts Ordered',
  repair_in_progress: 'In Progress',
  quality_check: 'Quality Check',
  ready_for_delivery: 'Ready for Delivery',
  delivered: 'Delivered',
};

const STATUS_COLORS: Record<TicketStatus, string> = {
  tv_received: 'bg-blue-100 text-blue-700',
  diagnosis_completed: 'bg-cyan-100 text-cyan-700',
  parts_ordered: 'bg-orange-100 text-orange-700',
  repair_in_progress: 'bg-yellow-100 text-yellow-800',
  quality_check: 'bg-indigo-100 text-indigo-700',
  ready_for_delivery: 'bg-teal-100 text-teal-700',
  delivered: 'bg-green-100 text-green-700',
};

const SERVICE_LABELS: Record<string, string> = {
  TV_REPAIR: 'LED / Smart TV Repair',
  SPEAKER_REPAIR: 'Speaker Repair',
  HOME_VISIT: 'Home Visit',
  SPEAKER_INSTALL: 'Speaker Installation',
  HOME_THEATER: 'Home Theater Setup',
};

const FILTERS = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'delivered' },
];

export default function CustomerRepairsPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['customer-repairs', statusFilter],
    queryFn: () => customerApi.getRepairs({ status: statusFilter || undefined }).then((r) => r.data),
  });

  const filtered = (data?.items ?? []).filter((t: Ticket) =>
    t.ticketId.toLowerCase().includes(search.toLowerCase()) ||
    (t.device ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">My Repairs</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Track all your repair history in one place.</p>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by ticket ID or device..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === f.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-card">
        {isLoading ? (
          <div className="p-10 text-center text-sm text-neutral-400">Loading your repairs...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <Wrench className="h-10 w-10 text-neutral-200 mx-auto mb-3" />
            <p className="text-sm text-neutral-500">No repairs found.</p>
            <Link href="/book" className="mt-3 inline-block text-sm text-primary-600 font-medium hover:underline">Book a service →</Link>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-[1fr_1.5fr_1fr_1fr_40px] gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 bg-neutral-50 rounded-t-xl">
              <span>Ticket ID</span>
              <span>Service</span>
              <span>Date</span>
              <span>Status</span>
              <span />
            </div>
            {filtered.map((ticket: Ticket) => (
              <Link
                key={ticket.id}
                href={`/portal/repairs/${ticket.ticketId}`}
                className="grid grid-cols-1 sm:grid-cols-[1fr_1.5fr_1fr_1fr_40px] gap-2 sm:gap-4 px-5 py-4 hover:bg-neutral-50 transition-colors group items-center"
              >
                <p className="font-mono text-sm font-bold text-primary-700">{ticket.ticketId}</p>
                <p className="text-sm text-neutral-700">{SERVICE_LABELS[ticket.serviceType] ?? ticket.serviceType}</p>
                <p className="text-sm text-neutral-500">{new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                <span className={`inline-flex text-xs font-medium px-2.5 py-0.5 rounded-full w-fit ${STATUS_COLORS[ticket.status]}`}>
                  {STATUS_LABELS[ticket.status]}
                </span>
                <ArrowRight className="hidden sm:block h-4 w-4 text-neutral-300 group-hover:text-neutral-500 transition-colors justify-self-end" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
