'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateIssue(issueId: string, slug: string, formData: FormData) {
  const supabase = await createClient()
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const priority = formData.get('priority') as string
  const status = formData.get('status') as string

  const { error } = await supabase
    .from('issues')
    .update({ title, description, priority, status })
    .eq('id', issueId)

  if (error) {
    console.error(error)
    return
  }

  revalidatePath(`/projects/${slug}/issues/${issueId}`)
}

export async function updateAssignee(issueId: string, slug: string, formData: FormData) {
  const supabase = await createClient()
  const assigneeId = formData.get('assignee_id') as string

  const { error } = await supabase
    .from('issues')
    .update({ assignee_id: assigneeId || null })
    .eq('id', issueId)

  if (error) {
    console.error(error)
    return
  }

  revalidatePath(`/projects/${slug}/issues/${issueId}`)
}

export async function updateLabels(issueId: string, slug: string, formData: FormData) {
  const supabase = await createClient()
  const selectedLabels = formData.getAll('labels') as string[]

  // Remove all existing labels
  await supabase.from('issue_labels').delete().eq('issue_id', issueId)

  // Insert new labels
  if (selectedLabels.length > 0) {
    const { error } = await supabase
      .from('issue_labels')
      .insert(selectedLabels.map((labelId) => ({
        issue_id: issueId,
        label_id: labelId,
      })))

    if (error) {
      console.error(error)
      return
    }
  }

  revalidatePath(`/projects/${slug}/issues/${issueId}`)
}
