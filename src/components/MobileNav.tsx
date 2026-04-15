'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react'

export default function MobileNav({ email }: { email: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center sm:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 -mr-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
        aria-label="Toggle menu"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 top-14 bg-black/20 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-14 left-0 right-0 bg-white border-b border-slate-200 shadow-lg z-50">
            <div className="flex flex-col p-3 gap-1">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:bg-slate-50 rounded-lg font-medium text-sm transition-colors"
              >
                <LayoutDashboard size={16} />
                Projects
              </Link>
              <div className="border-t border-slate-100 my-1" />
              <div className="px-3 py-2 text-xs text-slate-400">{email}</div>
              <Link
                href="/logout"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:bg-slate-50 rounded-lg font-medium text-sm transition-colors"
              >
                <LogOut size={16} />
                Sign out
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
