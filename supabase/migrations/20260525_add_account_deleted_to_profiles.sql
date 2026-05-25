alter table public.profiles
add column if not exists account_deleted boolean not null default false;

create index if not exists profiles_account_deleted_idx
on public.profiles(account_deleted);
