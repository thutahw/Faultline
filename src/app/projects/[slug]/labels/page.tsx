import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import LabelBadge from '@/components/LabelBadge'

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280', '#000000',
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
    <div className="flex flex-col p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto w-full">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/dashboard" className="hover:text-black">Dashboard</Link>
          <span>/</span>
          <Link href={`/projects/${slug}`} className="hover:text-black">{project.name}</Link>
          <span>/</span>
          <span className="font-medium text-black">Labels</span>
        </div>
        <h1 className="text-3xl font-bold">Labels</h1>
      </header>

      {isOwner && (
        <form action={createLabel} className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="font-semibold mb-4">Create Label</h2>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="border p-2 rounded text-black"
                placeholder="e.g. bug, feature"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Color</label>
              <div className="flex gap-1">
                {PRESET_COLORS.map((c) => (
                  <label key={c} className="cursor-pointer">
                    <input type="radio" name="color" value={c} className="sr-only peer" defaultChecked={c === '#3b82f6'} />
                    <div
                      className="w-8 h-8 rounded border-2 border-transparent peer-checked:border-black peer-checked:ring-2 peer-checked:ring-offset-1 peer-checked:ring-black"
                      style={{ backgroundColor: c }}
                    />
                  </label>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition font-bold"
            >
              Create
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">
          Labels ({labels?.length || 0})
        </div>
        {!labels?.length ? (
          <div className="p-12 text-center text-gray-500">
            No labels yet. {isOwner ? 'Create one above!' : ''}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {labels.map((label) => (
              <li key={label.id} className="p-4 flex items-center justify-between">
                <LabelBadge name={label.name} color={label.color} />
                {isOwner && (
                  <form action={deleteLabel}>
                    <input type="hidden" name="labelId" value={label.id} />
                    <button
                      type="submit"
                      className="text-sm text-red-500 hover:text-red-700"
                    >
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
