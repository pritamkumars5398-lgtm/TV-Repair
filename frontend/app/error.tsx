'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
          <div className="text-center max-w-md">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Something went wrong</h1>
            <p className="text-neutral-500 text-sm mb-6">
              An unexpected error occurred. Our team has been notified.
              {error.digest && <span className="block mt-1 text-xs font-mono text-neutral-400">Ref: {error.digest}</span>}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={reset}
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
              >
                Try again
              </button>
              <a
                href="/"
                className="border border-neutral-200 text-neutral-700 hover:bg-neutral-100 font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
              >
                Go home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
