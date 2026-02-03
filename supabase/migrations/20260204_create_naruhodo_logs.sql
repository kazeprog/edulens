-- Create table for Naruhodo Lens usage logs
create table if not exists public.naruhodo_usage_logs (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id),
    guest_id text,
    has_image boolean default false,
    is_pro boolean default false,
    user_agent text,
    ip_hash text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.naruhodo_usage_logs enable row level security;

-- Policy: Allow insert for anyone (authenticated and anon)
-- We need to check if the user is authenticated for user_id, 
-- but the insertion itself should be allowed for the service role or the anon role.
-- Since logging is done server-side via Service Role in route.ts usually,
-- but if we use the standard client, we need policies.

create policy "Enable insert for everyone" 
on public.naruhodo_usage_logs 
for insert 
with check (true);

-- Policy: Select only for service_role (Admin should use service role key or dashboard should use RPC)
-- Actually, dashboard usually uses authenticated client with admin role? 
-- Supabase default admin is service_role.
-- Let's allow select for authenticated users who are admins?
-- For now, restrictive select.

create policy "Enable select for service_role only" 
on public.naruhodo_usage_logs 
for select 
using (auth.role() = 'service_role');
