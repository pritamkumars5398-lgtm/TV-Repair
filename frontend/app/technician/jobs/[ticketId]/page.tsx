'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Phone, MapPin, Loader2, AlertCircle, Save, Camera, FileText } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { technicianApi } from '@/lib/api/technician';
import type { TicketStatus } from '@/types';

const STATUS_SEQUENCE: TicketStatus[] = [
  'tv_received', 'diagnosis_completed', 'parts_ordered',
  'repair_in_progress', 'quality_check', 'ready_for_delivery', 'delivered',
];

const STATUS_LABELS: Record<TicketStatus, string> = {
  tv_received:         'TV Received',
  diagnosis_completed: 'Diagnosis Completed',
  parts_ordered:       'Parts Ordered',
  repair_in_progress:  'Repair In Progress',
  quality_check:       'Quality Testing',
  ready_for_delivery:  'Ready for Delivery',
  delivered:           'Delivered',
};

interface PageProps {
  params: { ticketId: string };
}

export default function TechnicianJobDetailPage({ params }: PageProps) {
  const { ticketId } = params;
  const qc = useQueryClient();
  const [note, setNote] = useState('');
  const [estimateAmount, setEstimateAmount] = useState('');
  const [estimateBreakdown, setEstimateBreakdown] = useState('');
  const [showEstimate, setShowEstimate] = useState(false);
  const [pickupOtp, setPickupOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);

  const { data: job, isLoading, isError } = useQuery({
    queryKey: ['tech-job', ticketId],
    queryFn: () => technicianApi.getJobDetail(ticketId).then((r) => r.data),
  });

  const statusMutation = useMutation({
    mutationFn: (data: { status: string; note?: string }) =>
      technicianApi.updateJobStatus(ticketId, data),
    onSuccess: () => {
      toast.success('Status updated');
      qc.invalidateQueries({ queryKey: ['tech-job', ticketId] });
      qc.invalidateQueries({ queryKey: ['tech-jobs'] });
      setNote('');
    },
    onError: () => toast.error('Failed to update status'),
  });

  const noteMutation = useMutation({
    mutationFn: () => technicianApi.addRepairNote(ticketId, note),
    onSuccess: () => { toast.success('Note saved'); setNote(''); qc.invalidateQueries({ queryKey: ['tech-job', ticketId] }); },
    onError: () => toast.error('Failed to save note'),
  });

  const estimateMutation = useMutation({
    mutationFn: () => technicianApi.createEstimate(ticketId, { amount: 0, breakdown: estimateBreakdown }),
    onSuccess: () => { toast.success('Assessment submitted to Admin'); setShowEstimate(false); qc.invalidateQueries({ queryKey: ['tech-job', ticketId] }); },
    onError: () => toast.error('Failed to submit assessment'),
  });

  const onTheWayMutation = useMutation({
    mutationFn: () => technicianApi.markOnTheWay(ticketId),
    onSuccess: (data) => {
      toast.success('Marked on the way! OTP sent to customer.');
      setShowOtpInput(true);
      if (data?.data?.otp) {
        toast.info(`Demo OTP: ${data.data.otp}`);
      }
      qc.invalidateQueries({ queryKey: ['tech-job', ticketId] });
    },
    onError: () => toast.error('Failed to mark on the way'),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (otp: string) => technicianApi.verifyPickupOtp(ticketId, otp),
    onSuccess: () => {
      toast.success('Pickup verified successfully!');
      setShowOtpInput(false);
      qc.invalidateQueries({ queryKey: ['tech-job', ticketId] });
    },
    onError: () => toast.error('Invalid OTP or verification failed'),
  });

  const notifyPickupMutation = useMutation({
    mutationFn: () => technicianApi.notifyPickup(ticketId),
    onSuccess: () => {
      toast.success('Admin notified about product pickup!');
      qc.invalidateQueries({ queryKey: ['tech-job', ticketId] });
    },
    onError: () => toast.error('Failed to notify admin'),
  });

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>;
  if (isError || !job) return (
    <div className="max-w-lg mx-auto py-16 text-center">
      <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
      <p className="font-semibold text-neutral-800">Job not found</p>
      <Link href="/technician/jobs" className="mt-4 inline-block text-sm text-primary-600 hover:underline">← Back to jobs</Link>
    </div>
  );

  const currentIdx = STATUS_SEQUENCE.indexOf(job.status as TicketStatus);
  const nextStatus = STATUS_SEQUENCE[currentIdx + 1];

  return (
    <div className="max-w-2xl space-y-5">
      <Link href="/technician/jobs" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700">
        <ArrowLeft className="h-4 w-4" /> Back to jobs
      </Link>

      {/* Job header */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-card p-5">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
          <div>
            <p className="font-mono text-lg font-bold text-primary-700">{job.ticketId}</p>
            <p className="text-sm text-neutral-500">{job.serviceType?.replace(/_/g,' ')}</p>
          </div>
          <span className="text-sm font-medium px-3 py-1 rounded-full bg-primary-100 text-primary-700">
            {STATUS_LABELS[job.status as TicketStatus] ?? job.status}
          </span>
        </div>

        <div className="space-y-2.5 text-sm">
          <div className="flex items-center gap-2.5 text-neutral-700">
            <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-neutral-600 text-xs">
              {job.customerName[0].toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{job.customerName}</p>
              <a href={`tel:${job.customerPhone}`} className="text-xs text-primary-600 flex items-center gap-1">
                <Phone className="h-3 w-3" />{job.customerPhone}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-2 text-neutral-600">
            <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-neutral-400" />
            <p>{job.address}</p>
          </div>
        </div>

        {job.issueDescription && (
          <div className="mt-4 pt-4 border-t border-neutral-100">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">Issue</p>
            <p className="text-sm text-neutral-700">{job.issueDescription}</p>
          </div>
        )}
      </div>

      {/* Update status */}
      {nextStatus && (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-card p-5">
          <h2 className="font-semibold text-neutral-800 mb-4">Update Status</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Technician Note (optional)</label>
              <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note about this status change..."
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
            </div>
            <button
              onClick={() => statusMutation.mutate({ status: nextStatus, note: note || undefined })}
              disabled={statusMutation.isPending}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60">
              {statusMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Mark as: {STATUS_LABELS[nextStatus]}
            </button>
          </div>
        </div>
      )}

      {/* Notify Pickup */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-card p-5">
        <h2 className="font-semibold text-neutral-800 mb-2">Product Collection</h2>
        <p className="text-sm text-neutral-500 mb-4">Notify the admin once you have successfully collected the product from the customer.</p>
        <button
          onClick={() => notifyPickupMutation.mutate()}
          disabled={notifyPickupMutation.isPending}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60">
          {notifyPickupMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Notify Admin: Product Collected
        </button>
      </div>

      {/* Pickup OTP Section */}
      {(job as any).isPickup && job.status === 'tv_received' && !showOtpInput && !(job as any).pickupOtp && (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-card p-5">
          <h2 className="font-semibold text-neutral-800 mb-2">Initiate Pickup</h2>
          <p className="text-sm text-neutral-500 mb-4">Mark yourself as on the way to generate and send the Pickup OTP to the customer.</p>
          <button
            onClick={() => onTheWayMutation.mutate()}
            disabled={onTheWayMutation.isPending}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60">
            {onTheWayMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Mark On The Way
          </button>
        </div>
      )}

      {((showOtpInput || (job as any).pickupOtp) && job.status === 'tv_received') && (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-card p-5 border-l-4 border-l-primary-500">
          <h2 className="font-semibold text-neutral-800 mb-2">Verify Pickup</h2>
          <p className="text-sm text-neutral-500 mb-4">Ask the customer for the 4-digit Pickup OTP sent to their mobile.</p>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={4}
              value={pickupOtp}
              onChange={(e) => setPickupOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 4-digit OTP"
              className="px-4 py-2 text-center tracking-widest text-lg border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-40"
            />
            <button
              onClick={() => verifyOtpMutation.mutate(pickupOtp)}
              disabled={pickupOtp.length !== 4 || verifyOtpMutation.isPending}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60">
              {verifyOtpMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Verify
            </button>
          </div>
        </div>
      )}

      {/* Add note */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-card p-5">
        <h2 className="font-semibold text-neutral-800 mb-3">Add Repair Note</h2>
        <div className="flex gap-2">
          <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)}
            placeholder="Describe what you found or did..."
            className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
          <button onClick={() => noteMutation.mutate()} disabled={!note || noteMutation.isPending}
            className="self-end p-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-60 transition-colors">
            {noteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Create estimate / assessment */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-neutral-800">Assessment for Admin</h2>
          <button onClick={() => setShowEstimate((v) => !v)}
            className="flex items-center gap-1.5 text-sm text-primary-600 hover:underline">
            <FileText className="h-4 w-4" /> {showEstimate ? 'Cancel' : 'Create Assessment'}
          </button>
        </div>
        {(job as any).techAssessmentBreakdown ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-700 font-medium">Assessment submitted successfully!</p>
          </div>
        ) : showEstimate ? (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Problem Description & Parts Required</label>
              <textarea rows={3} value={estimateBreakdown} onChange={(e) => setEstimateBreakdown(e.target.value)}
                placeholder="e.g. Screen is broken. Needs new screen panel..."
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
            </div>
            <button onClick={() => estimateMutation.mutate()} disabled={!estimateBreakdown || estimateMutation.isPending}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors disabled:opacity-60">
              {estimateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Send Assessment to Admin
            </button>
          </div>
        ) : (
          <p className="text-sm text-neutral-400">No assessment created yet.</p>
        )}
      </div>

      {/* Photo upload placeholder */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-card p-5">
        <h2 className="font-semibold text-neutral-800 mb-3">Photos</h2>
        
        {job.photos && job.photos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {job.photos.map((photoUrl: string, idx: number) => (
              <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200">
                <img src={photoUrl} alt={`Job Photo ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-neutral-200 rounded-xl p-8 cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-colors">
          <Camera className="h-8 w-8 text-neutral-300" />
          <p className="text-sm text-neutral-500">Upload before/after photos</p>
          <p className="text-xs text-neutral-400">JPG, PNG up to 5MB each</p>
          <input type="file" accept="image/*" multiple className="hidden"
            onChange={async (e) => {
              const files = e.target.files;
              if (!files?.length) return;
              const fd = new FormData();
              Array.from(files).forEach((f) => fd.append('photos', f));
              try {
                await technicianApi.uploadPhoto(ticketId, fd);
                toast.success('Photos uploaded');
                qc.invalidateQueries({ queryKey: ['tech-job', ticketId] });
              } catch { toast.error('Upload failed'); }
            }} />
        </label>
      </div>
    </div>
  );
}
