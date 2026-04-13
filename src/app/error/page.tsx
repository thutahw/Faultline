export default function ErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-2xl font-bold mb-4 text-red-600">Authentication Error</h1>
      <p>Sorry, something went wrong with your authentication attempt.</p>
      <a href="/login" className="mt-4 text-blue-600 hover:underline">Back to Login</a>
    </div>
  )
}
