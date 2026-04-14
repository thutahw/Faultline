type Stats = {
  open: number
  in_progress: number
  resolved: number
  closed: number
  total: number
}

export default function StatsBar({ stats }: { stats: Stats }) {
  if (stats.total === 0) return null

  const segments = [
    { key: 'open', count: stats.open, color: 'bg-green-500' },
    { key: 'in_progress', count: stats.in_progress, color: 'bg-blue-500' },
    { key: 'resolved', count: stats.resolved, color: 'bg-purple-500' },
    { key: 'closed', count: stats.closed, color: 'bg-gray-400' },
  ]

  return (
    <div className="w-full h-2 rounded-full overflow-hidden flex bg-gray-100">
      {segments.map((seg) => {
        const pct = (seg.count / stats.total) * 100
        if (pct === 0) return null
        return (
          <div
            key={seg.key}
            className={`${seg.color} h-full`}
            style={{ width: `${pct}%` }}
            title={`${seg.key.replace('_', ' ')}: ${seg.count}`}
          />
        )
      })}
    </div>
  )
}
