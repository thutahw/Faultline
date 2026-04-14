-- Label RLS Policies

-- Labels: viewable by authenticated users
create policy "Labels are viewable by authenticated users" on public.labels
  for select using (auth.role() = 'authenticated');

-- Labels: only project owner can create
create policy "Project owners can create labels" on public.labels
  for insert with check (
    exists (
      select 1 from public.projects
      where id = project_id and owner_id = auth.uid()
    )
  );

-- Labels: only project owner can update
create policy "Project owners can update labels" on public.labels
  for update using (
    exists (
      select 1 from public.projects
      where id = project_id and owner_id = auth.uid()
    )
  );

-- Labels: only project owner can delete
create policy "Project owners can delete labels" on public.labels
  for delete using (
    exists (
      select 1 from public.projects
      where id = project_id and owner_id = auth.uid()
    )
  );

-- Issue Labels: viewable by authenticated users
create policy "Issue labels are viewable by authenticated users" on public.issue_labels
  for select using (auth.role() = 'authenticated');

-- Issue Labels: authenticated users can add labels to issues
create policy "Authenticated users can add issue labels" on public.issue_labels
  for insert with check (auth.role() = 'authenticated');

-- Issue Labels: authenticated users can remove labels from issues
create policy "Authenticated users can remove issue labels" on public.issue_labels
  for delete using (auth.role() = 'authenticated');

-- Add labels to realtime publication
alter publication supabase_realtime add table public.labels;
alter publication supabase_realtime add table public.issue_labels;
