-- 1. まずRLSをオンにする
alter table public.profiles enable row level security;

-- 2. 一般的なポリシーを設定
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- 3. 自動作成を行う関数を作成
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role, grade)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    coalesce(new.raw_user_meta_data ->> 'role', 'student'),
    new.raw_user_meta_data ->> 'grade'
  );
  return new;
end;
$$;

-- 4. ユーザー登録時に上記関数を動かすトリガーを設定
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
