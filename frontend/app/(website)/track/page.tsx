'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, CheckCircle2, Circle, Loader2, AlertCircle, ArrowRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { publicApi } from '@/lib/api/public';
import type { TrackTicketResponse, TicketStatus } from '@/types';

const STAGES: { status: TicketStatus; label: string; desc: string }[] = [
  { status: 'tv_received', label: 'TV Received', desc: 'Your TV has been received at our service center.' },
  { status: 'diagnosis_completed', label: 'Diagnosis Completed', desc: 'Our technician has identified the issue.' },
  { status: 'parts_ordered', label: 'Spare Parts Ordered', desc: 'Required parts have been ordered for your repair.' },
  { status: 'repair_in_progress', label: 'Repair In Progress', desc: 'Your TV is being repaired by our technician.' },
  { status: 'quality_check', label: 'Quality Testing', desc: 'Your TV is undergoing quality and functionality checks.' },
  { status: 'ready_for_delivery', label: 'Ready for Delivery', desc: 'Your TV is repaired and ready to be delivered.' },
  { status: 'delivered', label: 'Delivered', desc: 'Your TV has been successfully delivered. Enjoy!' },
];

function getStageIndex(status: TicketStatus): number {
  return STAGES.findIndex((s) => s.status === status);
}

function StatusTimeline({ data }: { data: TrackTicketResponse }) {
  const currentIdx = getStageIndex(data.status);
  const historyMap = new Map(data.statusHistory.map((h) => [h.status, h]));

  const filteredStages = data.statusHistory.some((h) => h.status === 'parts_ordered')
    ? STAGES
    : STAGES.filter((s) => s.status !== 'parts_ordered');

  return (
    <div className="space-y-0 px-2">
      {filteredStages.map((stage, i) => {
        const stageIdx = STAGES.indexOf(stage);
        const isDone = stageIdx < currentIdx;
        const isCurrent = stageIdx === currentIdx;
        const historyEntry = historyMap.get(stage.status);
        const isLast = i === filteredStages.length - 1;

        return (
          <div key={stage.status} className="flex gap-4 sm:gap-6 relative group">
            {/* Vertical Line */}
            {!isLast && (
              <div className={`absolute left-[17px] top-10 bottom-[-12px] w-[2px] transition-all duration-500 ${isDone ? 'bg-primary-500' : 'bg-slate-100'}`} />
            )}

            {/* Icon Node */}
            <div className="flex flex-col items-center shrink-0 mt-1 relative z-10">
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm ${
                  isDone
                    ? 'bg-primary-600 text-white ring-4 ring-primary-50 shadow-primary-500/30'
                    : isCurrent
                    ? 'bg-white border-[3px] border-primary-600 text-primary-600 ring-4 ring-primary-50 shadow-primary-500/20'
                    : 'bg-white border-2 border-slate-200 text-slate-300'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : isCurrent ? (
                  <div className="h-3 w-3 rounded-full bg-primary-600 animate-pulse" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </div>
            </div>

            {/* Content Card */}
            <div className={`flex-1 pb-8 ${isLast ? 'pb-0' : ''}`}>
              <div
                className={`rounded-lg p-4 transition-all duration-300 ${
                  isCurrent
                    ? 'bg-primary-50 border border-primary-200 shadow-sm'
                    : isDone
                    ? 'bg-white border border-slate-100 group-hover:border-slate-200 group-hover:shadow-sm'
                    : 'bg-transparent border border-transparent opacity-50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`font-bold text-sm ${isCurrent ? 'text-primary-800' : isDone ? 'text-slate-800' : 'text-slate-500'}`}>
                        {stage.label}
                      </p>
                      {isCurrent && <span className="text-[9px] font-bold text-primary-700 bg-primary-200 px-2 py-0.5 rounded uppercase tracking-wider">In Progress</span>}
                    </div>
                    <p className={`text-xs mt-1 ${isCurrent ? 'text-primary-600 font-medium' : isDone ? 'text-slate-600' : 'text-slate-400'}`}>
                      {stage.desc}
                    </p>
                    {historyEntry?.note && (
                      <p className="text-xs text-slate-500 mt-2 bg-white/50 px-3 py-2 rounded-md border border-slate-100">
                        <span className="font-bold text-slate-600 uppercase tracking-wider text-[10px] mr-1">Note:</span> 
                        {historyEntry.note}
                      </p>
                    )}
                  </div>
                  {historyEntry?.createdAt && (
                    <p className="text-[10px] font-bold text-slate-400 shrink-0 uppercase tracking-wider pt-1 sm:pt-0">
                      {new Date(historyEntry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute:'2-digit' })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TrackContent() {
  const searchParams = useSearchParams();
  const [ticketInput, setTicketInput] = useState('');
  const [trackData, setTrackData] = useState<TrackTicketResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<'not_found' | 'invalid' | 'api_error' | null>(null);

  const TICKET_REGEX = /^TKT-\d{4}$/i;

  const handleSearch = async (id?: string) => {
    const query = (id || ticketInput).trim().toUpperCase();

    if (!TICKET_REGEX.test(query)) {
      setError('invalid');
      return;
    }

    setLoading(true);
    setError(null);
    setTrackData(null);

    try {
      const response = await publicApi.trackTicket(query);
      setTrackData(response.data);
    } catch (err: unknown) {
      const status = (err as { response?: { status: number } })?.response?.status;
      setError(status === 404 ? 'not_found' : 'api_error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setTicketInput(id);
      handleSearch(id); // eslint-disable-line react-hooks/exhaustive-deps
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans">
      
      {/* Sleek Hero matching Book page */}
      <section className="relative bg-slate-950 pt-24 pb-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-600 via-slate-950 to-slate-950" />
        
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white font-bold text-[10px] tracking-widest uppercase mb-4 border border-white/20 backdrop-blur-md">
            Live Tracking
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-3">
            Track Your Repair
          </h1>
          <p className="text-xs md:text-sm text-slate-400 font-medium max-w-md mx-auto">
            Enter your Ticket ID below to see the live status of your repair.
          </p>
        </div>
      </section>

      <section className="pb-20 relative z-10 -mt-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          
          {/* Floating Search Bar */}
          <div className="bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-200 p-6 sm:p-8">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Ticket ID</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="TKT-1234"
                maxLength={8}
                className="flex-1 border border-slate-300 rounded-md px-4 py-3 font-mono font-bold text-sm tracking-widest focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 uppercase placeholder:text-slate-300 transition-all text-slate-800"
              />
              <button
                onClick={() => handleSearch()}
                disabled={loading}
                className="px-8 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-70 text-white font-bold text-sm rounded-md transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                {loading ? 'Searching...' : 'Track'}
              </button>
            </div>
            {error === 'invalid' && (
              <p className="text-[10px] font-bold text-red-500 mt-2 flex items-center gap-1 uppercase tracking-wide">
                <AlertCircle className="h-3 w-3" />
                Valid format required: TKT-1234
              </p>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-primary-600 mx-auto mb-3" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Fetching Status...</p>
            </div>
          )}

          {/* Not Found Error */}
          {error === 'not_found' && (
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
              <AlertCircle className="h-8 w-8 text-slate-300 mx-auto mb-3" />
              <h2 className="text-base font-bold text-slate-800 mb-1">Ticket Not Found</h2>
              <p className="text-slate-500 text-xs mb-5">No repair found for <span className="font-mono font-bold text-slate-700">{ticketInput}</span>. Please check the ID.</p>
              <Link href="/book" className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700 uppercase tracking-wider">
                Book a new service <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}

          {/* API Error */}
          {error === 'api_error' && (
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
              <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-3" />
              <h2 className="text-base font-bold text-slate-800 mb-1">Connection Error</h2>
              <p className="text-slate-500 text-xs mb-5">Unable to connect to the server right now.</p>
              <button onClick={() => handleSearch()} className="text-xs font-bold text-primary-600 hover:text-primary-700 uppercase tracking-wider">
                Try Again
              </button>
            </div>
          )}

          {/* Results Area */}
          {trackData && (
            <div className="mt-6 bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-200 p-6 sm:p-8">
              
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ticket ID</p>
                  <p className="font-mono font-bold text-base text-slate-800 tracking-wider">{trackData.ticketId}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Service Type</p>
                  <span className="inline-block bg-slate-100 text-slate-700 font-bold text-[11px] px-2.5 py-1 rounded border border-slate-200">
                    {trackData.serviceType}
                  </span>
                </div>
              </div>
              
              <StatusTimeline data={trackData} />
              
              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-xs font-semibold text-slate-500 mb-3">Need help with your repair?</p>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'}?text=Hi, my ticket ID is ${trackData.ticketId}. I need help.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#25D366] text-white text-xs font-bold rounded-md hover:bg-[#20bd5a] transition-colors shadow-sm"
                >
                  <MessageCircle className="h-4 w-4" /> Message on WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
      </div>
    }>
      <TrackContent />
    </Suspense>
  );
}
