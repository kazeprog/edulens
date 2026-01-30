-- Create mistap_textbook_goals table
create table if not exists public.mistap_textbook_goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  textbook_name text not null,
  daily_goal int not null default 0,
  start_date date,
  goal_start_word int not null default 1,
  goal_end_word int not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, textbook_name)
);

-- Enable RLS
alter table public.mistap_textbook_goals enable row level security;

-- Policies
create policy "Users can view own goals"
  on public.mistap_textbook_goals for select
  using ( auth.uid() = user_id );

create policy "Users can insert own goals"
  on public.mistap_textbook_goals for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own goals"
  on public.mistap_textbook_goals for update
  using ( auth.uid() = user_id );

create policy "Users can delete own goals"
  on public.mistap_textbook_goals for delete
  using ( auth.uid() = user_id );

-- Migrate existing data from profiles
-- only migrate if they have a selected textbook and a goal set
insert into public.mistap_textbook_goals (user_id, textbook_name, daily_goal, start_date, goal_start_word, goal_end_word)
select 
  id as user_id, 
  selected_textbook as textbook_name, 
  daily_goal, 
  start_date::date, 
  coalesce(goal_start_word, 1) as goal_start_word, 
  coalesce(goal_end_word, 0) as goal_end_word
from public.profiles
where 
  selected_textbook is not null 
  and daily_goal > 0
  and selected_textbook != ''
on conflict (user_id, textbook_name) do nothing;
