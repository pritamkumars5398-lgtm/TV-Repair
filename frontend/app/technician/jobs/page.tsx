'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Briefcase, Loader2 } from 'lucide-react';
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

const STATUS_COLORS: Record<TicketStatus, string> = {
  tv_received:         'bg-blue-100 text-blue-700',
  diagnosis_completed: 'bg-cyan-100 text-cyan-700',
  parts_ordered:       'bg-orange-100 text-orange-700',
  repair_in_progress:  'bg-yellow-100 text-yellow-800',
  quality_check:       'bg-indigo-100 text-indigo-700',
  ready_for_delivery:  'bg-teal-100 text-teal-700',
  delivered:           'bg-green-100 text-green-700',
};

const FILTERS = [
  { label: 'Active', value: 'active' },
  { label: 'All', value: '' },
  { label: 'Completed', value: 'delivered' },
];

import { useAuthStore } from '@/lib/stores/auth-store';

export default function TechnicianJobsPage() {
  const [filter, setFilter] = useState('active');
  const user = useAuthStore((s) => s.user);

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['tech-jobs', filter, user?._id],
    queryFn: () => technicianApi.getJobs({ status: filter || undefined, technicianId: user?.id || user?._id }).then((r) => r.data),
    enabled: !!(user?.id || user?._id),
  });

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">My Jobs</h1>
        <p className="text-sm text-neutral-500">{(jobs as Job[] | undefined)?.length ?? 0} jobs assigned</p>
      </div>

      <div className="flex gap-1.5">
        {FILTERS.map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f.value ? 'bg-primary-600 text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-card">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>
        ) : !(jobs as Job[] | undefined)?.length ? (
          <div className="p-12 text-center">
            <Briefcase className="h-10 w-10 text-neutral-200 mx-auto mb-3" />
            <p className="text-sm text-neutral-400">No jobs in this category.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {(jobs as Job[]).map((job) => (
              <Link key={job.id} href={`/technician/jobs/${job.ticketId}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-neutral-50 transition-colors group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-sm font-bold text-primary-700">{job.ticketId}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[job.status]}`}>
                      {STATUS_LABELS[job.status]}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-neutral-800">{job.customerName}</p>
                  <p className="text-xs text-neutral-400 truncate">{job.address}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {job.scheduledAt ? new Date(job.scheduledAt).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-neutral-300 group-hover:text-neutral-500 shrink-0 ml-3" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
