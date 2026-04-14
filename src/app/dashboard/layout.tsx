import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-black">
                Faultline
              </Link>
              <div className="hidden sm:flex sm:ml-6 sm:space-x-8">
                <Link
                  href="/dashboard"
                  className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Projects
                </Link>
              </div>
            </div>
            <div className="hidden sm:flex sm:items-center">
              <span className="text-sm text-gray-500 mr-4">{user.email}</span>
              <Link
                href="/logout"
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
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
