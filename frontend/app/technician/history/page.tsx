'use client';

import Link from 'next/link';
import { ArrowRight, History, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { technicianApi } from '@/lib/api/technician';
import type { Job, TicketStatus } from '@/types';

const STATUS_LABELS: Record<TicketStatus, string> = {
  tv_received:         'TV Received',
  diagnosis_completed: 'Diagnosed',
  parts_ordered:       'Parts Ordered',
  repair_in_progress:  'In Progress',
  quality_check:       'Quality Check',
  ready_for_delivery:  'Ready',
  delivered:           'Delivered',
};

const SERVICE_LABELS: Record<string, string> = {
  TV_REPAIR:       'TV Repair',
  SPEAKER_REPAIR:  'Speaker Repair',
  HOME_VISIT:      'Home Visit',
  SPEAKER_INSTALL: 'Speaker Install',
  HOME_THEATER:    'Home Theater',
};

export default function TechnicianHistoryPage() {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['tech-jobs-history'],
    queryFn: () => technicianApi.getJobs({ status: 'delivered' }).then((r) => r.data),
  });

  const completed = (jobs as Job[] | undefined) ?? [];

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Job History</h1>
        <p className="text-sm text-neutral-500">{completed.length} completed jobs</p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-card">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        ) : completed.length === 0 ? (
          <div className="p-12 text-center">
            <History className="h-10 w-10 text-neutral-200 mx-auto mb-3" />
            <p className="text-sm text-neutral-400">No completed jobs yet.</p>
          </div>
        ) : (
          <>
            <div className="hidden sm:grid grid-cols-[1fr_1.2fr_1fr_1fr_40px] gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 bg-neutral-50 rounded-t-xl border-b border-neutral-100">
              <span>Ticket ID</span>
              <span>Customer</span>
              <span>Service</span>
              <span>Completed</span>
              <span />
            </div>
            <div className="divide-y divide-neutral-100">
              {completed.map((job: Job) => (
                <Link
                  key={job.id}
                  href={`/technician/jobs/${job.ticketId}`}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_1.2fr_1fr_1fr_40px] gap-2 sm:gap-4 px-5 py-4 hover:bg-neutral-50 transition-colors group items-center"
                >
                  <span className="font-mono text-sm font-bold text-primary-700">{job.ticketId}</span>
                  <span className="text-sm text-neutral-700">{job.customerName}</span>
                  <span className="text-sm text-neutral-500">{SERVICE_LABELS[job.serviceType] ?? job.serviceType}</span>
                  <span className="text-sm text-neutral-400">
                    {job.scheduledAt ? new Date(job.scheduledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </span>
                  <ArrowRight className="hidden sm:block h-4 w-4 text-neutral-300 group-hover:text-neutral-500 justify-self-end" />
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Summary card */}
      {completed.length > 0 && (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-card p-5">
          <h2 className="font-semibold text-neutral-800 mb-3">Summary</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-2xl font-bold text-neutral-900">{completed.length}</p>
              <p className="text-xs text-neutral-500">Total Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">
                {completed.filter((j) => j.serviceType === 'TV_REPAIR').length}
              </p>
              <p className="text-xs text-neutral-500">TV Repairs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">
                {STATUS_LABELS.delivered}
              </p>
              <p className="text-xs text-neutral-500">All Delivered</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
