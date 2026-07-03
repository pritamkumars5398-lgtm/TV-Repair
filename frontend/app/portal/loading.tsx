export default function PortalLoading() {
  return (
    <div className="space-y-6 max-w-5xl animate-pulse">
      <div className="h-6 w-48 bg-neutral-200 rounded-lg" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-neutral-200 p-4 space-y-3">
            <div className="h-9 w-9 bg-neutral-200 rounded-lg" />
            <div className="h-7 w-16 bg-neutral-200 rounded" />
            <div className="h-3 w-24 bg-neutral-100 rounded" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-3">
        <div className="h-5 w-32 bg-neutral-200 rounded" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-neutral-50">
            <div className="space-y-1.5">
              <div className="h-4 w-28 bg-neutral-200 rounded" />
              <div className="h-3 w-40 bg-neutral-100 rounded" />
            </div>
            <div className="h-5 w-20 bg-neutral-100 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
