import Link from 'next/link';
import { SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-extrabold text-neutral-200 mb-4 leading-none">404</p>
        <div className="h-14 w-14 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-5 -mt-4">
          <SearchX className="h-7 w-7 text-neutral-400" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Page not found</h1>
        <p className="text-neutral-500 text-sm mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
          >
            Back to home
          </Link>
          <Link
            href="/portal/login"
            className="border border-neutral-200 text-neutral-700 hover:bg-neutral-100 font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
          >
            Customer portal
          </Link>
        </div>
      </div>
    </div>
  );
}
