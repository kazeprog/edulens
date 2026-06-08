-- Mistap school management
-- Students join a school by entering its school_code. School owners can see
-- only the Mistap history of students who joined their school.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.mistap_schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(trim(name)) BETWEEN 1 AND 80),
  school_code TEXT NOT NULL UNIQUE CHECK (
    school_code ~ '^[A-Z0-9]{4}$'
    AND school_code ~ '[A-Z]'
    AND school_code ~ '[0-9]'
  ),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT NOT NULL DEFAULT 'free',
  subscription_current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.mistap_school_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.mistap_schools(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id)
);

DROP INDEX IF EXISTS public.idx_mistap_schools_owner_id;
CREATE UNIQUE INDEX IF NOT EXISTS idx_mistap_schools_owner_id
  ON public.mistap_schools(owner_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_mistap_schools_stripe_subscription_id
  ON public.mistap_schools(stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_mistap_school_memberships_school_id
  ON public.mistap_school_memberships(school_id);

CREATE INDEX IF NOT EXISTS idx_mistap_school_memberships_student_id
  ON public.mistap_school_memberships(student_id);

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS touch_mistap_schools_updated_at ON public.mistap_schools;
CREATE TRIGGER touch_mistap_schools_updated_at
  BEFORE UPDATE ON public.mistap_schools
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS touch_mistap_school_memberships_updated_at ON public.mistap_school_memberships;
CREATE TRIGGER touch_mistap_school_memberships_updated_at
  BEFORE UPDATE ON public.mistap_school_memberships
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

ALTER TABLE public.mistap_schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mistap_school_memberships ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_mistap_school_owner(check_school_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.mistap_schools s
    WHERE s.id = check_school_id
      AND s.owner_id = auth.uid()
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_mistap_school_member(check_school_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.mistap_school_memberships m
    WHERE m.school_id = check_school_id
      AND m.student_id = auth.uid()
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

DROP POLICY IF EXISTS "Mistap school owners can manage own schools" ON public.mistap_schools;
DROP POLICY IF EXISTS "Mistap students can view joined school" ON public.mistap_schools;

CREATE POLICY "Mistap school owners can manage own schools"
  ON public.mistap_schools
  FOR ALL
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "Mistap students can view own school membership" ON public.mistap_school_memberships;
DROP POLICY IF EXISTS "Mistap school owners can view memberships" ON public.mistap_school_memberships;

CREATE POLICY "Mistap students can view own school membership"
  ON public.mistap_school_memberships
  FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Mistap school owners can view memberships"
  ON public.mistap_school_memberships
  FOR SELECT
  USING (public.is_mistap_school_owner(school_id));

CREATE OR REPLACE FUNCTION public.create_mistap_school(p_school_name TEXT)
RETURNS TABLE (
  school_id UUID,
  school_name TEXT,
  school_code TEXT,
  created_at TIMESTAMPTZ
) AS $$
DECLARE
  normalized_name TEXT;
  seed_code TEXT;
  alphabet CONSTANT TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  digits CONSTANT TEXT := '0123456789';
  alnum CONSTANT TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  generated_code TEXT;
  created_school public.mistap_schools%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'ログインが必要です。';
  END IF;

  normalized_name := trim(coalesce(p_school_name, ''));
  IF char_length(normalized_name) = 0 OR char_length(normalized_name) > 80 THEN
    RAISE EXCEPTION '塾名は1〜80文字で入力してください。';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.mistap_schools s
    WHERE s.owner_id = auth.uid()
  ) THEN
    RAISE EXCEPTION '1つのアカウントで作成できる塾は1つまでです。';
  END IF;

  LOOP
    seed_code :=
      substr(alphabet, floor(random() * length(alphabet) + 1)::INTEGER, 1) ||
      substr(digits, floor(random() * length(digits) + 1)::INTEGER, 1) ||
      substr(alnum, floor(random() * length(alnum) + 1)::INTEGER, 1) ||
      substr(alnum, floor(random() * length(alnum) + 1)::INTEGER, 1);

    SELECT string_agg(ch, '')
    INTO generated_code
    FROM (
      SELECT ch
      FROM regexp_split_to_table(seed_code, '') AS ch
      ORDER BY random()
    ) shuffled;

    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.mistap_schools s WHERE s.school_code = generated_code
    );
  END LOOP;

  INSERT INTO public.mistap_schools (name, school_code, owner_id)
  VALUES (normalized_name, generated_code, auth.uid())
  RETURNING * INTO created_school;

  RETURN QUERY
  SELECT
    created_school.id,
    created_school.name,
    created_school.school_code,
    created_school.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.get_my_mistap_school()
RETURNS TABLE (
  school_id UUID,
  school_name TEXT,
  school_code TEXT,
  joined_at TIMESTAMPTZ
) AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    s.id,
    s.name,
    s.school_code,
    m.joined_at
  FROM public.mistap_school_memberships m
  JOIN public.mistap_schools s ON s.id = m.school_id
  WHERE m.student_id = auth.uid()
  ORDER BY m.joined_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.join_mistap_school_by_code(p_school_code TEXT)
RETURNS TABLE (
  school_id UUID,
  school_name TEXT,
  school_code TEXT,
  joined_at TIMESTAMPTZ
) AS $$
DECLARE
  normalized_code TEXT;
  target_school public.mistap_schools%ROWTYPE;
  membership public.mistap_school_memberships%ROWTYPE;
  already_joined BOOLEAN;
  school_is_paid BOOLEAN;
  member_count INTEGER;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'ログインが必要です。';
  END IF;

  normalized_code := regexp_replace(upper(trim(coalesce(p_school_code, ''))), '[^A-Z0-9]', '', 'g');
  IF char_length(normalized_code) = 0 THEN
    RAISE EXCEPTION '塾IDを入力してください。';
  END IF;

  SELECT *
  INTO target_school
  FROM public.mistap_schools s
  WHERE s.school_code = normalized_code;

  IF NOT FOUND THEN
    RAISE EXCEPTION '塾IDが見つかりません。';
  END IF;

  already_joined := EXISTS (
    SELECT 1
    FROM public.mistap_school_memberships m
    WHERE m.school_id = target_school.id
      AND m.student_id = auth.uid()
  );

  school_is_paid :=
    target_school.subscription_status IN ('active', 'trialing')
    AND (
      target_school.subscription_current_period_end IS NULL
      OR target_school.subscription_current_period_end > now()
    );

  IF NOT already_joined AND NOT school_is_paid THEN
    SELECT count(*)::INTEGER
    INTO member_count
    FROM public.mistap_school_memberships m
    WHERE m.school_id = target_school.id;

    IF member_count >= 5 THEN
      RAISE EXCEPTION 'この塾は無料枠（5名）に達しています。塾管理者に月額プランの決済を依頼してください。';
    END IF;
  END IF;

  INSERT INTO public.mistap_school_memberships (school_id, student_id)
  VALUES (target_school.id, auth.uid())
  ON CONFLICT (student_id)
  DO UPDATE SET
    school_id = EXCLUDED.school_id,
    joined_at = now(),
    updated_at = now()
  RETURNING * INTO membership;

  RETURN QUERY
  SELECT
    target_school.id,
    target_school.name,
    target_school.school_code,
    membership.joined_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.leave_mistap_school()
RETURNS BOOLEAN AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'ログインが必要です。';
  END IF;

  DELETE FROM public.mistap_school_memberships
  WHERE student_id = auth.uid();

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.get_mistap_school_students(p_target_school_id UUID DEFAULT NULL)
RETURNS TABLE (
  school_id UUID,
  school_name TEXT,
  school_code TEXT,
  student_id UUID,
  full_name TEXT,
  grade TEXT,
  joined_at TIMESTAMPTZ,
  test_count BIGINT,
  total_questions BIGINT,
  total_correct BIGINT,
  avg_score NUMERIC,
  latest_test_at TIMESTAMPTZ,
  recent_test_count BIGINT,
  mistake_count BIGINT,
  textbook_count BIGINT
) AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'ログインが必要です。';
  END IF;

  RETURN QUERY
  WITH owned_schools AS (
    SELECT s.id, s.name, s.school_code
    FROM public.mistap_schools s
    WHERE s.owner_id = auth.uid()
      AND (p_target_school_id IS NULL OR s.id = p_target_school_id)
  ),
  result_stats AS (
    SELECT
      r.user_id,
      count(*)::BIGINT AS test_count,
      coalesce(sum(r.total), 0)::BIGINT AS total_questions,
      coalesce(sum(r.correct), 0)::BIGINT AS total_correct,
      max(r.created_at) AS latest_test_at,
      count(*) FILTER (WHERE r.created_at >= now() - interval '7 days')::BIGINT AS recent_test_count,
      coalesce(sum(r.incorrect_count), 0)::BIGINT AS mistake_count,
      count(DISTINCT r.selected_text)::BIGINT AS textbook_count
    FROM public.results r
    JOIN public.mistap_school_memberships m ON m.student_id = r.user_id
    JOIN owned_schools os ON os.id = m.school_id
    GROUP BY r.user_id
  )
  SELECT
    os.id AS school_id,
    os.name AS school_name,
    os.school_code,
    p.id AS student_id,
    p.full_name,
    p.grade,
    m.joined_at,
    coalesce(rs.test_count, 0)::BIGINT,
    coalesce(rs.total_questions, 0)::BIGINT,
    coalesce(rs.total_correct, 0)::BIGINT,
    round(coalesce((rs.total_correct::NUMERIC / nullif(rs.total_questions, 0)) * 100, 0), 1) AS avg_score,
    rs.latest_test_at,
    coalesce(rs.recent_test_count, 0)::BIGINT,
    coalesce(rs.mistake_count, 0)::BIGINT,
    coalesce(rs.textbook_count, 0)::BIGINT
  FROM owned_schools os
  JOIN public.mistap_school_memberships m ON m.school_id = os.id
  JOIN public.profiles p ON p.id = m.student_id
  LEFT JOIN result_stats rs ON rs.user_id = m.student_id
  ORDER BY rs.latest_test_at DESC NULLS LAST, m.joined_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.get_mistap_school_student_results(
  p_target_school_id UUID,
  p_student_id UUID,
  p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
  result_id UUID,
  created_at TIMESTAMPTZ,
  selected_text TEXT,
  unit TEXT,
  start_num INTEGER,
  end_num INTEGER,
  total INTEGER,
  correct INTEGER,
  incorrect_count INTEGER,
  incorrect_words JSONB,
  correct_words JSONB,
  mode TEXT
) AS $$
DECLARE
  can_view BOOLEAN;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'ログインが必要です。';
  END IF;

  SELECT EXISTS (
    SELECT 1
    FROM public.mistap_schools s
    JOIN public.mistap_school_memberships m ON m.school_id = s.id
    WHERE s.id = p_target_school_id
      AND s.owner_id = auth.uid()
      AND m.student_id = p_student_id
  ) INTO can_view;

  IF NOT can_view THEN
    RAISE EXCEPTION 'この生徒の履歴を表示する権限がありません。';
  END IF;

  RETURN QUERY
  SELECT
    r.id,
    r.created_at,
    r.selected_text,
    r.unit,
    r.start_num,
    r.end_num,
    r.total,
    r.correct,
    r.incorrect_count,
    r.incorrect_words,
    r.correct_words,
    r.mode
  FROM public.results r
  WHERE r.user_id = p_student_id
  ORDER BY r.created_at DESC
  LIMIT greatest(1, least(coalesce(p_limit, 50), 200));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.get_mistap_school_all_student_results(
  p_target_school_id UUID DEFAULT NULL,
  p_limit INTEGER DEFAULT 200
)
RETURNS TABLE (
  result_id UUID,
  student_id UUID,
  full_name TEXT,
  grade TEXT,
  created_at TIMESTAMPTZ,
  selected_text TEXT,
  unit TEXT,
  start_num INTEGER,
  end_num INTEGER,
  total INTEGER,
  correct INTEGER,
  incorrect_count INTEGER,
  incorrect_words JSONB,
  correct_words JSONB,
  mode TEXT
) AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'ログインが必要です。';
  END IF;

  RETURN QUERY
  WITH owned_schools AS (
    SELECT s.id
    FROM public.mistap_schools s
    WHERE s.owner_id = auth.uid()
      AND (p_target_school_id IS NULL OR s.id = p_target_school_id)
  )
  SELECT
    r.id,
    p.id,
    p.full_name,
    p.grade,
    r.created_at,
    r.selected_text,
    r.unit,
    r.start_num,
    r.end_num,
    r.total,
    r.correct,
    r.incorrect_count,
    r.incorrect_words,
    r.correct_words,
    r.mode
  FROM owned_schools os
  JOIN public.mistap_school_memberships m ON m.school_id = os.id
  JOIN public.profiles p ON p.id = m.student_id
  JOIN public.results r ON r.user_id = m.student_id
  ORDER BY r.created_at DESC
  LIMIT greatest(1, least(coalesce(p_limit, 200), 500));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.get_admin_mistap_schools()
RETURNS TABLE (
  school_id UUID,
  school_name TEXT,
  school_code TEXT,
  owner_id UUID,
  owner_name TEXT,
  owner_grade TEXT,
  subscription_status TEXT,
  subscription_current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  student_count BIGINT
) AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'ログインが必要です。';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = 'admin'
  ) THEN
    RAISE EXCEPTION '管理者権限が必要です。';
  END IF;

  RETURN QUERY
  SELECT
    s.id,
    s.name,
    s.school_code,
    s.owner_id,
    owner.full_name,
    owner.grade,
    s.subscription_status,
    s.subscription_current_period_end,
    s.created_at,
    count(m.id)::BIGINT
  FROM public.mistap_schools s
  LEFT JOIN public.profiles owner ON owner.id = s.owner_id
  LEFT JOIN public.mistap_school_memberships m ON m.school_id = s.id
  GROUP BY
    s.id,
    s.name,
    s.school_code,
    s.owner_id,
    owner.full_name,
    owner.grade,
    s.subscription_status,
    s.subscription_current_period_end,
    s.created_at
  ORDER BY s.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

REVOKE ALL ON FUNCTION public.create_mistap_school(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_my_mistap_school() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.join_mistap_school_by_code(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.leave_mistap_school() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_mistap_school_students(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_mistap_school_student_results(UUID, UUID, INTEGER) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_mistap_school_all_student_results(UUID, INTEGER) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_admin_mistap_schools() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_mistap_school_owner(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_mistap_school_member(UUID) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.create_mistap_school(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_mistap_school() TO authenticated;
GRANT EXECUTE ON FUNCTION public.join_mistap_school_by_code(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.leave_mistap_school() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_mistap_school_students(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_mistap_school_student_results(UUID, UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_mistap_school_all_student_results(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_mistap_schools() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_mistap_school_owner(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_mistap_school_member(UUID) TO authenticated;
