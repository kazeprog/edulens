-- Backfill user_name from profiles for existing logs
update public.naruhodo_usage_logs
set user_name = p.full_name
from public.profiles p
where naruhodo_usage_logs.user_id = p.id
and naruhodo_usage_logs.user_name is null;
