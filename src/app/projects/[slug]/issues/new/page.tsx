import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'

export default async function NewIssuePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: project } = await supabase
    .from('projects')
    .select('id, name')
    .eq('slug', slug)
    .single()

  if (!project) notFound()

  const projectId = project.id

  const { data: labels } = await supabase
    .from('labels')
    .select('id, name, color')
    .eq('project_id', projectId)
    .order('name')

  const { data: members } = await supabase
    .from('profiles')
    .select('id, full_name, email')

  async function createIssue(formData: FormData) {
    'use server'

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const priority = formData.get('priority') as string
    const assigneeId = formData.get('assignee_id') as string
    const selectedLabels = formData.getAll('labels') as string[]

    const { data: issue, error } = await supabase
      .from('issues')
      .insert({
        title,
        description,
        priority,
        project_id: projectId,
        creator_id: user.id,
        assignee_id: assigneeId || null,
        status: 'open'
      })
      .select('id')
      .single()

    if (error) {
      console.error(error)
      return
    }

    if (selectedLabels.length > 0 && issue) {
      const { error: labelError } = await supabase
        .from('issue_labels')
        .insert(selectedLabels.map((labelId) => ({
          issue_id: issue.id,
          label_id: labelId,
        })))

      if (labelError) console.error(labelError)
    }

    revalidatePath(`/projects/${slug}`)
    redirect(`/projects/${slug}`)
  }

  return (
    <div className="page-container">
      <div className="max-w-lg">
        <div className="mb-8">
          <Link href={`/projects/${slug}`} className="text-sm text-slate-500 hover:text-slate-700 transition-colors">&larr; Back to {project.name}</Link>
          <h1 className="text-xl font-bold text-slate-900 mt-3">New issue</h1>
        </div>

        <form action={createIssue} className="card p-6 space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="title" className="label-text">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="input-field"
              placeholder="e.g. Navigation menu broken on mobile"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="description" className="label-text">Description</label>
            <textarea
              id="description"
              name="description"
              rows={5}
              className="input-field resize-none"
              placeholder="Provide more details about the issue..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="priority" className="label-text">Priority</label>
              <select id="priority" name="priority" className="select-field" defaultValue="medium">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="assignee_id" className="label-text">Assignee</label>
              <select id="assignee_id" name="assignee_id" className="select-field" defaultValue="">
                <option value="">Unassigned</option>
                {members?.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.full_name || member.email}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {labels && labels.length > 0 && (
            <div className="space-y-2">
              <span className="label-text">Labels</span>
              <div className="flex flex-wrap gap-2.5">
                {labels.map((label) => (
                  <label key={label.id} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="labels"
                      value={label.id}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium group-hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: label.color + '14', color: label.color, boxShadow: `inset 0 0 0 1px ${label.color}30` }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: label.color }} />
                      {label.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary text-sm">
              Create issue
            </button>
            <Link href={`/projects/${slug}`} className="btn-secondary text-sm">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
