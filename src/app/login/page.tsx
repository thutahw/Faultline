'use client'

import { login, signup } from './actions'
import Link from 'next/link'
import { Activity } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <Activity size={24} className="text-indigo-600" />
            <span className="text-2xl font-bold text-slate-900">Faultline</span>
          </Link>
          <p className="text-sm text-slate-500">Sign in to track issues and collaborate</p>
        </div>

        <div className="card p-6">
          <form className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="label-text">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-field"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="label-text">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input-field"
                placeholder="Your password"
                minLength={6}
              />
            </div>
            <div className="flex gap-3 mt-2">
              <button formAction={login} className="btn-primary flex-1">
                Sign in
              </button>
              <button formAction={signup} className="btn-secondary flex-1">
                Create account
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          <Link href="/" className="hover:text-slate-600 transition-colors">
            &larr; Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
