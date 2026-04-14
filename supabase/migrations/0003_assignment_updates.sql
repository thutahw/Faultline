-- Update issues UPDATE policy to allow assignees to update their assigned issues
drop policy "Users can update own issues or project owner" on public.issues;

create policy "Users can update own issues, assigned issues, or project owner" on public.issues
  for update using (
    auth.uid() = creator_id
    or auth.uid() = assignee_id
    or exists (
      select 1 from public.projects
      where id = project_id and owner_id = auth.uid()
    )
  );
