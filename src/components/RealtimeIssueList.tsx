'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import StatusBadge from './StatusBadge'

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
}

export default function RealtimeIssueList({ 
  initialIssues, 
  projectId,
  slug
}: { 
  initialIssues: Issue[], 
  projectId: string,
  slug: string
}) {
  const [issues, setIssues] = useState(initialIssues)
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
            // Need to fetch creator info for the new issue
            const { data: newIssue } = await supabase
              .from('issues')
              .select('*, creator:profiles!issues_creator_id_fkey(full_name, email)')
              .eq('id', payload.new.id)
              .single()
            
            if (newIssue) {
              setIssues((prev) => [newIssue as Issue, ...prev])
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

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="p-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">
        Issues ({issues.length})
      </div>
      
      {issues.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          No issues found. Create one to get started!
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {issues.map((issue) => (
            <li key={issue.id} className="p-4 hover:bg-gray-50 transition">
              <Link href={`/projects/${slug}/issues/${issue.id}`} className="block">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-lg text-black">{issue.title}</h4>
                  <StatusBadge status={issue.status} />
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Priority: <span className="capitalize font-medium text-black">{issue.priority}</span></span>
                  <span>Created by {issue.creator?.full_name || issue.creator?.email || 'Unknown'}</span>
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
