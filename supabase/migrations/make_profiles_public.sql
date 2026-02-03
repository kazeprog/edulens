-- Enable public read access to profiles to prevent loading errors
-- This allows any authenticated user (or anon if needed) to read profiles.
-- This ensures the user can always see their own profile ("Mistap") and Admin status.

drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can see own profile" on public.profiles;
drop policy if exists "Enable read access for admins" on public.profiles;

create policy "Public profiles are viewable by everyone"
on public.profiles
for select
using ( true );
