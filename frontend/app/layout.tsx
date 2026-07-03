import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { Providers } from '@/lib/providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Longwell Electronics',
    template: '%s | Longwell',
  },
  description: 'Longwell Electronics — Professional TV repair, speaker manufacturing, and home theater installation.',
  keywords: ['TV repair', 'LED TV repair', 'Smart TV repair', 'speaker manufacturing', 'home theater', 'Longwell', 'Electronics'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Longwell Electronics',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <body className="antialiased text-slate-800 bg-white">
        <Providers>
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
