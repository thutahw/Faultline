export default function IssueLoading() {
  return (
    <div className="flex flex-col p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto w-full animate-pulse">
      <div className="mb-8">
        <div className="h-4 bg-gray-200 rounded w-64 mb-4" />
        <div className="h-8 bg-gray-200 rounded w-96 mb-2" />
        <div className="flex gap-3">
          <div className="h-6 bg-gray-200 rounded w-16" />
          <div className="h-6 bg-gray-100 rounded w-24" />
          <div className="h-6 bg-gray-100 rounded w-32" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <div className="h-4 bg-gray-200 rounded w-24 mb-4" />
            <div className="h-4 bg-gray-100 rounded w-full mb-2" />
            <div className="h-4 bg-gray-100 rounded w-full mb-2" />
            <div className="h-4 bg-gray-100 rounded w-2/3" />
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="h-4 bg-gray-200 rounded w-20 mb-4" />
            <div className="h-10 bg-gray-200 rounded w-full mb-2" />
            <div className="h-10 bg-gray-200 rounded w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
