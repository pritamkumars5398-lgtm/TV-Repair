'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Phone, MapPin, Wrench, CheckCircle2, Circle, Loader2, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { customerApi } from '@/lib/api/customer';
import type { TicketStatus } from '@/types';

const STAGES: { status: TicketStatus; label: string }[] = [
  { status: 'tv_received',       label: 'TV Received' },
  { status: 'diagnosis_completed', label: 'Diagnosis Completed' },
  { status: 'parts_ordered',     label: 'Parts Ordered' },
  { status: 'repair_in_progress', label: 'Repair In Progress' },
  { status: 'quality_check',     label: 'Quality Testing' },
  { status: 'ready_for_delivery', label: 'Ready for Delivery' },
  { status: 'delivered',         label: 'Delivered' },
];

const STATUS_COLORS: Record<TicketStatus, string> = {
  tv_received: 'bg-blue-100 text-blue-700',
  diagnosis_completed: 'bg-cyan-100 text-cyan-700',
  parts_ordered: 'bg-orange-100 text-orange-700',
  repair_in_progress: 'bg-yellow-100 text-yellow-800',
  quality_check: 'bg-indigo-100 text-indigo-700',
  ready_for_delivery: 'bg-teal-100 text-teal-700',
  delivered: 'bg-green-100 text-green-700',
};

interface PageProps {
  params: Promise<{ ticketId: string }>;
}

export default function RepairDetailPage({ params }: PageProps) {
  const { ticketId } = use(params);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['repair-detail', ticketId],
    queryFn: () => customerApi.getRepairDetail(ticketId).then((r) => r.data),
  });

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
    </div>
  );

  if (isError || !data) return (
    <div className="max-w-lg mx-auto py-16 text-center">
      <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
      <p className="font-semibold text-neutral-800">Repair not found</p>
      <Link href="/portal/repairs" className="mt-4 inline-block text-sm text-primary-600 hover:underline">← Back to repairs</Link>
    </div>
  );

  const stageIndex = STAGES.findIndex((s) => s.status === data.status);
  const historyMap = new Map((data.statusHistory ?? []).map((h: { status: string; note?: string; createdAt: string }) => [h.status, h]));

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/portal/repairs" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700">
        <ArrowLeft className="h-4 w-4" /> Back to repairs
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-card p-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <p className="font-mono text-lg font-bold text-primary-700 tracking-widest">{data.ticketId}</p>
            <p className="text-sm text-neutral-500 mt-0.5">Created {new Date(data.createdAt ?? '').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${STATUS_COLORS[data.status]}`}>
            {STAGES.find((s) => s.status === data.status)?.label ?? data.status}
          </span>
        </div>
        <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
          {data.device && (
            <div className="flex items-center gap-2 text-neutral-600">
              <Wrench className="h-4 w-4 text-neutral-400" />
              {data.device}
            </div>
          )}
          {data.technicianName && (
            <div className="flex items-center gap-2 text-neutral-600">
              <Phone className="h-4 w-4 text-neutral-400" />
              Technician: {data.technicianName}
            </div>
          )}
          {data.address && (
            <div className="flex items-start gap-2 text-neutral-600 sm:col-span-2">
              <MapPin className="h-4 w-4 text-neutral-400 mt-0.5 shrink-0" />
              {data.address}
            </div>
          )}
        </div>
        {data.issueDescription && (
          <div className="mt-4 pt-4 border-t border-neutral-100">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">Issue Description</p>
            <p className="text-sm text-neutral-700">{data.issueDescription}</p>
          </div>
        )}
        {data.repairNotes && (
          <div className="mt-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">Technician Notes</p>
            <p className="text-sm text-neutral-700">{data.repairNotes}</p>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-card p-5">
        <h2 className="font-semibold text-neutral-800 mb-5">Repair Timeline</h2>
        <div className="space-y-0">
          {STAGES.filter((s) => s.status !== 'parts_ordered' || historyMap.has('parts_ordered')).map((stage, i, arr) => {
            const idx = STAGES.indexOf(stage);
            const isDone = idx < stageIndex;
            const isCurrent = idx === stageIndex;
            const isLast = i === arr.length - 1;
            const entry = historyMap.get(stage.status) as { status: string; note?: string; createdAt: string } | undefined;

            return (
              <div key={stage.status} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${
                    isDone ? 'bg-green-500' : isCurrent ? 'bg-primary-600 ring-4 ring-primary-100' : 'bg-neutral-200'
                  }`}>
                    {isDone
                      ? <CheckCircle2 className="h-4 w-4 text-white" />
                      : isCurrent
                        ? <div className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
                        : <Circle className="h-4 w-4 text-neutral-400" />
                    }
                  </div>
                  {!isLast && <div className={`w-0.5 flex-1 my-1 ${isDone ? 'bg-green-400' : 'bg-neutral-200 border-l border-dashed'}`} />}
                </div>
                <div className={`pb-6 ${isLast ? '' : ''}`}>
                  <p className={`text-sm font-semibold ${isCurrent ? 'text-primary-700' : isDone ? 'text-neutral-700' : 'text-neutral-400'}`}>
                    {stage.label}
                  </p>
                  {entry && (
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {new Date(entry.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                  {entry?.note && <p className="text-xs text-neutral-500 mt-1 italic">&ldquo;{entry.note}&rdquo;</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Estimate & Invoice */}
      {(data.estimateAmount || data.invoiceAmount) && (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-card p-5">
          <h2 className="font-semibold text-neutral-800 mb-4">Billing</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {data.estimateAmount && (
              <div className="bg-neutral-50 rounded-lg p-4">
                <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Estimate</p>
                <p className="text-2xl font-bold text-neutral-900">₹{data.estimateAmount.toLocaleString('en-IN')}</p>
              </div>
            )}
            {data.invoiceAmount && (
              <div className="bg-neutral-50 rounded-lg p-4">
                <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Invoice Total</p>
                <p className="text-2xl font-bold text-neutral-900">₹{data.invoiceAmount.toLocaleString('en-IN')}</p>
                <Link href="/portal/payments" className="mt-2 inline-block text-xs text-primary-600 hover:underline">Pay now →</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
