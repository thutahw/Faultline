import Link from "next/link"
import { Bug, Zap, Users, BarChart3 } from "lucide-react"

const features = [
  {
    icon: Bug,
    title: "Issue Tracking",
    description: "Create, assign, and track issues with priorities, statuses, and labels.",
  },
  {
    icon: Zap,
    title: "Real-Time Updates",
    description: "See changes instantly across all connected clients via Supabase Realtime.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Assign issues, leave comments, and work together on projects.",
  },
  {
    icon: BarChart3,
    title: "Dashboard Analytics",
    description: "Track project health with at-a-glance stats and status breakdowns.",
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-24 sm:py-32 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-black mb-6">
            Faultline
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            A real-time issue tracker built with Next.js and Supabase.
            Track bugs, manage projects, and collaborate with your team.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition text-lg"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="border border-gray-300 text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-50 transition text-lg"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Built for teams that ship</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white border border-gray-200 rounded-lg p-6">
              <feature.icon size={32} className="text-black mb-4" />
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
          Built with Next.js, Supabase, and Tailwind CSS.
        </div>
      </footer>
    </main>
  )
}
