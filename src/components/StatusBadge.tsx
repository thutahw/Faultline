import { Circle, Loader, CheckCircle2, XCircle } from 'lucide-react'

export type IssueStatus = 'open' | 'in_progress' | 'resolved' | 'closed'

interface StatusBadgeProps {
  status: IssueStatus | string
}

const config: Record<IssueStatus, { label: string; className: string; icon: typeof Circle }> = {
  open: {
    label: 'Open',
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    icon: Circle,
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    icon: Loader,
  },
  resolved: {
    label: 'Resolved',
    className: 'bg-violet-50 text-violet-700 ring-violet-600/20',
    icon: CheckCircle2,
  },
  closed: {
    label: 'Closed',
    className: 'bg-slate-50 text-slate-600 ring-slate-500/20',
    icon: XCircle,
  },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const c = config[status as IssueStatus] || config.closed
  const Icon = c.icon

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${c.className}`}>
      <Icon size={12} />
      {c.label}
    </span>
  )
}
