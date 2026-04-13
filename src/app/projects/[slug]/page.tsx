import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import RealtimeIssueList from '@/components/RealtimeIssueList'

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single()

  if (projectError || !project) {
    notFound()
  }

  const { data: issues, error: issuesError } = await supabase
    .from('issues')
    .select('*, creator:profiles!issues_creator_id_fkey(full_name, email)')
    .eq('project_id', project.id)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col p-12 max-w-7xl mx-auto w-full">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/dashboard" className="hover:text-black">Dashboard</Link>
          <span>/</span>
          <span className="font-medium text-black">{project.name}</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-gray-600 mt-1">{project.description}</p>
          </div>
          <Link 
            href={`/projects/${slug}/issues/new`}
            className="bg-black text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800 transition"
          >
            <Plus size={18} />
            New Issue
          </Link>
        </div>
      </header>

      <main>
        <RealtimeIssueList 
          initialIssues={issues as any} 
          projectId={project.id} 
          slug={slug} 
        />
      </main>
    </div>
  )
}
