-- Function to get dashboard engagement stats
create or replace function get_dashboard_engagement_stats()
returns json as $$
declare
  total_users int;
  users_with_test int;
  users_with_10_tests int;
  users_old_enough int;
  users_retained int;
  retention_rate float8;
begin
  -- 1. Total registered users
  select count(*) into total_users from profiles;

  -- 2. First test completion rate (Users who have at least 1 result)
  select count(distinct user_id) into users_with_test from results;

  -- 3. Heavy users (10+ tests)
  select count(*) into users_with_10_tests from (
    select user_id from results group by user_id having count(*) >= 10
  ) as sub;

  -- 4. 7-day Retention
  -- Logic: Users registered > 7 days ago, who have a result created >= 7 days after their registration.
  -- Denominator: Users registered before (now - 7 days)
  select count(*) into users_old_enough
  from profiles
  where created_at <= (now() - interval '7 days');

  if users_old_enough > 0 then
    -- Numerator: Users in denominator who have activity >= 7 days after creation
    select count(distinct p.id) into users_retained
    from profiles p
    join results r on r.user_id = p.id
    where p.created_at <= (now() - interval '7 days')
    and r.created_at >= (p.created_at + interval '7 days');

    retention_rate := (users_retained::float8 / users_old_enough::float8) * 100;
  else
    retention_rate := 0;
  end if;

  return json_build_object(
    'first_test_rate', case when total_users > 0 then (users_with_test::float8 / total_users::float8) * 100 else 0 end,
    'heavy_user_rate', case when total_users > 0 then (users_with_10_tests::float8 / total_users::float8) * 100 else 0 end,
    'retention_rate_7d', retention_rate
  );
end;
$$ language plpgsql security definer;
