import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <form className="flex flex-col gap-4 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4">Login or Sign Up</h1>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required className="border p-2 rounded text-black" />
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required className="border p-2 rounded text-black" />
        <div className="flex gap-2">
          <button formAction={login} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex-1">Log in</button>
          <button formAction={signup} className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 flex-1">Sign up</button>
        </div>
      </form>
    </div>
  )
}
