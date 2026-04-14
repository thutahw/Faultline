import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

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
      console.error(error)
      return
    }
    
    revalidatePath('/dashboard')
    redirect('/dashboard')
  }

  return (
    <div className="flex flex-col p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto w-full">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-8">New Project</h1>
        <form action={createProject} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-semibold">Project Name</label>
            <input 
              id="name" 
              name="name" 
              type="text" 
              required 
              className="border p-2 rounded text-black" 
              placeholder="e.g. Website Overhaul"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="slug" className="font-semibold">Project Slug (URL-friendly)</label>
            <input 
              id="slug" 
              name="slug" 
              type="text" 
              required 
              className="border p-2 rounded text-black" 
              placeholder="e.g. website-overhaul"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="font-semibold">Description</label>
            <textarea 
              id="description" 
              name="description" 
              rows={4}
              className="border p-2 rounded text-black" 
              placeholder="What is this project about?"
            />
          </div>
          
          <div className="flex gap-4">
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 transition"
            >
              Create Project
            </button>
            <a 
              href="/dashboard" 
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
