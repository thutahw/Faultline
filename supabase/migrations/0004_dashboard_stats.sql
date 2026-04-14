-- Dashboard stats function
create or replace function get_project_stats(p_project_id uuid)
returns json
language sql
security definer
as $$
  select json_build_object(
    'total', count(*),
    'open', count(*) filter (where status = 'open'),
    'in_progress', count(*) filter (where status = 'in_progress'),
    'resolved', count(*) filter (where status = 'resolved'),
    'closed', count(*) filter (where status = 'closed'),
    'low', count(*) filter (where priority = 'low'),
    'medium', count(*) filter (where priority = 'medium'),
    'high', count(*) filter (where priority = 'high'),
    'urgent', count(*) filter (where priority = 'urgent'),
    'unassigned', count(*) filter (where assignee_id is null),
    'recent_7d', count(*) filter (where created_at > now() - interval '7 days')
  )
  from public.issues
  where project_id = p_project_id;
$$;
