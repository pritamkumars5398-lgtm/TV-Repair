export default function AdminLoading() {
  return (
    <div className="space-y-6 max-w-7xl animate-pulse">
      <div className="h-6 w-36 bg-neutral-200 rounded-lg" />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-neutral-200 p-4 space-y-3">
            <div className="h-9 w-9 bg-neutral-200 rounded-lg" />
            <div className="h-7 w-12 bg-neutral-200 rounded" />
            <div className="h-3 w-20 bg-neutral-100 rounded" />
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 p-5">
          <div className="h-5 w-40 bg-neutral-200 rounded mb-4" />
          <div className="h-[200px] bg-neutral-100 rounded-lg" />
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <div className="h-5 w-32 bg-neutral-200 rounded mb-4" />
          <div className="h-[200px] bg-neutral-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
