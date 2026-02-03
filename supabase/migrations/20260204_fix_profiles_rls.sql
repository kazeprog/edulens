-- Allow Admins to see all profiles (to display names in logs)
create policy "Enable read access for admins"
on public.profiles
for select
to authenticated
using (
  (select role from public.profiles where id = auth.uid()) = 'admin'
);

-- Also ensure FK exists (idempotent check not easy in pure sql without plpgsql, just providing the FK constraint again if missing is risky if name conflicts)
-- The user should apply the previous migration.
