-- Check for multiple users with the same email
select 
  au.id as user_id, 
  au.email, 
  au.created_at as auth_created_at,
  au.last_sign_in_at,
  au.raw_app_meta_data->>'provider' as provider,
  p.full_name as profile_name, 
  p.role as profile_role
from auth.users au
left join public.profiles p on au.id = p.id
where au.email = 'tozukakazetaka@gmail.com';
