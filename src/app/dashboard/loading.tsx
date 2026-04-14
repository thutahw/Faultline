export default function DashboardLoading() {
  return (
    <div className="flex flex-col p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto w-full animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <div className="h-7 bg-gray-200 rounded w-32" />
        <div className="h-10 bg-gray-200 rounded w-28" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-6 bg-white">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
            <div className="h-4 bg-gray-100 rounded w-full mb-2" />
            <div className="h-4 bg-gray-100 rounded w-2/3 mb-4" />
            <div className="h-2 bg-gray-100 rounded w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
