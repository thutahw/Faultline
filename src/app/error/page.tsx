import Link from 'next/link'
import { AlertCircle, ArrowLeft } from 'lucide-react'

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50">
      <div className="text-center max-w-sm">
        <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={24} className="text-rose-500" />
        </div>
        <h1 className="text-lg font-semibold text-slate-900 mb-2">Authentication Error</h1>
        <p className="text-sm text-slate-500 mb-6">
          Something went wrong during authentication. Please check your credentials and try again.
        </p>
        <Link href="/login" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to login
        </Link>
      </div>
    </div>
  )
}
