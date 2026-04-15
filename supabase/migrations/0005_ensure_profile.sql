-- Allow users to insert their own profile row
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Function to ensure a profile exists for the current user (bypasses RLS)
create or replace function ensure_profile()
returns void
language plpgsql
security definer
as $$
declare
  _user_id uuid := auth.uid();
  _email text;
begin
  if _user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Check if profile already exists
  if exists (select 1 from public.profiles where id = _user_id) then
    return;
  end if;

  -- Get email from auth.users
  select email into _email from auth.users where id = _user_id;

  insert into public.profiles (id, email)
  values (_user_id, _email)
  on conflict (id) do nothing;
end;
$$;
