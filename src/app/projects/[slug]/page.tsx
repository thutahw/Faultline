import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Tag, TrendingUp } from 'lucide-react'
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

  const { data: issueLabels } = await supabase
    .from('issue_labels')
    .select('issue_id, label:labels(id, name, color)')
    .in('issue_id', (issues || []).map((i) => i.id))

  const { data: projectLabels } = await supabase
    .from('labels')
    .select('id, name, color')
    .eq('project_id', project.id)
    .order('name')

  const issuesWithLabels = (issues || []).map((issue) => ({
    ...issue,
    labels: (issueLabels || [])
      .filter((il) => il.issue_id === issue.id)
      .map((il) => il.label)
      .filter(Boolean),
  }))

  const stats = {
    total: issuesWithLabels.length,
    open: issuesWithLabels.filter((i) => i.status === 'open').length,
    in_progress: issuesWithLabels.filter((i) => i.status === 'in_progress').length,
    resolved: issuesWithLabels.filter((i) => i.status === 'resolved').length,
    urgent: issuesWithLabels.filter((i) => i.priority === 'urgent').length,
  }

  return (
    <div className="page-container">
      <header className="mb-8">
        <div className="flex items-center gap-1.5 text-sm text-slate-400 mb-3">
          <Link href="/dashboard" className="hover:text-slate-600 transition-colors">Projects</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">{project.name}</span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
            {project.description && (
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">{project.description}</p>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href={`/projects/${slug}/labels`} className="btn-secondary flex items-center gap-1.5 text-sm">
              <Tag size={14} />
              Labels
            </Link>
            <Link href={`/projects/${slug}/issues/new`} className="btn-primary flex items-center gap-1.5 text-sm">
              <Plus size={14} />
              New issue
            </Link>
          </div>
        </div>
      </header>

      {/* Stats */}
      {stats.total > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="card px-4 py-3 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <div>
              <div className="text-lg font-bold text-slate-900">{stats.open}</div>
              <div className="text-xs text-slate-500">Open</div>
            </div>
          </div>
          <div className="card px-4 py-3 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <div>
              <div className="text-lg font-bold text-slate-900">{stats.in_progress}</div>
              <div className="text-xs text-slate-500">In Progress</div>
            </div>
          </div>
          <div className="card px-4 py-3 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-violet-500" />
            <div>
              <div className="text-lg font-bold text-slate-900">{stats.resolved}</div>
              <div className="text-xs text-slate-500">Resolved</div>
            </div>
          </div>
          <div className="card px-4 py-3 flex items-center gap-3">
            <TrendingUp size={14} className={stats.urgent > 0 ? 'text-rose-500' : 'text-slate-300'} />
            <div>
              <div className="text-lg font-bold text-slate-900">{stats.urgent}</div>
              <div className="text-xs text-slate-500">Urgent</div>
            </div>
          </div>
        </div>
      )}

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
