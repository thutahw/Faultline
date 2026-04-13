'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'

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
          // Fetch the full comment info including profile
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
      alert('Failed to post comment')
    } else {
      setNewComment('')
    }
    setIsSubmitting(false)
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Comments ({comments.length})</h3>
      
      <div className="space-y-6 mb-8">
        {comments.length === 0 ? (
          <p className="text-gray-500 italic">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                {(comment.profiles?.full_name || comment.profiles?.email || '?')[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm">
                    {comment.profiles?.full_name || comment.profiles?.email}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-black text-sm">
                  {comment.content}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full border border-gray-300 rounded-lg p-3 text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[100px]"
          disabled={isSubmitting}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition disabled:opacity-50"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>
    </div>
  )
}
