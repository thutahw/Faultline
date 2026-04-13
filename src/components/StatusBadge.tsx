export type IssueStatus = 'open' | 'in_progress' | 'resolved' | 'closed'

interface StatusBadgeProps {
  status: IssueStatus | string
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    open: 'bg-green-100 text-green-700',
    in_progress: 'bg-blue-100 text-blue-700',
    resolved: 'bg-purple-100 text-purple-700',
    closed: 'bg-gray-100 text-gray-700',
  }

  const normalizedStatus = status as IssueStatus
  const currentStyle = styles[normalizedStatus] || styles.closed

  return (
    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${currentStyle}`}>
      {status.replace('_', ' ')}
    </span>
  )
}
