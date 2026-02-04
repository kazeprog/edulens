-- Function to count unique users who took tests in the last N days
CREATE OR REPLACE FUNCTION get_active_test_user_count(p_days integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_count integer;
BEGIN
    SELECT count(DISTINCT user_id)
    INTO v_count
    FROM results
    WHERE created_at >= now() - (p_days || ' days')::interval;
    
    RETURN v_count;
END;
$$;
