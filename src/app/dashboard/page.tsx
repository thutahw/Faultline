import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ProjectCard from '@/components/ProjectCard'

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

  // Fetch stats for each project
  const statsMap: Record<string, any> = {}
  if (projects) {
    await Promise.all(
      projects.map(async (project) => {
        const { data } = await supabase.rpc('get_project_stats', { p_project_id: project.id })
        statsMap[project.id] = data
      })
    )
  }

  return (
    <div className="flex flex-col p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto w-full">
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
            You don&apos;t have any projects yet. Create one to get started!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects?.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                stats={statsMap[project.id] || null}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
