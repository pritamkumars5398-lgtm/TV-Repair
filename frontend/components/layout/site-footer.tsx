export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white/90 py-6">
      <div className="mx-auto max-w-6xl px-6 text-sm text-slate-500">
        <p>© {new Date().getFullYear()} TV Repair CRM. Built for TV repair and speaker manufacturing workflows.</p>
      </div>
    </footer>
  );
}
