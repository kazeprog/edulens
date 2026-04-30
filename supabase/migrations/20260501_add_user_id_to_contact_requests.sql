alter table public.contact_requests
add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists contact_requests_user_id_idx
on public.contact_requests(user_id);

drop policy if exists "Anyone can create contact requests" on public.contact_requests;

create policy "Anyone can create contact requests"
on public.contact_requests
for insert
to anon, authenticated
with check (user_id is null or user_id = auth.uid());
