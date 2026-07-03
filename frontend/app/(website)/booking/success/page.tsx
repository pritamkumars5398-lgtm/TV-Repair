import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, MapPin, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Booking Confirmed',
  description: 'Your TV repair service has been booked successfully.',
};

interface PageProps {
  searchParams: { ticketId?: string };
}

export default function BookingSuccessPage({ searchParams }: PageProps) {
  const ticketId = searchParams.ticketId || 'TVR-2026-0000';

  return (
    <section className="min-h-screen bg-neutral-50 flex items-center justify-center py-16 px-4">
      <div className="bg-white rounded-2xl shadow-card border border-neutral-200 max-w-md w-full p-8 text-center">
        {/* Animated checkmark */}
        <div className="flex items-center justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
        </div>

        <h1 className="text-2xl font-bold font-display text-neutral-900 mb-2">Booking Confirmed!</h1>
        <p className="text-neutral-600 mb-6">Your service request has been received. A certified technician will contact you shortly.</p>

        {/* Ticket ID */}
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-6">
          <p className="text-xs text-neutral-500 mb-1">Your Ticket ID</p>
          <p className="tracking-id text-xl">{ticketId}</p>
          <p className="text-xs text-neutral-500 mt-2">Save this ID to track your repair status</p>
        </div>

        {/* What's Next */}
        <div className="bg-neutral-50 rounded-xl p-4 mb-6 text-left">
          <p className="text-sm font-semibold text-neutral-700 mb-3">What happens next?</p>
          <ol className="space-y-2">
            {[
              'You\'ll receive an SMS & WhatsApp confirmation',
              'A technician will call to confirm the appointment',
              'Technician visits your address at the scheduled time',
              'Diagnosis & repair estimate shared before any work begins',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-neutral-600">
                <span className="h-5 w-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Link
            href={`/track?id=${ticketId}`}
            className="inline-flex items-center justify-center gap-2 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all"
          >
            Track Your Repair <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="py-3 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
