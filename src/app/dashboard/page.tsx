import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, FolderOpen } from 'lucide-react'
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
    <div className="page-container">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Projects</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage and track your team&apos;s work</p>
        </div>
        <Link href="/projects/new" className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} />
          New project
        </Link>
      </div>

      {projectsError && (
        <div className="card p-4 border-rose-200 bg-rose-50 text-sm text-rose-700 mb-6">
          Error loading projects: {projectsError.message}
        </div>
      )}

      {projects?.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <FolderOpen size={20} className="text-slate-400" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 mb-1">No projects yet</h3>
          <p className="text-sm text-slate-500 mb-5">Create your first project to start tracking issues.</p>
          <Link href="/projects/new" className="btn-primary inline-flex items-center gap-2 text-sm">
            <Plus size={16} />
            New project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects?.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              stats={statsMap[project.id] || null}
            />
          ))}
        </div>
      )}
    </div>
  )
}
