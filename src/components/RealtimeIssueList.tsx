'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ChevronRight, Filter } from 'lucide-react'
import StatusBadge from './StatusBadge'
import LabelBadge from './LabelBadge'

type Label = {
  id: string
  name: string
  color: string
}

type Issue = {
  id: string
  title: string
  status: string
  priority: string
  created_at: string
  creator: {
    full_name: string | null
    email: string
  } | null
  assignee: {
    full_name: string | null
    email: string
  } | null
  labels: Label[]
}

const priorityColors: Record<string, string> = {
  urgent: 'text-rose-600 bg-rose-50',
  high: 'text-amber-600 bg-amber-50',
  medium: 'text-blue-600 bg-blue-50',
  low: 'text-slate-500 bg-slate-50',
}

export default function RealtimeIssueList({
  initialIssues,
  projectId,
  slug,
  projectLabels = [],
}: {
  initialIssues: Issue[]
  projectId: string
  slug: string
  projectLabels?: Label[]
}) {
  const [issues, setIssues] = useState(initialIssues)
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [labelFilter, setLabelFilter] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('realtime:issues')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'issues',
          filter: `project_id=eq.${projectId}`
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const { data: newIssue } = await supabase
              .from('issues')
              .select('*, creator:profiles!issues_creator_id_fkey(full_name, email), assignee:profiles!issues_assignee_id_fkey(full_name, email)')
              .eq('id', payload.new.id)
              .single()

            if (newIssue) {
              setIssues((prev) => [{ ...newIssue, labels: [] } as unknown as Issue, ...prev])
            }
          } else if (payload.eventType === 'UPDATE') {
            setIssues((prev) =>
              prev.map((issue) =>
                issue.id === payload.new.id ? { ...issue, ...payload.new } : issue
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setIssues((prev) => prev.filter((issue) => issue.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, projectId])

  const hasFilters = statusFilter || priorityFilter || labelFilter
  const filtered = issues.filter((issue) => {
    if (statusFilter && issue.status !== statusFilter) return false
    if (priorityFilter && issue.priority !== priorityFilter) return false
    if (labelFilter && !issue.labels?.some((l) => l.id === labelFilter)) return false
    return true
  })

  function getAssigneeInitial(assignee: Issue['assignee']) {
    if (!assignee) return null
    return (assignee.full_name || assignee.email || '?')[0].toUpperCase()
  }

  return (
    <div className="card overflow-hidden">
      {/* Filter Bar */}
      <div className="px-5 py-3.5 bg-slate-50/50 border-b border-slate-200 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400" />
          <span className="text-sm font-semibold text-slate-700">
            {filtered.length} {filtered.length === 1 ? 'issue' : 'issues'}
          </span>
          {hasFilters && (
            <button
              onClick={() => { setStatusFilter(''); setPriorityFilter(''); setLabelFilter('') }}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium ml-1"
            >
              Clear filters
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="select-field !w-auto !py-1.5 text-xs">
            <option value="">All statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="select-field !w-auto !py-1.5 text-xs">
            <option value="">All priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          {projectLabels.length > 0 && (
            <select value={labelFilter} onChange={(e) => setLabelFilter(e.target.value)} className="select-field !w-auto !py-1.5 text-xs">
              <option value="">All labels</option>
              {projectLabels.map((label) => (
                <option key={label.id} value={label.id}>{label.name}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="px-5 py-16 text-center">
          <p className="text-sm text-slate-400">
            {issues.length === 0 ? 'No issues yet. Create one to get started.' : 'No issues match the current filters.'}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {filtered.map((issue) => (
            <li key={issue.id} className="group">
              <Link href={`/projects/${slug}/issues/${issue.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                    <span className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {issue.title}
                    </span>
                    {issue.labels?.map((label) => (
                      <LabelBadge key={label.id} name={label.name} color={label.color} />
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className={`inline-flex px-1.5 py-0.5 rounded font-medium capitalize ${priorityColors[issue.priority] || ''}`}>
                      {issue.priority}
                    </span>
                    <span>{issue.creator?.full_name || issue.creator?.email || 'Unknown'}</span>
                    <span>{new Date(issue.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {issue.assignee && (
                    <div
                      className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center"
                      title={issue.assignee.full_name || issue.assignee.email || ''}
                    >
                      {getAssigneeInitial(issue.assignee)}
                    </div>
                  )}
                  <StatusBadge status={issue.status} />
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
