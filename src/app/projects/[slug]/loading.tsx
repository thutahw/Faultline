export default function ProjectLoading() {
  return (
    <div className="flex flex-col p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto w-full animate-pulse">
      <div className="mb-8">
        <div className="h-4 bg-gray-200 rounded w-48 mb-4" />
        <div className="h-8 bg-gray-200 rounded w-64 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-96" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="h-8 bg-gray-200 rounded w-12 mb-1" />
            <div className="h-4 bg-gray-100 rounded w-20" />
          </div>
        ))}
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="h-5 bg-gray-200 rounded w-24" />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 border-b border-gray-200">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
