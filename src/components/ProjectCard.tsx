import Link from 'next/link'
import { ArrowRight, AlertTriangle, Clock } from 'lucide-react'
import StatsBar from './StatsBar'

type ProjectStats = {
  total: number
  open: number
  in_progress: number
  resolved: number
  closed: number
  urgent: number
  recent_7d: number
}

type Project = {
  id: string
  name: string
  slug: string
  description: string | null
}

export default function ProjectCard({ project, stats }: { project: Project; stats: ProjectStats | null }) {
  const s = stats || { total: 0, open: 0, in_progress: 0, resolved: 0, closed: 0, urgent: 0, recent_7d: 0 }

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="card p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200 group flex flex-col"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
            {project.name}
          </h3>
          {project.description && (
            <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">{project.description}</p>
          )}
        </div>
        <ArrowRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0 mt-1 ml-3" />
      </div>

      {s.total > 0 ? (
        <div className="mt-auto pt-3 border-t border-slate-100">
          <StatsBar stats={s} />
          <div className="flex items-center gap-4 mt-2.5 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-medium text-slate-700">{s.open}</span> open
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="font-medium text-slate-700">{s.in_progress}</span> active
            </span>
            {s.urgent > 0 && (
              <span className="flex items-center gap-1 text-amber-600">
                <AlertTriangle size={11} />
                <span className="font-medium">{s.urgent}</span> urgent
              </span>
            )}
            {s.recent_7d > 0 && (
              <span className="flex items-center gap-1 ml-auto">
                <Clock size={11} />
                {s.recent_7d} this week
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-auto pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-400">No issues yet</p>
        </div>
      )}
    </Link>
  )
}
