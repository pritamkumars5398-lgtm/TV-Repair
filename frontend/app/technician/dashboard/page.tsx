'use client';

import Link from 'next/link';
import { Briefcase, CheckCircle2, Clock, Star, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/stores/auth-store';
import { technicianApi } from '@/lib/api/technician';
import type { Job } from '@/types';

const STATUS_COLORS: Record<string, string> = {
  tv_received:         'bg-blue-100 text-blue-700',
  diagnosis_completed: 'bg-cyan-100 text-cyan-700',
  repair_in_progress:  'bg-yellow-100 text-yellow-800',
  quality_check:       'bg-indigo-100 text-indigo-700',
  ready_for_delivery:  'bg-teal-100 text-teal-700',
};

const STATUS_LABELS: Record<string, string> = {
  tv_received:         'TV Received',
  diagnosis_completed: 'Diagnosed',
  repair_in_progress:  'In Progress',
  quality_check:       'Quality Check',
  ready_for_delivery:  'Ready',
};

export default function TechnicianDashboardPage() {
  const user = useAuthStore((s) => s.user);

  const { data: stats } = useQuery({
    queryKey: ['tech-dashboard'],
    queryFn: () => technicianApi.getDashboard().then((r) => r.data),
  });

  const { data: jobs } = useQuery({
    queryKey: ['tech-jobs-today'],
    queryFn: () => technicianApi.getJobs({ status: 'active' }).then((r) => r.data),
  });

  const statCards = [
    { label: "Today's Jobs",    value: stats?.todayJobs ?? 0,       icon: Briefcase,    color: 'bg-blue-50 text-blue-600' },
    { label: 'Pending',         value: stats?.pendingJobs ?? 0,      icon: Clock,        color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Completed Today', value: stats?.completedToday ?? 0,   icon: CheckCircle2, color: 'bg-green-50 text-green-600' },
    { label: 'My Rating',       value: stats?.rating ? `${stats.rating.toFixed(1)} ★` : '—', icon: Star, color: 'bg-orange-50 text-orange-500' },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Good morning, {user?.name?.split(' ')[0] ?? 'Technician'} 👋</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Here&apos;s your schedule for today.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-neutral-200 shadow-card p-4">
            <div className={`inline-flex p-2 rounded-lg ${color} mb-3`}><Icon className="h-5 w-5" /></div>
            <p className="text-2xl font-bold text-neutral-900">{value}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Today's job queue */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <h2 className="font-semibold text-neutral-800">Active Jobs</h2>
          <Link href="/technician/jobs" className="text-xs text-primary-600 hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {!jobs?.length ? (
          <div className="p-10 text-center">
            <Briefcase className="h-10 w-10 text-neutral-200 mx-auto mb-3" />
            <p className="text-sm text-neutral-400">No active jobs right now.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-50">
            {(jobs as Job[]).slice(0, 5).map((job) => (
              <Link key={job.id} href={`/technician/jobs/${job.ticketId}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-neutral-50 transition-colors group">
                <div>
                  <p className="font-mono text-sm font-bold text-primary-700">{job.ticketId}</p>
                  <p className="text-sm text-neutral-600">{job.customerName}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{job.address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${STATUS_COLORS[job.status] ?? 'bg-neutral-100 text-neutral-600'}`}>
                    {STATUS_LABELS[job.status] ?? job.status}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-neutral-300 group-hover:text-neutral-500" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
