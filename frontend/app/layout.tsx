import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { Providers } from '@/lib/providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'RC RepairCart',
    template: '%s | RC RepairCart',
  },
  description: 'RC RepairCart — Professional TV repair, speaker manufacturing, and home theater installation.',
  keywords: ['TV repair', 'LED TV repair', 'Smart TV repair', 'speaker manufacturing', 'home theater', 'RC', 'RepairCart'],
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'RC RepairCart',
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
