import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import StatusBadge from '@/components/StatusBadge'
import CommentSection from '@/components/CommentSection'

export default async function IssuePage({
  params,
}: {
  params: Promise<{ slug: string; issueId: string }>
}) {
  const { slug, issueId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: issue, error: issueError } = await supabase
    .from('issues')
    .select('*, creator:profiles!issues_creator_id_fkey(full_name, email), project:projects(id, name, owner_id)')
    .eq('id', issueId)
    .single()

  if (issueError || !issue) {
    notFound()
  }

  const { data: comments } = await supabase
    .from('comments')
    .select('*, profiles:profiles(full_name, email)')
    .eq('issue_id', issueId)
    .order('created_at', { ascending: true })

  async function updateStatus(formData: FormData) {
    'use server'
    const status = formData.get('status') as string
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('issues')
      .update({ status })
      .eq('id', issueId)
      
    if (error) {
      console.error(error)
      return
    }
    
    revalidatePath(`/projects/${slug}/issues/${issueId}`)
  }

  return (
    <div className="flex flex-col p-12 max-w-7xl mx-auto w-full">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/dashboard" className="hover:text-black">Dashboard</Link>
          <span>/</span>
          <Link href={`/projects/${slug}`} className="hover:text-black">{issue.project.name}</Link>
          <span>/</span>
          <span className="font-medium text-black">Issue #{issueId.slice(0, 8)}</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">{issue.title}</h1>
        <div className="flex items-center gap-4 text-sm">
          <StatusBadge status={issue.status} />
          <span className="text-gray-500">
            Priority: <span className="capitalize font-medium text-black">{issue.priority}</span>
          </span>
          <span className="text-gray-500">
            Created by {issue.creator?.full_name || issue.creator?.email} on {new Date(issue.created_at).toLocaleDateString()}
          </span>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 text-black">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Description</h3>
            <div className="whitespace-pre-wrap">
              {issue.description || <span className="italic text-gray-400">No description provided.</span>}
            </div>
          </div>
          
          <section>
            <CommentSection 
              issueId={issueId} 
              initialComments={comments as any || []} 
              currentUserId={user.id} 
            />
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Actions</h3>
            
            <form action={updateStatus} className="flex flex-col gap-2">
              <label htmlFor="status" className="text-sm font-medium text-black">Update Status</label>
              <select 
                id="status" 
                name="status" 
                defaultValue={issue.status}
                className="border p-2 rounded text-black mb-2"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <button 
                type="submit" 
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition text-sm font-bold"
              >
                Update Status
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
