-- Update RLS policy to allow admins to view logs
-- Drop the restrictive policy if it exists (or just add new one, policies are ORed)
-- But user might have run the previous SQL which had "Enable select for service_role only".
-- We want to ADD "Enable select for admins".

create policy "Allow select for admins" 
on public.naruhodo_usage_logs 
for select 
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);
