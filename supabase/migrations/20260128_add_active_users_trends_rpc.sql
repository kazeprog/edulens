-- Function to get DAU, WAU, MAU trends for the last N days
CREATE OR REPLACE FUNCTION get_active_user_trends(p_days integer)
RETURNS TABLE (
    trend_date date,
    dau integer,
    wau integer,
    mau integer
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH date_series AS (
        -- Generate dates for the requested range, ending today
        SELECT (now()::date - i)::date as d
        FROM generate_series(0, p_days - 1) i
    )
    SELECT
        ds.d as trend_date,
        -- DAU: Unique users on that specific day
        (SELECT count(DISTINCT user_id)::integer 
         FROM results 
         WHERE created_at >= ds.d::timestamp 
           AND created_at < (ds.d + 1)::timestamp) as dau,
        -- WAU: Unique users in the 7 days leading up to and including that day
        (SELECT count(DISTINCT user_id)::integer 
         FROM results 
         WHERE created_at >= (ds.d - 6)::timestamp 
           AND created_at < (ds.d + 1)::timestamp) as wau,
        -- MAU: Unique users in the 30 days leading up to and including that day
        (SELECT count(DISTINCT user_id)::integer 
         FROM results 
         WHERE created_at >= (ds.d - 29)::timestamp 
           AND created_at < (ds.d + 1)::timestamp) as mau
    FROM date_series ds
    ORDER BY ds.d ASC;
END;
$$;
