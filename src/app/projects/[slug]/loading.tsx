export default function ProjectLoading() {
  return (
    <div className="page-container animate-pulse">
      <div className="mb-8">
        <div className="h-4 bg-slate-200 rounded w-36 mb-4" />
        <div className="h-7 bg-slate-200 rounded w-52 mb-2" />
        <div className="h-4 bg-slate-100 rounded w-80" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card px-4 py-3 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-slate-200" />
            <div>
              <div className="h-6 bg-slate-200 rounded w-8 mb-1" />
              <div className="h-3 bg-slate-100 rounded w-16" />
            </div>
          </div>
        ))}
      </div>
      <div className="card overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50/50 border-b border-slate-200">
          <div className="h-4 bg-slate-200 rounded w-20" />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="px-5 py-3.5 border-b border-slate-100">
            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-slate-100 rounded w-1/3" />
          </div>
        ))}
      </div>
    </div>
  )
}
