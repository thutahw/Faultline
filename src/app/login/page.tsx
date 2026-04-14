'use client'

import { login, signup } from './actions'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-black">Faultline</Link>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="border border-gray-300 p-2.5 rounded-lg text-black focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="border border-gray-300 p-2.5 rounded-lg text-black focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                placeholder="Your password"
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button
                formAction={login}
                className="bg-black text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition font-bold flex-1"
              >
                Log in
              </button>
              <button
                formAction={signup}
                className="bg-gray-100 text-black px-4 py-2.5 rounded-lg hover:bg-gray-200 transition font-bold flex-1 border border-gray-300"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/" className="hover:text-black">Back to home</Link>
        </p>
      </div>
    </div>
  )
}
