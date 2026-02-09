-- Create mistap_word_stocks table
create table if not exists public.mistap_word_stocks (
    id uuid not null default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    word text not null,
    meaning text,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    
    constraint mistap_word_stocks_pkey primary key (id)
);

-- Enable RLS
alter table public.mistap_word_stocks enable row level security;

-- Create policies
create policy "Users can view their own word stocks"
    on public.mistap_word_stocks for select
    using (auth.uid() = user_id);

create policy "Users can insert their own word stocks"
    on public.mistap_word_stocks for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own word stocks"
    on public.mistap_word_stocks for update
    using (auth.uid() = user_id);

create policy "Users can delete their own word stocks"
    on public.mistap_word_stocks for delete
    using (auth.uid() = user_id);

-- Create index for performance
create index if not exists mistap_word_stocks_user_id_idx on public.mistap_word_stocks(user_id);
create index if not exists mistap_word_stocks_created_at_idx on public.mistap_word_stocks(created_at desc);
