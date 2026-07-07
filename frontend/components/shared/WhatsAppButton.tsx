'use client';

import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918586887887';
  const message = encodeURIComponent('Hi! I need help with TV repair / speaker service.');

  return (
    <a
      href={`https://wa.me/${number}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg bg-[#25D366] hover:bg-[#1ebe57] transition-all duration-200 hover:scale-110"
    >
      <MessageCircle className="h-7 w-7 text-white fill-white" />
    </a>
  );
}
