'use client'

import { useState } from 'react'

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
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-3xl font-bold">{title}</h1>
          <button
            onClick={() => setEditing(true)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium shrink-0"
          >
            Edit
          </button>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 text-black">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Description</h3>
          <div className="whitespace-pre-wrap">
            {description || <span className="italic text-gray-400">No description provided.</span>}
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
    <form action={handleSubmit}>
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-sm font-semibold text-gray-500">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={title}
            required
            className="border p-2 rounded text-black text-2xl font-bold"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-sm font-semibold text-gray-500">Description</label>
          <textarea
            id="description"
            name="description"
            rows={6}
            defaultValue={description || ''}
            className="border p-2 rounded text-black"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="priority" className="text-sm font-semibold text-gray-500">Priority</label>
            <select id="priority" name="priority" defaultValue={priority} className="border p-2 rounded text-black">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="status" className="text-sm font-semibold text-gray-500">Status</label>
            <select id="status" name="status" defaultValue={status} className="border p-2 rounded text-black">
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 transition text-sm"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="bg-gray-200 text-black px-4 py-2 rounded font-bold hover:bg-gray-300 transition text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}
