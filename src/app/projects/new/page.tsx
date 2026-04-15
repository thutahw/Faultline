import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'

export default async function NewProjectPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  async function createProject(formData: FormData) {
    'use server'

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { error: rpcError } = await supabase.rpc('ensure_profile')
    if (rpcError) {
      await supabase
        .from('profiles')
        .upsert({ id: user.id, email: user.email! }, { onConflict: 'id' })
    }

    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const description = formData.get('description') as string

    const { error } = await supabase
      .from('projects')
      .insert({
        name,
        slug,
        description,
        owner_id: user.id
      })

    if (error) {
      console.error('Project creation failed:', error)
      redirect(`/projects/new?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
  }

  return (
    <div className="page-container">
      <div className="max-w-lg">
        <div className="mb-8">
          <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">&larr; Back to projects</Link>
          <h1 className="text-xl font-bold text-slate-900 mt-3">Create a new project</h1>
          <p className="text-sm text-slate-500 mt-1">Projects organize your issues and team collaboration.</p>
        </div>

        <form action={createProject} className="card p-6 space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="name" className="label-text">Project name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="input-field"
              placeholder="e.g. Website Overhaul"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="slug" className="label-text">URL slug</label>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              className="input-field"
              placeholder="e.g. website-overhaul"
            />
            <p className="text-xs text-slate-400">Lowercase letters, numbers, and hyphens only</p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="description" className="label-text">Description</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="input-field resize-none"
              placeholder="What is this project about?"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary text-sm">
              Create project
            </button>
            <Link href="/dashboard" className="btn-secondary text-sm">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
