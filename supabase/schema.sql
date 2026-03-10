-- ══════════════════════════════════════════
-- TEAMSYNC: Complete Database Schema
-- Run this in Supabase SQL Editor
-- ══════════════════════════════════════════

-- Step 0: Clean slate (safe to run multiple times)
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user() cascade;
drop function if exists match_employees(vector, float, int) cascade;
drop function if exists get_my_company() cascade;
drop function if exists get_my_role() cascade;
drop table if exists projects cascade;
drop table if exists employees cascade;
drop table if exists profiles cascade;
drop table if exists companies cascade;

-- Step 1: Extensions
create extension if not exists vector;

-- Step 2: Tables
create table companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subscription_status text default 'active',
  created_at timestamptz default now()
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid references companies(id),
  full_name text,
  role text default 'viewer' check (role in ('admin','editor','viewer')),
  created_at timestamptz default now()
);

create table employees (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) not null,
  name text not null,
  title text not null,
  department text,
  email text,
  availability text default 'available'
    check (availability in ('available','busy','away')),
  skills text not null,
  bio text,
  embedding vector(1536),
  created_at timestamptz default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) not null,
  title text not null,
  description text,
  status text default 'backlog'
    check (status in ('backlog','in_progress','done')),
  due_date date,
  created_at timestamptz default now()
);

-- Step 3: Row Level Security
alter table profiles enable row level security;
alter table employees enable row level security;
alter table projects enable row level security;
alter table companies enable row level security;

-- Helper functions
create or replace function get_my_role()
returns text language sql security definer stable as $$
  select role from profiles where id = auth.uid();
$$;

create or replace function get_my_company()
returns uuid language sql security definer stable as $$
  select company_id from profiles where id = auth.uid();
$$;

-- Policies
create policy "users_own_profile" on profiles
  for all using (id = auth.uid());

create policy "admin_read_all_profiles" on profiles
  for select using (get_my_role() = 'admin');

create policy "users_own_company" on companies
  for select using (id = get_my_company());

create policy "company_read_employees" on employees
  for select using (company_id = get_my_company());
create policy "admin_insert_employee" on employees
  for insert with check (get_my_role() = 'admin');
create policy "admin_editor_update" on employees
  for update using (get_my_role() in ('admin','editor'));
create policy "admin_delete_employee" on employees
  for delete using (get_my_role() = 'admin');

create policy "company_all_projects" on projects
  for all using (company_id = get_my_company());

-- Step 4: AI Vector Search Function
create or replace function match_employees(
  query_embedding vector(1536),
  match_threshold float default 0.5,
  match_count int default 5
)
returns table(
  id uuid, name text, title text,
  skills text, availability text, similarity float
)
language sql stable as $$
  select e.id, e.name, e.title, e.skills, e.availability,
    1 - (e.embedding <=> query_embedding) as similarity
  from employees e
  where e.company_id = get_my_company()
    and 1 - (e.embedding <=> query_embedding) > match_threshold
  order by e.embedding <=> query_embedding
  limit match_count;
$$;

-- Step 5: Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
