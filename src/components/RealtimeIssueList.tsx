'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
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

  const filtered = issues.filter((issue) => {
    if (statusFilter && issue.status !== statusFilter) return false
    if (priorityFilter && issue.priority !== priorityFilter) return false
    if (labelFilter && !issue.labels?.some((l) => l.id === labelFilter)) return false
    return true
  })

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {/* Filter Bar */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <span className="font-semibold text-gray-700">Issues ({filtered.length})</span>
        <div className="flex flex-wrap gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm text-black"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm text-black"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          {projectLabels.length > 0 && (
            <select
              value={labelFilter}
              onChange={(e) => setLabelFilter(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm text-black"
            >
              <option value="">All Labels</option>
              {projectLabels.map((label) => (
                <option key={label.id} value={label.id}>{label.name}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          {issues.length === 0 ? 'No issues found. Create one to get started!' : 'No issues match the current filters.'}
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {filtered.map((issue) => (
            <li key={issue.id} className="p-4 hover:bg-gray-50 transition">
              <Link href={`/projects/${slug}/issues/${issue.id}`} className="block">
                <div className="flex justify-between items-start mb-1 gap-2">
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <h4 className="font-bold text-lg text-black">{issue.title}</h4>
                    {issue.labels?.map((label) => (
                      <LabelBadge key={label.id} name={label.name} color={label.color} />
                    ))}
                  </div>
                  <StatusBadge status={issue.status} />
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                  <span>Priority: <span className="capitalize font-medium text-black">{issue.priority}</span></span>
                  <span>Created by {issue.creator?.full_name || issue.creator?.email || 'Unknown'}</span>
                  {issue.assignee && (
                    <span className="inline-flex items-center gap-1">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                        {(issue.assignee.full_name || issue.assignee.email || '?')[0].toUpperCase()}
                      </span>
                      {issue.assignee.full_name || issue.assignee.email}
                    </span>
                  )}
                  <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
