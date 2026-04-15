type Stats = {
  open: number
  in_progress: number
  resolved: number
  closed: number
  total: number
}

const segments = [
  { key: 'open' as const, color: '#10b981', label: 'Open' },
  { key: 'in_progress' as const, color: '#3b82f6', label: 'In Progress' },
  { key: 'resolved' as const, color: '#8b5cf6', label: 'Resolved' },
  { key: 'closed' as const, color: '#94a3b8', label: 'Closed' },
]

export default function StatsBar({ stats }: { stats: Stats }) {
  if (stats.total === 0) return null

  return (
    <div className="w-full">
      <div className="flex h-1.5 rounded-full overflow-hidden bg-slate-100 gap-px">
        {segments.map((seg) => {
          const pct = (stats[seg.key] / stats.total) * 100
          if (pct === 0) return null
          return (
            <div
              key={seg.key}
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, backgroundColor: seg.color }}
              title={`${seg.label}: ${stats[seg.key]}`}
            />
          )
        })}
      </div>
    </div>
  )
}
