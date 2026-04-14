import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Tag } from 'lucide-react'
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

  const { data: issues } = await supabase
    .from('issues')
    .select('*, creator:profiles!issues_creator_id_fkey(full_name, email), assignee:profiles!issues_assignee_id_fkey(full_name, email)')
    .eq('project_id', project.id)
    .order('created_at', { ascending: false })

  // Fetch labels for each issue
  const { data: issueLabels } = await supabase
    .from('issue_labels')
    .select('issue_id, label:labels(id, name, color)')
    .in('issue_id', (issues || []).map((i) => i.id))

  // Fetch all project labels for filtering
  const { data: projectLabels } = await supabase
    .from('labels')
    .select('id, name, color')
    .eq('project_id', project.id)
    .order('name')

  // Attach labels to issues
  const issuesWithLabels = (issues || []).map((issue) => ({
    ...issue,
    labels: (issueLabels || [])
      .filter((il) => il.issue_id === issue.id)
      .map((il) => il.label)
      .filter(Boolean),
  }))

  // Compute stats
  const stats = {
    open: issuesWithLabels.filter((i) => i.status === 'open').length,
    in_progress: issuesWithLabels.filter((i) => i.status === 'in_progress').length,
    resolved: issuesWithLabels.filter((i) => i.status === 'resolved').length,
    urgent: issuesWithLabels.filter((i) => i.priority === 'urgent').length,
  }

  return (
    <div className="flex flex-col p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto w-full">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/dashboard" className="hover:text-black">Dashboard</Link>
          <span>/</span>
          <span className="font-medium text-black">{project.name}</span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-gray-600 mt-1">{project.description}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/projects/${slug}/labels`}
              className="border border-gray-300 text-black px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-50 transition"
            >
              <Tag size={18} />
              Labels
            </Link>
            <Link
              href={`/projects/${slug}/issues/new`}
              className="bg-black text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800 transition"
            >
              <Plus size={18} />
              New Issue
            </Link>
          </div>
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{stats.open}</div>
          <div className="text-sm text-gray-500">Open</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.in_progress}</div>
          <div className="text-sm text-gray-500">In Progress</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">{stats.resolved}</div>
          <div className="text-sm text-gray-500">Resolved</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
          <div className="text-sm text-gray-500">Urgent</div>
        </div>
      </div>

      <main>
        <RealtimeIssueList
          initialIssues={issuesWithLabels as any}
          projectId={project.id}
          slug={slug}
          projectLabels={(projectLabels || []) as any}
        />
      </main>
    </div>
  )
}
