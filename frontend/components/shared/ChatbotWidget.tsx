'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Minimize2 } from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  from: 'bot' | 'user';
  text: string;
  cta?: { label: string; href: string };
}

function getBotResponse(input: string): Message {
  const text = input.toLowerCase();

  if (/charges?|price|cost|fee|₹/.test(text)) {
    return {
      id: Date.now().toString(),
      from: 'bot',
      text: 'Service visit fee is ₹250. Repair cost depends on diagnosis. We\'ll share an estimate before starting any work.',
    };
  }
  if (/status|track|tracking|repair|ticket/.test(text)) {
    return {
      id: Date.now().toString(),
      from: 'bot',
      text: 'You can track your repair by entering your Ticket ID (TVR-YYYY-XXXX) on the Track Repair page.',
      cta: { label: 'Track Repair →', href: '/track' },
    };
  }
  if (/hours?|time|open|close|timing/.test(text)) {
    return {
      id: Date.now().toString(),
      from: 'bot',
      text: 'We\'re open Mon–Sat, 9am–7pm. Emergency repairs may be available on Sunday with prior appointment.',
    };
  }
  if (/book|appointment|visit|schedule/.test(text)) {
    return {
      id: Date.now().toString(),
      from: 'bot',
      text: 'You can book a service visit online. A technician will visit with just ₹250 service fee.',
      cta: { label: 'Book Repair →', href: '/book' },
    };
  }
  if (/speaker|product|catalog|audio/.test(text)) {
    return {
      id: Date.now().toString(),
      from: 'bot',
      text: 'We manufacture premium speakers and home theater systems. Check out our product catalog!',
      cta: { label: 'View Products →', href: '/products' },
    };
  }
  if (/warranty|guarantee|assurance/.test(text)) {
    return {
      id: Date.now().toString(),
      from: 'bot',
      text: 'We offer 30-day warranty on all repairs and onsite warranty on new speakers.',
    };
  }

  return {
    id: Date.now().toString(),
    from: 'bot',
    text: 'I didn\'t quite understand that. Would you like to talk to a human agent?',
    cta: { label: 'Chat on WhatsApp →', href: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'}` },
  };
}

const INITIAL_MESSAGE: Message = {
  id: 'welcome',
  from: 'bot',
  text: 'Hi! I\'m the TV Repair Assistant 👋 How can I help you today? Ask about charges, booking, repair status, or our services.',
};

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('chatbot_open');
    if (saved === 'true') setIsOpen(true);
  }, []);

  useEffect(() => {
    sessionStorage.setItem('chatbot_open', String(isOpen));
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = { id: Date.now().toString(), from: 'user', text: trimmed };
    const botMsg = getBotResponse(trimmed);

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open chat assistant'}
        className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 transition-all duration-200 hover:scale-110"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-80 rounded-2xl bg-white shadow-xl border border-neutral-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-primary-700">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">TV Repair Assistant</p>
                <p className="text-xs text-primary-200">Online · Instant replies</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Minimize chat"
              className="text-primary-200 hover:text-white transition-colors"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-72">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.from === 'user'
                      ? 'bg-primary-100 text-primary-900 rounded-br-sm'
                      : 'bg-neutral-100 text-neutral-800 rounded-bl-sm'
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.cta && (
                    <Link
                      href={msg.cta.href}
                      target={msg.cta.href.startsWith('http') ? '_blank' : undefined}
                      className="mt-2 inline-block text-xs font-semibold text-primary-600 hover:text-primary-700 underline"
                    >
                      {msg.cta.label}
                    </Link>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-neutral-200 p-3 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="flex-1 text-sm border border-neutral-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={sendMessage}
              aria-label="Send message"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
