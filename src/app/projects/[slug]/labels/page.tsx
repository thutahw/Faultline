import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import LabelBadge from '@/components/LabelBadge'

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280', '#1e293b',
]

export default async function LabelsPage({
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
    .select('id, name, owner_id')
    .eq('slug', slug)
    .single()

  if (!project) notFound()

  const projectId = project.id
  const isOwner = project.owner_id === user.id

  const { data: labels } = await supabase
    .from('labels')
    .select('*')
    .eq('project_id', projectId)
    .order('name')

  async function createLabel(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const name = formData.get('name') as string
    const color = formData.get('color') as string

    const { error } = await supabase
      .from('labels')
      .insert({ name, color, project_id: projectId })

    if (error) {
      console.error(error)
      return
    }

    revalidatePath(`/projects/${slug}/labels`)
  }

  async function deleteLabel(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const labelId = formData.get('labelId') as string

    const { error } = await supabase
      .from('labels')
      .delete()
      .eq('id', labelId)

    if (error) {
      console.error(error)
      return
    }

    revalidatePath(`/projects/${slug}/labels`)
  }

  return (
    <div className="page-container">
      <header className="mb-8">
        <div className="flex items-center gap-1.5 text-sm text-slate-400 mb-3">
          <Link href="/dashboard" className="hover:text-slate-600 transition-colors">Projects</Link>
          <span>/</span>
          <Link href={`/projects/${slug}`} className="hover:text-slate-600 transition-colors">{project.name}</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">Labels</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Labels</h1>
        <p className="text-sm text-slate-500 mt-1">Organize issues with colored labels</p>
      </header>

      {isOwner && (
        <form action={createLabel} className="card p-5 mb-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Create label</h2>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-1.5 flex-1 min-w-[180px]">
              <label htmlFor="name" className="label-text">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="input-field"
                placeholder="e.g. bug, feature, docs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="label-text">Color</label>
              <div className="flex gap-1.5">
                {PRESET_COLORS.map((c) => (
                  <label key={c} className="cursor-pointer">
                    <input type="radio" name="color" value={c} className="sr-only peer" defaultChecked={c === '#3b82f6'} />
                    <div
                      className="w-7 h-7 rounded-md border-2 border-transparent peer-checked:ring-2 peer-checked:ring-offset-1 peer-checked:ring-slate-900 transition-all"
                      style={{ backgroundColor: c }}
                    />
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" className="btn-primary text-sm">
              Create
            </button>
          </div>
        </form>
      )}

      <div className="card overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50/50 border-b border-slate-200">
          <span className="text-sm font-semibold text-slate-700">{labels?.length || 0} labels</span>
        </div>
        {!labels?.length ? (
          <div className="px-5 py-16 text-center">
            <p className="text-sm text-slate-400">No labels yet.{isOwner ? ' Create one above.' : ''}</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {labels.map((label) => (
              <li key={label.id} className="px-5 py-3 flex items-center justify-between">
                <LabelBadge name={label.name} color={label.color} />
                {isOwner && (
                  <form action={deleteLabel}>
                    <input type="hidden" name="labelId" value={label.id} />
                    <button type="submit" className="btn-danger flex items-center gap-1.5">
                      <Trash2 size={13} />
                      Delete
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
