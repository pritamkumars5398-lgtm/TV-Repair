'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Minimize2 } from 'lucide-react';
import Link from 'next/link';
import { getWhatsAppUrl } from '@/lib/constants/whatsapp';

interface Message {
  id: string;
  from: 'bot' | 'user';
  text: string;
  cta?: { label: string; href: string };
}

let messageCounter = 0;
const nextId = () => `${Date.now()}-${++messageCounter}`;

const bot = (text: string, cta?: Message['cta']): Message => ({ id: nextId(), from: 'bot', text, cta });

// Order matters: more specific intents are checked first so e.g. "book repair" goes to booking, not tracking.
// Keywords include common Hindi / Hinglish words used by customers.
function getBotResponse(input: string): Message {
  const text = input.toLowerCase();

  if (/^\s*(hi+|hello+|hey+|hii+|namaste|namaskar|good (morning|afternoon|evening))\b/.test(text)) {
    return bot('Hello! 👋 How can I help you? You can ask about repair charges, booking a visit, tracking your repair, timings or warranty.');
  }
  if (/human|agent|call|phone|contact|baat|whatsapp|support|help ?line/.test(text)) {
    return bot('You can call us at +91 8586-887-887 / +91 8586-807-887 or chat with our team on WhatsApp.', {
      label: 'Chat on WhatsApp →',
      href: getWhatsAppUrl('Hi RepairCart, I need help with my TV repair.'),
    });
  }
  if (/\bbook|appointment|visit|schedule|bulana|bulao|technician|engineer/.test(text)) {
    return bot('You can book a service visit online in under a minute. A technician will visit with just ₹250 service fee.', {
      label: 'Book Repair →',
      href: '/book',
    });
  }
  if (/status|track|ticket|tvr-|kab tak/.test(text)) {
    return bot('You can track your repair by entering your Ticket ID (TVR-YYYY-XXXX) on the Track Repair page.', {
      label: 'Track Repair →',
      href: '/track',
    });
  }
  if (/charges?|price|cost|fee|rate|kitna|paisa|paise|₹|rs\.?\b/.test(text)) {
    return bot('Service visit fee is ₹250. Repair cost depends on diagnosis — we share an estimate before starting any work.', {
      label: 'Book Repair →',
      href: '/book',
    });
  }
  if (/hours?|timing|time|open|close|sunday|kab/.test(text)) {
    return bot("We're open Mon–Sat, 9 AM – 7 PM. Emergency repairs may be available on Sunday with prior appointment.");
  }
  if (/warranty|guarantee|assurance/.test(text)) {
    return bot('We offer a 45-day same-fault warranty on all TV repairs and onsite warranty on new speakers.');
  }
  if (/address|location|where|kaha|noida|shop|office/.test(text)) {
    return bot('Our address: C-295, Sector-10, Noida, UP-201301. We also provide doorstep service.', {
      label: 'Contact Us →',
      href: '/contact',
    });
  }
  if (/speaker|product|catalog|audio|home theat/.test(text)) {
    return bot('We manufacture premium speakers and home theater systems. Check out our product catalog!', {
      label: 'View Products →',
      href: '/products',
    });
  }
  if (/panel|screen|display|backlight|power|smps|board|motherboard|sound|no picture|line|dead|on nahi|band|kharab|repair|tv/.test(text)) {
    return bot('We repair LED/LCD/Smart TV panels, backlights, power boards (SMPS) and motherboards for all brands. Book a visit and our technician will diagnose it at your place.', {
      label: 'Book Repair →',
      href: '/book',
    });
  }
  if (/thank|thanks|dhanyavad|shukriya|ok|okay/.test(text)) {
    return bot("You're welcome! 😊 Anything else I can help you with?");
  }

  return bot("Sorry, I didn't quite get that. Would you like to talk to our team directly?", {
    label: 'Chat on WhatsApp →',
    href: getWhatsAppUrl(`Hi RepairCart, I have a question: ${input}`),
  });
}

const INITIAL_MESSAGE: Message = {
  id: 'welcome',
  from: 'bot',
  text: "Hi! I'm the TV Repair Assistant 👋 How can I help you today? Ask about charges, booking, repair status, or our services.",
};

const QUICK_REPLIES = ['Repair charges', 'Book a repair', 'Track my repair', 'Talk to human'];

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem('chatbot_open') === 'true') setIsOpen(true);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem('chatbot_open', String(isOpen));
    } catch {}
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Scroll only the messages container — scrollIntoView would also scroll the whole page.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping, isOpen]);

  const sendMessage = (value?: string) => {
    const trimmed = (value ?? input).trim();
    if (!trimmed || isTyping) return;

    setMessages((prev) => [...prev, { id: nextId(), from: 'user', text: trimmed }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, getBotResponse(trimmed)]);
      setIsTyping(false);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Close chat' : 'Open chat assistant'}
        className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 transition-all duration-200 hover:scale-110"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 left-4 right-4 sm:left-6 sm:right-auto z-50 sm:w-80 rounded-2xl bg-white shadow-xl border border-neutral-200 flex flex-col overflow-hidden">
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
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Minimize chat"
              className="text-primary-200 hover:text-white transition-colors"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3 max-h-72 sm:max-h-80">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed break-words ${
                    msg.from === 'user'
                      ? 'bg-primary-600 text-white rounded-br-sm'
                      : 'bg-neutral-100 text-neutral-800 rounded-bl-sm'
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.cta &&
                    (msg.cta.href.startsWith('http') ? (
                      <a
                        href={msg.cta.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs font-semibold text-primary-600 hover:text-primary-700 underline"
                      >
                        {msg.cta.label}
                      </a>
                    ) : (
                      <Link
                        href={msg.cta.href}
                        onClick={() => setIsOpen(false)}
                        className="mt-2 inline-block text-xs font-semibold text-primary-600 hover:text-primary-700 underline"
                      >
                        {msg.cta.label}
                      </Link>
                    ))}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-neutral-100 px-4 py-3 flex gap-1" aria-label="Assistant is typing">
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}

            {messages.length === 1 && !isTyping && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => sendMessage(q)}
                    className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 hover:bg-primary-100 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-neutral-200 p-3 flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              aria-label="Type your message"
              className="flex-1 min-w-0 text-sm text-neutral-900 bg-white placeholder:text-neutral-400 border border-neutral-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
