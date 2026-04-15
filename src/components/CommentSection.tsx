'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import { Send } from 'lucide-react'

type Comment = {
  id: string
  content: string
  created_at: string
  user_id: string
  profiles: {
    full_name: string | null
    email: string
  } | null
}

export default function CommentSection({
  issueId,
  initialComments,
  currentUserId
}: {
  issueId: string
  initialComments: Comment[]
  currentUserId: string
}) {
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel(`issue-comments:${issueId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `issue_id=eq.${issueId}`
        },
        async (payload) => {
          const { data: comment } = await supabase
            .from('comments')
            .select('*, profiles:profiles(full_name, email)')
            .eq('id', payload.new.id)
            .single()

          if (comment) {
            setComments((prev) => [...prev, comment as Comment])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, issueId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    const { error } = await supabase
      .from('comments')
      .insert({
        issue_id: issueId,
        content: newComment,
        user_id: currentUserId
      })

    if (error) {
      console.error('Error posting comment:', error)
    } else {
      setNewComment('')
    }
    setIsSubmitting(false)
  }

  function getInitial(comment: Comment) {
    return (comment.profiles?.full_name || comment.profiles?.email || '?')[0].toUpperCase()
  }

  function getColor(name: string) {
    const colors = [
      'bg-indigo-100 text-indigo-700',
      'bg-emerald-100 text-emerald-700',
      'bg-amber-100 text-amber-700',
      'bg-rose-100 text-rose-700',
      'bg-cyan-100 text-cyan-700',
      'bg-violet-100 text-violet-700',
    ]
    let hash = 0
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
    return colors[Math.abs(hash) % colors.length]
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900 mb-5">
        Activity <span className="text-slate-400 font-normal">({comments.length})</span>
      </h3>

      <div className="space-y-4 mb-6">
        {comments.length === 0 ? (
          <p className="text-sm text-slate-400 italic py-4">No comments yet. Start the conversation.</p>
        ) : (
          comments.map((comment) => {
            const displayName = comment.profiles?.full_name || comment.profiles?.email || 'Unknown'
            return (
              <div key={comment.id} className="flex gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${getColor(displayName)}`}>
                  {getInitial(comment)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-900">{displayName}</span>
                    <span className="text-xs text-slate-400">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-lg px-3.5 py-2.5 border border-slate-100">
                    {comment.content}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Leave a comment..."
          className="input-field resize-none min-h-[80px] flex-1"
          disabled={isSubmitting}
        />
        <div className="flex flex-col justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="btn-primary h-10 w-10 !p-0 flex items-center justify-center"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  )
}
