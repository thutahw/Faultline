import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { User, Tag } from 'lucide-react'
import StatusBadge from '@/components/StatusBadge'
import LabelBadge from '@/components/LabelBadge'
import CommentSection from '@/components/CommentSection'
import EditableIssue from '@/components/EditableIssue'
import { updateIssue, updateAssignee, updateLabels } from './actions'

export default async function IssuePage({
  params,
}: {
  params: Promise<{ slug: string; issueId: string }>
}) {
  const { slug, issueId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: issue, error: issueError } = await supabase
    .from('issues')
    .select('*, creator:profiles!issues_creator_id_fkey(full_name, email), assignee:profiles!issues_assignee_id_fkey(full_name, email), project:projects(id, name, owner_id)')
    .eq('id', issueId)
    .single()

  if (issueError || !issue) notFound()

  const { data: comments } = await supabase
    .from('comments')
    .select('*, profiles:profiles(full_name, email)')
    .eq('issue_id', issueId)
    .order('created_at', { ascending: true })

  const { data: issueLabels } = await supabase
    .from('issue_labels')
    .select('label:labels(id, name, color)')
    .eq('issue_id', issueId)

  const currentLabels = (issueLabels || []).map((il) => il.label).filter(Boolean)
  const currentLabelIds = new Set(currentLabels.map((l: any) => l.id))

  const { data: projectLabels } = await supabase
    .from('labels')
    .select('id, name, color')
    .eq('project_id', issue.project.id)
    .order('name')

  const { data: members } = await supabase
    .from('profiles')
    .select('id, full_name, email')

  const updateAssigneeBound = updateAssignee.bind(null, issueId, slug)
  const updateLabelsBound = updateLabels.bind(null, issueId, slug)

  return (
    <div className="page-container">
      <header className="mb-6">
        <div className="flex items-center gap-1.5 text-sm text-slate-400 mb-4">
          <Link href="/dashboard" className="hover:text-slate-600 transition-colors">Projects</Link>
          <span>/</span>
          <Link href={`/projects/${slug}`} className="hover:text-slate-600 transition-colors">{issue.project.name}</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">#{issueId.slice(0, 8)}</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <StatusBadge status={issue.status} />
          <span className="text-xs text-slate-500">
            Opened by <span className="font-medium text-slate-700">{issue.creator?.full_name || issue.creator?.email}</span>
            {' '}on {new Date(issue.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        {currentLabels.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-3">
            {currentLabels.map((label: any) => (
              <LabelBadge key={label.id} name={label.name} color={label.color} />
            ))}
          </div>
        )}
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <EditableIssue
            issueId={issueId}
            slug={slug}
            title={issue.title}
            description={issue.description}
            priority={issue.priority}
            status={issue.status}
            updateIssue={updateIssue}
          />

          <div className="card p-5">
            <CommentSection
              issueId={issueId}
              initialComments={comments as any || []}
              currentUserId={user.id}
            />
          </div>
        </div>

        <div className="lg:col-span-1 space-y-4">
          {/* Assignee */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <User size={14} className="text-slate-400" />
              <h3 className="section-title">Assignee</h3>
            </div>
            {issue.assignee && (
              <div className="flex items-center gap-2.5 mb-3 p-2 bg-slate-50 rounded-lg">
                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
                  {(issue.assignee.full_name || issue.assignee.email || '?')[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-700">{issue.assignee.full_name || issue.assignee.email}</span>
              </div>
            )}
            <form action={updateAssigneeBound} className="space-y-2.5">
              <select name="assignee_id" defaultValue={issue.assignee_id || ''} className="select-field text-sm">
                <option value="">Unassigned</option>
                {members?.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.full_name || member.email}
                  </option>
                ))}
              </select>
              <button type="submit" className="btn-secondary w-full text-sm">
                Update
              </button>
            </form>
          </div>

          {/* Labels */}
          {projectLabels && projectLabels.length > 0 && (
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={14} className="text-slate-400" />
                <h3 className="section-title">Labels</h3>
              </div>
              <form action={updateLabelsBound} className="space-y-3">
                <div className="space-y-2">
                  {projectLabels.map((label) => (
                    <label key={label.id} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
                      <input
                        type="checkbox"
                        name="labels"
                        value={label.id}
                        defaultChecked={currentLabelIds.has(label.id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <LabelBadge name={label.name} color={label.color} />
                    </label>
                  ))}
                </div>
                <button type="submit" className="btn-secondary w-full text-sm">
                  Update
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
