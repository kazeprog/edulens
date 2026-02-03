-- Add FK to profiles to allow joining in API
alter table public.naruhodo_usage_logs 
add constraint naruhodo_usage_logs_user_id_profiles_fkey 
foreign key (user_id) 
references public.profiles(id);
