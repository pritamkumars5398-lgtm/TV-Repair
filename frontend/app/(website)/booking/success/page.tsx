import type { Metadata } from 'next';
import BookingSuccessClient from './BookingSuccessClient';

export const metadata: Metadata = {
  title: 'Booking Confirmed | RC RepairCart',
  description: 'Your TV repair service has been booked successfully.',
};

interface PageProps {
  searchParams: { ticketId?: string };
}

export default function BookingSuccessPage({ searchParams }: PageProps) {
  const ticketId = searchParams.ticketId || 'TKT-0000';

  return <BookingSuccessClient ticketId={ticketId} />;
}
