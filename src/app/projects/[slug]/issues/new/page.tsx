import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export default async function NewIssuePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: project } = await supabase
    .from('projects')
    .select('id, name')
    .eq('slug', slug)
    .single()

  if (!project) {
    notFound()
  }

  async function createIssue(formData: FormData) {
    'use server'
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('Not authenticated')
    
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const priority = formData.get('priority') as string
    
    const { error } = await supabase
      .from('issues')
      .insert({
        title,
        description,
        priority,
        project_id: project.id,
        creator_id: user.id,
        status: 'open'
      })
      
    if (error) {
      console.error(error)
      return
    }
    
    revalidatePath(`/projects/${slug}`)
    redirect(`/projects/${slug}`)
  }

  return (
    <div className="flex flex-col p-12 max-w-7xl mx-auto w-full">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-8">New Issue for {project.name}</h1>
        <form action={createIssue} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="font-semibold text-black">Title</label>
            <input 
              id="title" 
              name="title" 
              type="text" 
              required 
              className="border p-2 rounded text-black" 
              placeholder="e.g. Navigation menu broken on mobile"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="font-semibold text-black">Description</label>
            <textarea 
              id="description" 
              name="description" 
              rows={6}
              className="border p-2 rounded text-black" 
              placeholder="Provide more details about the issue..."
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="priority" className="font-semibold text-black">Priority</label>
            <select 
              id="priority" 
              name="priority" 
              className="border p-2 rounded text-black"
              defaultValue="medium"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          
          <div className="flex gap-4">
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 transition"
            >
              Create Issue
            </button>
            <a 
              href={`/projects/${slug}`} 
              className="bg-gray-200 text-black px-6 py-3 rounded font-bold hover:bg-gray-300 transition text-center"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
