import Link from 'next/link'
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
      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition bg-white text-black flex flex-col gap-3"
    >
      <h3 className="text-lg font-bold">{project.name}</h3>
      <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>

      {s.total > 0 && (
        <>
          <StatsBar stats={s} />
          <div className="flex gap-4 text-xs text-gray-500">
            <span><span className="font-semibold text-green-600">{s.open}</span> open</span>
            <span><span className="font-semibold text-blue-600">{s.in_progress}</span> in progress</span>
            {s.urgent > 0 && (
              <span><span className="font-semibold text-red-600">{s.urgent}</span> urgent</span>
            )}
            {s.recent_7d > 0 && (
              <span><span className="font-semibold text-gray-700">{s.recent_7d}</span> this week</span>
            )}
          </div>
        </>
      )}

      {s.total === 0 && (
        <span className="text-xs text-gray-400">No issues yet</span>
      )}
    </Link>
  )
}
