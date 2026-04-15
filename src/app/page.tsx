import Link from "next/link"
import { Bug, Zap, Users, BarChart3, ArrowRight, Activity } from "lucide-react"

const features = [
  {
    icon: Bug,
    title: "Issue Tracking",
    description: "Create, assign, and prioritize issues with labels, statuses, and detailed descriptions.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: Zap,
    title: "Real-Time Sync",
    description: "Changes propagate instantly across all sessions via Supabase Realtime subscriptions.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Assign team members, leave threaded comments, and track who changed what.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "At-a-glance dashboards with status breakdowns and activity tracking per project.",
    color: "bg-emerald-50 text-emerald-600",
  },
]

const techStack = [
  { name: "Next.js", desc: "App Router & Server Actions" },
  { name: "Supabase", desc: "Auth, DB, Realtime, RLS" },
  { name: "TypeScript", desc: "End-to-end type safety" },
  { name: "Tailwind CSS", desc: "Utility-first styling" },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity size={20} className="text-indigo-600" />
            <span className="text-base font-bold text-slate-900">Faultline</span>
          </div>
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Sign in
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(99,102,241,0.08),transparent)]" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold mb-6 ring-1 ring-inset ring-indigo-600/10">
            <Zap size={12} />
            Built on Supabase
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-5 leading-[1.1]">
            Track issues.<br className="hidden sm:block" /> Ship faster.
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            A real-time issue tracker with instant updates, team collaboration,
            and project analytics. Built with the modern stack.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/login"
              className="btn-primary text-base px-6 py-3 flex items-center gap-2"
            >
              Get started
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className="btn-secondary text-base px-6 py-3"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Everything you need to ship</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Purpose-built for teams that want real-time visibility into their project health.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature) => (
              <div key={feature.title} className="card p-5">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${feature.color}`}>
                  <feature.icon size={20} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1.5">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h3 className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400 mb-8">Built with</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {techStack.map((tech) => (
              <div key={tech.name} className="text-center py-4 px-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="font-semibold text-slate-900 text-sm">{tech.name}</div>
                <div className="text-xs text-slate-400 mt-0.5">{tech.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Activity size={14} />
            <span>Faultline</span>
          </div>
          <p className="text-xs text-slate-400">A demo project by Michael</p>
        </div>
      </footer>
    </main>
  )
}
