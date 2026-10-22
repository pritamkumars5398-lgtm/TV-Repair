'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, MessageSquare, Send, Copy, Check, Loader2, Sparkles, PhoneCall } from 'lucide-react';
import { toast } from 'sonner';
import { publicApi } from '@/lib/api/public';

interface Props {
  ticketId: string;
}

export default function BookingSuccessClient({ ticketId }: Props) {
  const [resending, setResending] = useState(false);
  const [copied, setCopied] = useState(false);

  const whatsappMessage = encodeURIComponent(
    `Hi RepairCart, I have booked a TV repair service. My Ticket ID is ${ticketId}. Please confirm my appointment & technician visit.`
  );
  const whatsappUrl = `https://wa.me/918586887887?text=${whatsappMessage}`;

  const handleCopyTicket = () => {
    navigator.clipboard.writeText(ticketId);
    setCopied(true);
    toast.success('Ticket ID copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResendSMS = async () => {
    setResending(true);
    try {
      await publicApi.resendBookingConfirmation(ticketId);
      toast.success(`Confirmation SMS sent successfully for ticket ${ticketId}!`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to resend SMS. Please try WhatsApp support.');
    } finally {
      setResending(false);
    }
  };

  return (
    <section className="min-h-screen bg-slate-50 flex items-center justify-center py-16 px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 max-w-lg w-full p-6 sm:p-8 text-center animate-in fade-in duration-300">
        
        {/* Animated checkmark */}
        <div className="flex items-center justify-center mb-5">
          <div className="h-20 w-20 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center shadow-inner">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mb-6 font-medium">
          Your service request has been received. A certified technician will contact you shortly.
        </p>

        {/* Ticket ID Box */}
        <div className="bg-gradient-to-br from-primary-50/80 to-blue-50/60 border border-primary-200/80 rounded-2xl p-5 mb-6 text-center relative group">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-primary-700 mb-1">
            Your Ticket ID
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="font-mono font-black text-2xl sm:text-3xl tracking-widest text-primary-900">
              {ticketId}
            </span>
            <button
              onClick={handleCopyTicket}
              className="p-1.5 rounded-lg bg-white border border-primary-200 hover:bg-primary-50 text-primary-700 transition-all shadow-sm active:scale-95"
              title="Copy Ticket ID"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold mt-2">
            Save this ID to track your live repair progress
          </p>
        </div>

        {/* Instant WhatsApp & SMS Confirmation Actions */}
        <div className="space-y-3 mb-6">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-sm rounded-xl transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <MessageSquare className="w-5 h-5 fill-white stroke-none" />
            Get Confirmation on WhatsApp
          </a>

          <button
            onClick={handleResendSMS}
            disabled={resending}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.99]"
          >
            {resending ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
            ) : (
              <Send className="w-3.5 h-3.5 text-slate-500" />
            )}
            Resend SMS Confirmation
          </button>
        </div>

        {/* What's Next Steps */}
        <div className="bg-slate-50 rounded-2xl p-5 mb-6 text-left border border-slate-200/70">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary-600" /> What happens next?
          </p>
          <ol className="space-y-2.5">
            {[
              {
                title: 'SMS confirmation dispatched to your registered phone',
                desc: 'Includes ticket ID & tracking link.',
              },
              {
                title: 'Technician appointment call',
                desc: 'Our technician will call to verify address and schedule visit time.',
              },
              {
                title: 'Doorstep inspection & diagnosis',
                desc: 'Certified expert visits your premises with diagnostic tools.',
              },
              {
                title: 'Transparent estimate before repair',
                desc: 'Fair quote shared; work begins only after your approval.',
              },
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-xs text-slate-700">
                <span className="h-5 w-5 rounded-full bg-primary-600 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 shadow-sm">
                  {i + 1}
                </span>
                <div>
                  <p className="font-bold text-slate-800">{step.title}</p>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-2.5">
          <Link
            href={`/track?id=${ticketId}`}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-extrabold text-sm rounded-xl transition-all shadow-sm active:scale-[0.99] uppercase tracking-wider"
          >
            Track Repair Status <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Contact info support footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] font-medium text-slate-500">
          <PhoneCall className="w-3 h-3 text-slate-400" />
          <span>Need immediate assistance? Call <a href="tel:+918586887887" className="font-bold text-primary-600 hover:underline">+91 8586887887</a></span>
        </div>
      </div>
    </section>
  );
}
