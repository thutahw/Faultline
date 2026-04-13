import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-8">Faultline</h1>
        <p className="mb-4">Real-time issue tracking built on Supabase.</p>
        <Link 
          href="/login" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
}
