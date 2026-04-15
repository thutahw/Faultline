import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Activity, LayoutDashboard, LogOut } from 'lucide-react'
import MobileNav from '@/components/MobileNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14">
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Activity size={18} className="text-indigo-600" />
                <span className="text-base font-bold text-slate-900">Faultline</span>
              </Link>
              <div className="hidden sm:flex items-center">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <LayoutDashboard size={15} />
                  Projects
                </Link>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md">{user.email}</span>
              <Link
                href="/logout"
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                <LogOut size={14} />
                <span className="text-xs font-medium">Sign out</span>
              </Link>
            </div>
            <MobileNav email={user.email || ''} />
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}
