-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table to mirror auth.users
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone default now()
);

-- Projects table
create table if not exists public.projects (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Issues table
create table if not exists public.issues (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  title text not null,
  description text,
  status text check (status in ('open', 'in_progress', 'resolved', 'closed')) default 'open',
  priority text check (priority in ('low', 'medium', 'high', 'urgent')) default 'medium',
  creator_id uuid references public.profiles(id) on delete set null,
  assignee_id uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Labels table
create table if not exists public.labels (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  color text default '#6b7280', -- Tailwind gray-500
  project_id uuid references public.projects(id) on delete cascade,
  unique (name, project_id)
);

-- Issue labels junction table
create table if not exists public.issue_labels (
  issue_id uuid references public.issues(id) on delete cascade,
  label_id uuid references public.labels(id) on delete cascade,
  primary key (issue_id, label_id)
);

-- Comments table
create table if not exists public.comments (
  id uuid default uuid_generate_v4() primary key,
  issue_id uuid references public.issues(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Functions and Triggers
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.issues enable row level security;
alter table public.labels enable row level security;
alter table public.issue_labels enable row level security;
alter table public.comments enable row level security;

-- RLS Policies

-- Profiles: Users can view all profiles, but only update their own
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Projects: Users can view projects they own or are part of (initially just owner for simplicity)
create policy "Projects are viewable by authenticated users" on public.projects
  for select using (auth.role() = 'authenticated');

create policy "Users can create projects" on public.projects
  for insert with check (auth.uid() = owner_id);

create policy "Users can update own projects" on public.projects
  for update using (auth.uid() = owner_id);

-- Issues: Viewable by anyone authenticated, editable by creator or project owner
create policy "Issues are viewable by authenticated users" on public.issues
  for select using (auth.role() = 'authenticated');

create policy "Users can create issues" on public.issues
  for insert with check (auth.role() = 'authenticated');

create policy "Users can update own issues or project owner" on public.issues
  for update using (
    auth.uid() = creator_id or 
    exists (
      select 1 from public.projects 
      where id = project_id and owner_id = auth.uid()
    )
  );

-- Comments: Viewable by anyone authenticated, editable by creator
create policy "Comments are viewable by authenticated users" on public.comments
  for select using (auth.role() = 'authenticated');

create policy "Users can create comments" on public.comments
  for insert with check (auth.role() = 'authenticated' and auth.uid() = user_id);

create policy "Users can update own comments" on public.comments
  for update using (auth.uid() = user_id);

-- Realtime setup
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;

alter publication supabase_realtime add table public.issues;
alter publication supabase_realtime add table public.comments;
