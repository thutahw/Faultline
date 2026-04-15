export default function IssueLoading() {
  return (
    <div className="page-container animate-pulse">
      <div className="mb-6">
        <div className="h-4 bg-slate-200 rounded w-56 mb-4" />
        <div className="flex gap-3 mb-3">
          <div className="h-6 bg-slate-200 rounded-full w-20" />
          <div className="h-4 bg-slate-100 rounded w-48 mt-1" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="h-8 bg-slate-200 rounded w-3/4 mb-5" />
            <div className="card p-5">
              <div className="h-3 bg-slate-200 rounded w-20 mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-100 rounded w-full" />
                <div className="h-4 bg-slate-100 rounded w-full" />
                <div className="h-4 bg-slate-100 rounded w-2/3" />
              </div>
            </div>
          </div>
          <div className="card p-5">
            <div className="h-4 bg-slate-200 rounded w-24 mb-5" />
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                  <div className="flex-1">
                    <div className="h-3 bg-slate-200 rounded w-32 mb-2" />
                    <div className="h-16 bg-slate-50 rounded-lg border border-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 space-y-4">
          <div className="card p-5">
            <div className="h-3 bg-slate-200 rounded w-16 mb-4" />
            <div className="h-10 bg-slate-100 rounded-lg mb-2.5" />
            <div className="h-10 bg-slate-100 rounded-lg" />
          </div>
          <div className="card p-5">
            <div className="h-3 bg-slate-200 rounded w-12 mb-4" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 bg-slate-100 rounded w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
