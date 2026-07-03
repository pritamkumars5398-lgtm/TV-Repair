import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          TV Repair CRM
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-600">
          <Link href="/portal" className="transition hover:text-slate-900">
            Customer
          </Link>
          <Link href="/technician" className="transition hover:text-slate-900">
            Technician
          </Link>
          <Link href="/manager" className="transition hover:text-slate-900">
            Manager
          </Link>
          <Link href="/admin" className="transition hover:text-slate-900">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
