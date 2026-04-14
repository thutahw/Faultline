import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
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

  if (issueError || !issue) {
    notFound()
  }

  const { data: comments } = await supabase
    .from('comments')
    .select('*, profiles:profiles(full_name, email)')
    .eq('issue_id', issueId)
    .order('created_at', { ascending: true })

  // Fetch labels for this issue
  const { data: issueLabels } = await supabase
    .from('issue_labels')
    .select('label:labels(id, name, color)')
    .eq('issue_id', issueId)

  const currentLabels = (issueLabels || []).map((il) => il.label).filter(Boolean)
  const currentLabelIds = new Set(currentLabels.map((l: any) => l.id))

  // Fetch all project labels
  const { data: projectLabels } = await supabase
    .from('labels')
    .select('id, name, color')
    .eq('project_id', issue.project.id)
    .order('name')

  // Fetch all members for assignee dropdown
  const { data: members } = await supabase
    .from('profiles')
    .select('id, full_name, email')

  const updateAssigneeBound = updateAssignee.bind(null, issueId, slug)
  const updateLabelsBound = updateLabels.bind(null, issueId, slug)

  return (
    <div className="flex flex-col p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto w-full">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/dashboard" className="hover:text-black">Dashboard</Link>
          <span>/</span>
          <Link href={`/projects/${slug}`} className="hover:text-black">{issue.project.name}</Link>
          <span>/</span>
          <span className="font-medium text-black">Issue #{issueId.slice(0, 8)}</span>
        </div>
        <div className="flex items-center gap-4 text-sm mb-4">
          <StatusBadge status={issue.status} />
          <span className="text-gray-500">
            Priority: <span className="capitalize font-medium text-black">{issue.priority}</span>
          </span>
          <span className="text-gray-500">
            Created by {issue.creator?.full_name || issue.creator?.email} on {new Date(issue.created_at).toLocaleDateString()}
          </span>
        </div>
        {currentLabels.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {currentLabels.map((label: any) => (
              <LabelBadge key={label.id} name={label.name} color={label.color} />
            ))}
          </div>
        )}
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <EditableIssue
            issueId={issueId}
            slug={slug}
            title={issue.title}
            description={issue.description}
            priority={issue.priority}
            status={issue.status}
            updateIssue={updateIssue}
          />

          <section>
            <CommentSection
              issueId={issueId}
              initialComments={comments as any || []}
              currentUserId={user.id}
            />
          </section>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Assignee */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Assignee</h3>
            <form action={updateAssigneeBound} className="flex flex-col gap-2">
              <select
                name="assignee_id"
                defaultValue={issue.assignee_id || ''}
                className="border p-2 rounded text-black text-sm"
              >
                <option value="">Unassigned</option>
                {members?.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.full_name || member.email}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition text-sm font-bold"
              >
                Update Assignee
              </button>
            </form>
            {issue.assignee && (
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                  {(issue.assignee.full_name || issue.assignee.email || '?')[0].toUpperCase()}
                </span>
                {issue.assignee.full_name || issue.assignee.email}
              </div>
            )}
          </div>

          {/* Labels */}
          {projectLabels && projectLabels.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Labels</h3>
              <form action={updateLabelsBound} className="flex flex-col gap-3">
                {projectLabels.map((label) => (
                  <label key={label.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="labels"
                      value={label.id}
                      defaultChecked={currentLabelIds.has(label.id)}
                      className="rounded"
                    />
                    <LabelBadge name={label.name} color={label.color} />
                  </label>
                ))}
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition text-sm font-bold mt-1"
                >
                  Update Labels
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
