export default function DashboardLoading() {
  return (
    <div className="page-container animate-pulse">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-6 bg-slate-200 rounded-md w-28 mb-2" />
          <div className="h-4 bg-slate-100 rounded-md w-48" />
        </div>
        <div className="h-10 bg-slate-200 rounded-lg w-32" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-5">
            <div className="h-5 bg-slate-200 rounded w-3/4 mb-3" />
            <div className="h-4 bg-slate-100 rounded w-full mb-2" />
            <div className="h-4 bg-slate-100 rounded w-2/3 mb-5" />
            <div className="border-t border-slate-100 pt-3">
              <div className="h-1.5 bg-slate-100 rounded-full w-full mb-2.5" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
