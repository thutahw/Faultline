import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col p-12 max-w-7xl mx-auto w-full">
      <main className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">My Projects</h2>
          <Link 
            href="/projects/new" 
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            New Project
          </Link>
        </div>
        
        {projectsError && <p className="text-red-500">Error loading projects: {projectsError.message}</p>}
        
        {projects?.length === 0 ? (
          <div className="border border-dashed border-gray-300 rounded-lg p-12 text-center text-gray-500">
            You don't have any projects yet. Create one to get started!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects?.map((project) => (
              <Link 
                key={project.id} 
                href={`/projects/${project.slug}`}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition bg-white text-black"
              >
                <h3 className="text-lg font-bold mb-2">{project.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
