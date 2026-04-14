'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function MobileNav({ email }: { email: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-gray-500 hover:text-black"
        aria-label="Toggle menu"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50">
          <div className="flex flex-col p-4 gap-3">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="text-gray-700 hover:text-black font-medium"
            >
              Projects
            </Link>
            <div className="border-t border-gray-200 pt-3">
              <span className="text-sm text-gray-500 block mb-2">{email}</span>
              <Link
                href="/logout"
                onClick={() => setOpen(false)}
                className="text-sm text-gray-700 hover:text-black font-medium"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
