'use client'

import { useState } from 'react'
import { Pencil, X } from 'lucide-react'

type EditableIssueProps = {
  issueId: string
  slug: string
  title: string
  description: string | null
  priority: string
  status: string
  updateIssue: (issueId: string, slug: string, formData: FormData) => Promise<void>
}

export default function EditableIssue({
  issueId,
  slug,
  title,
  description,
  priority,
  status,
  updateIssue,
}: EditableIssueProps) {
  const [editing, setEditing] = useState(false)

  if (!editing) {
    return (
      <div>
        <div className="flex items-start justify-between gap-4 mb-5">
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">{title}</h1>
          <button
            onClick={() => setEditing(true)}
            className="btn-ghost flex items-center gap-1.5 shrink-0"
          >
            <Pencil size={14} />
            Edit
          </button>
        </div>
        <div className="card p-5 mb-8">
          <h3 className="section-title mb-3">Description</h3>
          <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
            {description || <span className="italic text-slate-400">No description provided.</span>}
          </div>
        </div>
      </div>
    )
  }

  async function handleSubmit(formData: FormData) {
    await updateIssue(issueId, slug, formData)
    setEditing(false)
  }

  return (
    <form action={handleSubmit} className="mb-8">
      <div className="card p-5 space-y-4 border-indigo-200 ring-1 ring-indigo-100">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-indigo-600">Editing issue</span>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="title" className="label-text">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={title}
            required
            className="input-field font-semibold text-lg"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="description" className="label-text">Description</label>
          <textarea
            id="description"
            name="description"
            rows={5}
            defaultValue={description || ''}
            className="input-field resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="priority" className="label-text">Priority</label>
            <select id="priority" name="priority" defaultValue={priority} className="select-field">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="status" className="label-text">Status</label>
            <select id="status" name="status" defaultValue={status} className="select-field">
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button type="submit" className="btn-primary text-sm">
            Save changes
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="btn-secondary text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}
