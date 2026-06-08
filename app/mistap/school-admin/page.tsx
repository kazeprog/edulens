'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  Building2,
  Check,
  Clipboard,
  CreditCard,
  History,
  Loader2,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Settings,
  Users,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getSupabase } from '@/lib/supabase';

type School = {
  id: string;
  name: string;
  school_code: string;
  stripe_customer_id: string | null;
  subscription_status: string | null;
  subscription_current_period_end: string | null;
  created_at: string;
};

type SchoolStudent = {
  school_id: string;
  school_name: string;
  school_code: string;
  student_id: string;
  full_name: string | null;
  grade: string | null;
  joined_at: string;
  test_count: number;
  total_questions: number;
  total_correct: number;
  avg_score: number | string | null;
  latest_test_at: string | null;
  recent_test_count: number;
  mistake_count: number;
  textbook_count: number;
};

type IncorrectWord = {
  word_number: number;
  word: string;
  meaning: string;
};

type StudentResult = {
  result_id: string;
  created_at: string;
  selected_text: string | null;
  unit: string | null;
  start_num: number | null;
  end_num: number | null;
  total: number;
  correct: number;
  incorrect_count: number;
  incorrect_words: IncorrectWord[] | null;
  correct_words: IncorrectWord[] | null;
  mode: 'word-meaning' | 'meaning-word' | string | null;
};

type AllStudentResult = StudentResult & {
  student_id: string;
  full_name: string | null;
  grade: string | null;
};

function formatDate(value: string | null) {
  if (!value) return '-';
  return new Date(value).toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDateWithDaysAgo(value: string | null) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  const daysAgo = Math.max(
    0,
    Math.floor((today.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24)),
  );

  return `${formatDate(value)}（${daysAgo}日前）`;
}

function formatScore(correct: number, total: number) {
  if (!total) return 0;
  return Math.round((correct / total) * 100);
}

function getDisplayName(student: SchoolStudent) {
  return student.full_name?.trim() || `生徒 ${student.student_id.slice(0, 8)}`;
}

function getResultRange(result: Pick<StudentResult, 'unit' | 'start_num' | 'end_num'>) {
  if (result.unit) return result.unit;
  if (result.start_num != null && result.end_num != null) return `No.${result.start_num}-${result.end_num}`;
  return '全範囲';
}

function getPrintableWords(result: Pick<StudentResult, 'correct_words' | 'incorrect_words'>) {
  const combinedWords = [
    ...(Array.isArray(result.correct_words) ? result.correct_words : []),
    ...(Array.isArray(result.incorrect_words) ? result.incorrect_words : []),
  ];
  const seen = new Set<string>();

  return combinedWords
    .filter((word) => word.word?.trim() && word.meaning?.trim())
    .filter((word) => {
      const key = `${word.word_number}-${word.word}-${word.meaning}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => Number(a.word_number || 0) - Number(b.word_number || 0));
}

function isPaidSchool(school: School | null) {
  if (!school) return false;
  const activeStatus = school.subscription_status === 'active' || school.subscription_status === 'trialing';
  if (!activeStatus) return false;
  if (!school.subscription_current_period_end) return true;
  return new Date(school.subscription_current_period_end).getTime() > Date.now();
}

export default function MistapSchoolAdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [students, setStudents] = useState<SchoolStudent[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [studentResults, setStudentResults] = useState<StudentResult[]>([]);
  const [allStudentResults, setAllStudentResults] = useState<AllStudentResult[]>([]);
  const [expandedResultId, setExpandedResultId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newSchoolName, setNewSchoolName] = useState('');
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [loadingAllResults, setLoadingAllResults] = useState(false);
  const [creatingSchool, setCreatingSchool] = useState(false);
  const [billingAction, setBillingAction] = useState<'monthly' | 'yearly' | 'portal' | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  const selectedSchool = schools.find((school) => school.id === selectedSchoolId) ?? null;
  const selectedStudent = students.find((student) => student.student_id === selectedStudentId) ?? null;
  const schoolIsPaid = isPaidSchool(selectedSchool);
  const freeSeatLimit = 5;

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return students;

    return students.filter((student) => {
      const fields = [
        student.full_name ?? '',
        student.grade ?? '',
        student.student_id,
        student.school_code,
      ];
      return fields.some((field) => field.toLowerCase().includes(query));
    });
  }, [searchQuery, students]);

  const summary = useMemo(() => {
    const totalStudents = students.length;
    const totalTests = students.reduce((sum, student) => sum + Number(student.test_count || 0), 0);
    const totalQuestions = students.reduce((sum, student) => sum + Number(student.total_questions || 0), 0);
    const totalCorrect = students.reduce((sum, student) => sum + Number(student.total_correct || 0), 0);
    const avgScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const activeThisWeek = students.filter((student) => Number(student.recent_test_count || 0) > 0).length;

    return { totalStudents, totalTests, avgScore, activeThisWeek };
  }, [students]);

  const inactiveThisWeekStudents = useMemo(() => (
    students
      .filter((student) => Number(student.recent_test_count || 0) === 0)
      .sort((a, b) => {
        if (!a.latest_test_at && !b.latest_test_at) return 0;
        if (!a.latest_test_at) return -1;
        if (!b.latest_test_at) return 1;
        return new Date(a.latest_test_at).getTime() - new Date(b.latest_test_at).getTime();
      })
  ), [students]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?redirect=/mistap/school-admin');
    }
  }, [authLoading, router, user]);

  async function loadSchools() {
    const supabase = getSupabase();
    if (!supabase || !user) return;

    setLoadingSchools(true);
    setError(null);

    try {
      const { data, error: schoolsError } = await supabase
        .from('mistap_schools')
        .select('id, name, school_code, stripe_customer_id, subscription_status, subscription_current_period_end, created_at')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: true });

      if (schoolsError) {
        setError(schoolsError.message || '塾情報の取得に失敗しました。');
        return;
      }

      const loadedSchools = (data || []) as School[];
      setSchools(loadedSchools);

      if (loadedSchools.length === 0) {
        setSelectedSchoolId('');
        setStudents([]);
        setSelectedStudentId(null);
      } else if (!selectedSchoolId || !loadedSchools.some((school) => school.id === selectedSchoolId)) {
        setSelectedSchoolId(loadedSchools[0].id);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : '塾情報の取得に失敗しました。');
    } finally {
      setLoadingSchools(false);
    }
  }

  async function loadStudents(schoolId: string) {
    const supabase = getSupabase();
    if (!supabase || !schoolId) return;

    setLoadingStudents(true);
    setError(null);

    try {
      const { data, error: studentsError } = await supabase.rpc('get_mistap_school_students', {
        p_target_school_id: schoolId,
      });

      if (studentsError) {
        setError(studentsError.message || '生徒一覧の取得に失敗しました。');
        return;
      }

      const loadedStudents = (data || []) as SchoolStudent[];
      setStudents(loadedStudents);

      if (!loadedStudents.some((student) => student.student_id === selectedStudentId)) {
        setSelectedStudentId(loadedStudents[0]?.student_id ?? null);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : '生徒一覧の取得に失敗しました。');
    } finally {
      setLoadingStudents(false);
    }
  }

  async function loadStudentResults(schoolId: string, studentId: string) {
    const supabase = getSupabase();
    if (!supabase) return;

    setLoadingResults(true);
    setError(null);

    try {
      const { data, error: resultsError } = await supabase.rpc('get_mistap_school_student_results', {
        p_target_school_id: schoolId,
        p_student_id: studentId,
        p_limit: 50,
      });

      if (resultsError) {
        setError(resultsError.message || '学習履歴の取得に失敗しました。');
        return;
      }

      setStudentResults((data || []) as StudentResult[]);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : '学習履歴の取得に失敗しました。');
    } finally {
      setLoadingResults(false);
    }
  }

  async function loadAllStudentResults(schoolId: string) {
    const supabase = getSupabase();
    if (!supabase || !schoolId) return;

    setLoadingAllResults(true);
    setError(null);

    try {
      const { data, error: resultsError } = await supabase.rpc('get_mistap_school_all_student_results', {
        p_target_school_id: schoolId,
        p_limit: 200,
      });

      if (resultsError) {
        setError(resultsError.message || '全生徒の学習履歴の取得に失敗しました。');
        return;
      }

      setAllStudentResults((data || []) as AllStudentResult[]);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : '全生徒の学習履歴の取得に失敗しました。');
    } finally {
      setLoadingAllResults(false);
    }
  }

  useEffect(() => {
    if (!authLoading && user) {
      loadSchools();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user?.id]);

  useEffect(() => {
    if (selectedSchoolId) {
      loadStudents(selectedSchoolId);
      loadAllStudentResults(selectedSchoolId);
    } else {
      setAllStudentResults([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSchoolId]);

  useEffect(() => {
    if (selectedSchoolId && selectedStudentId) {
      loadStudentResults(selectedSchoolId, selectedStudentId);
    } else {
      setStudentResults([]);
    }
  }, [selectedSchoolId, selectedStudentId]);

  async function handleCreateSchool() {
    const supabase = getSupabase();
    if (!supabase || creatingSchool) return;

    const schoolName = newSchoolName.trim();
    setCreateError(null);

    if (schools.length > 0) {
      setCreateError('1つのアカウントで作成できる塾は1つまでです。');
      return;
    }

    if (!schoolName) {
      setCreateError('塾名を入力してください。');
      return;
    }

    setCreatingSchool(true);

    try {
      const { data, error: createSchoolError } = await supabase
        .rpc('create_mistap_school', { p_school_name: schoolName })
        .maybeSingle();

      if (createSchoolError) {
        setCreateError(createSchoolError.message || '塾の作成に失敗しました。');
        return;
      }

      if (data) {
        const created = data as {
          school_id: string;
          school_name: string;
          school_code: string;
          created_at: string;
        };

        const school: School = {
          id: created.school_id,
          name: created.school_name,
          school_code: created.school_code,
          stripe_customer_id: null,
          subscription_status: 'free',
          subscription_current_period_end: null,
          created_at: created.created_at,
        };

        setSchools((current) => [...current, school]);
        setSelectedSchoolId(school.id);
        setNewSchoolName('');
      }
    } catch (createSchoolError) {
      setCreateError(createSchoolError instanceof Error ? createSchoolError.message : '塾の作成に失敗しました。');
    } finally {
      setCreatingSchool(false);
    }
  }

  async function getAccessToken() {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabaseの初期化に失敗しました。');
    }

    const session = (await supabase.auth.getSession()).data.session;
    const accessToken = session?.access_token;

    if (!accessToken) {
      throw new Error('ログインセッションが見つかりません。もう一度ログインしてください。');
    }

    return accessToken;
  }

  async function handleSchoolCheckout(billingInterval: 'monthly' | 'yearly' = 'monthly') {
    if (!selectedSchool || billingAction) return;

    setBillingAction(billingInterval);
    setError(null);

    try {
      const accessToken = await getAccessToken();
      const response = await fetch('/api/mistap/school-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          schoolId: selectedSchool.id,
          billingInterval,
          returnUrl: window.location.href,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '決済ページの作成に失敗しました。');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('決済ページのURLが取得できませんでした。');
      }
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : '決済ページの作成に失敗しました。');
    } finally {
      setBillingAction(null);
    }
  }

  async function handleSchoolPortal() {
    if (!selectedSchool || billingAction) return;

    setBillingAction('portal');
    setError(null);

    try {
      const accessToken = await getAccessToken();
      const response = await fetch('/api/mistap/school-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          schoolId: selectedSchool.id,
          returnPath: '/mistap/school-admin',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '管理ページの作成に失敗しました。');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('管理ページのURLが取得できませんでした。');
      }
    } catch (portalError) {
      setError(portalError instanceof Error ? portalError.message : '管理ページへの遷移に失敗しました。');
    } finally {
      setBillingAction(null);
    }
  }

  function openPrintableTest(result: AllStudentResult, studentName: string) {
    const printableWords = getPrintableWords(result);
    const params = new URLSearchParams();

    if (result.selected_text && result.start_num != null && result.end_num != null) {
      params.set('text', result.selected_text);
      params.set('start', String(result.start_num));
      params.set('end', String(result.end_num));
      params.set('count', '20');
      params.set('mode', result.mode || 'word-meaning');
      params.set('student', studentName);
      params.set('date', result.created_at);
    } else if (printableWords.length > 0) {
      const payload = {
        selectedText: result.selected_text || '小テスト',
        rangeLabel: getResultRange(result),
        startNum: result.start_num,
        endNum: result.end_num,
        mode: result.mode || 'word-meaning',
        studentName,
        grade: result.grade,
        createdAt: result.created_at,
        words: printableWords,
      };
      const storageKey = `mistap-school-print-test-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      window.localStorage.setItem(storageKey, JSON.stringify(payload));
      params.set('dataKey', storageKey);
    } else {
      setError('この履歴から印刷用テストを作成できませんでした。');
      return;
    }

    window.open(`/mistap/school-admin/print-test?${params.toString()}`, '_blank', 'noopener,noreferrer');
  }

  async function copySchoolCode() {
    if (!selectedSchool?.school_code) return;

    try {
      await navigator.clipboard.writeText(selectedSchool.school_code);
      setCopiedCode(true);
      window.setTimeout(() => setCopiedCode(false), 1800);
    } catch {
      setError('塾IDのコピーに失敗しました。');
    }
  }

  if (authLoading || loadingSchools || (!authLoading && !user)) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            読み込み中...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold text-red-700">Mistap for School</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">塾管理画面</h1>
            <p className="mt-2 text-sm text-slate-500">
              塾IDを入力した生徒のMistap学習履歴を確認できます。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => selectedSchoolId ? loadStudents(selectedSchoolId) : loadSchools()}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
            >
              <RefreshCw className="h-4 w-4" />
              更新
            </button>
            <Link
              href="/mistap/profile"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
            >
              生徒側の設定を見る
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <section className="mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-700">
                  <Building2 className="h-5 w-5" />
                </div>
                  <div>
                    <h2 className="font-bold">塾情報</h2>
                    <p className="text-sm text-slate-500">4桁の英数字混合IDを生徒に共有してください。</p>
                  </div>
                </div>

              {schools.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs font-bold text-slate-500">塾名</div>
                    <div className="mt-1 truncate text-lg font-bold text-slate-950">
                      {selectedSchool?.name ?? '塾名未設定'}
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs font-bold text-slate-500">塾ID</div>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <span className="font-mono text-2xl font-black tracking-[0.2em] text-slate-950">
                        {selectedSchool?.school_code ?? '----'}
                      </span>
                      <button
                        onClick={copySchoolCode}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100"
                        aria-label="塾IDをコピー"
                        title="塾IDをコピー"
                      >
                        {copiedCode ? <Check className="h-4 w-4 text-emerald-600" /> : <Clipboard className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  まだ塾が作成されていません。
                </div>
              )}

              {selectedSchool && (
                <div className={`mt-4 rounded-lg border p-4 ${schoolIsPaid ? 'border-emerald-200 bg-emerald-50' : students.length >= freeSeatLimit ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        {schoolIsPaid ? '有料プラン有効' : `無料枠 ${Math.min(students.length, freeSeatLimit)} / ${freeSeatLimit}名`}
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        {schoolIsPaid
                          ? '5名を超える生徒登録が可能です。'
                          : students.length >= freeSeatLimit
                            ? '6人目以降の登録には塾向け有料プランが必要です。'
                            : `あと${freeSeatLimit - students.length}名まで無料で登録できます。`}
                      </p>
                    </div>
                    {schoolIsPaid && selectedSchool.stripe_customer_id ? (
                      <button
                        onClick={handleSchoolPortal}
                        disabled={!!billingAction}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-emerald-300 bg-white px-4 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100 disabled:cursor-wait disabled:opacity-60"
                      >
                        {billingAction === 'portal' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Settings className="h-4 w-4" />}
                        契約を管理
                      </button>
                    ) : (
                      <div className="grid gap-2 sm:grid-cols-2 md:min-w-[280px]">
                        <button
                          onClick={() => handleSchoolCheckout('monthly')}
                          disabled={!!billingAction}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60"
                        >
                          {billingAction === 'monthly' ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                          月払いで開始
                        </button>
                        <button
                          onClick={() => handleSchoolCheckout('yearly')}
                          disabled={!!billingAction}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold text-slate-800 transition hover:bg-slate-100 disabled:cursor-wait disabled:opacity-60"
                        >
                          {billingAction === 'yearly' ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                          年払いで開始
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {schools.length === 0 ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-700">新しい塾を作成</span>
                  <input
                    value={newSchoolName}
                    onChange={(event) => setNewSchoolName(event.target.value)}
                    className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-base outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    placeholder="塾名"
                    maxLength={80}
                  />
                </label>
                {createError && <div className="mt-2 text-sm font-medium text-red-600">{createError}</div>}
                <button
                  onClick={handleCreateSchool}
                  disabled={creatingSchool}
                  className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60"
                >
                  {creatingSchool ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {creatingSchool ? '作成中...' : '塾を作成'}
                </button>
              </div>
            ) : (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-bold text-slate-900">塾は作成済みです</div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  1つのアカウントで作成できる塾は1つまでです。塾IDを生徒に共有して連携してください。
                </p>
                <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-600">
                  <div className="font-bold text-slate-800">生徒側の連携方法</div>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 leading-relaxed">
                    <li>生徒がMistapにログインします。</li>
                    <li>
                      <Link href="/mistap/profile" prefetch={false} className="font-bold text-red-600 hover:underline">
                        プロフィール画面
                      </Link>
                      の「塾ID連携」を開きます。
                    </li>
                    <li>共有された塾ID{selectedSchool?.school_code ? `（${selectedSchool.school_code}）` : ''}を入力して「連携」を押します。</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold text-slate-500">連携生徒数</div>
            <div className="mt-2 text-3xl font-black text-slate-950">{summary.totalStudents}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold text-slate-500">テスト回数</div>
            <div className="mt-2 text-3xl font-black text-slate-950">{summary.totalTests}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold text-slate-500">平均正答率</div>
            <div className="mt-2 text-3xl font-black text-slate-950">{summary.avgScore}%</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold text-slate-500">7日以内に実施</div>
            <div className="mt-2 text-3xl font-black text-slate-950">{summary.activeThisWeek}</div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-bold">生徒一覧</h2>
                  <p className="text-sm text-slate-500">{selectedSchool?.name ?? '塾未選択'}</p>
                </div>
              </div>
              <label className="relative w-full lg:w-80">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  placeholder="名前・学年で検索"
                />
              </label>
            </div>

            {loadingStudents ? (
              <div className="flex items-center justify-center py-16 text-sm font-medium text-slate-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                生徒一覧を読み込み中...
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="px-4 py-16 text-center">
                <p className="font-bold text-slate-700">生徒がまだ表示されていません</p>
                <p className="mt-2 text-sm text-slate-500">
                  生徒がプロフィール画面で塾IDを入力すると、ここに追加されます。
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-500">生徒</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-500">最終実施</th>
                      <th className="px-4 py-3 text-right text-xs font-bold uppercase text-slate-500">回数</th>
                      <th className="px-4 py-3 text-right text-xs font-bold uppercase text-slate-500">正答率</th>
                      <th className="px-4 py-3 text-right text-xs font-bold uppercase text-slate-500">誤答</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((student) => {
                      const isSelected = selectedStudentId === student.student_id;
                      const avgScore = Math.round(Number(student.avg_score || 0));

                      return (
                        <tr
                          key={student.student_id}
                          onClick={() => setSelectedStudentId(student.student_id)}
                          className={`cursor-pointer transition ${isSelected ? 'bg-red-50' : 'hover:bg-slate-50'}`}
                        >
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-900">{getDisplayName(student)}</div>
                            <div className="mt-1 text-xs text-slate-500">
                              {student.grade || '学年未設定'} / 連携日 {formatDate(student.joined_at).split(' ')[0]}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">{formatDateWithDaysAgo(student.latest_test_at)}</td>
                          <td className="px-4 py-3 text-right text-sm font-bold text-slate-800">{student.test_count}</td>
                          <td className="px-4 py-3 text-right">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ${avgScore >= 80
                              ? 'bg-emerald-100 text-emerald-700'
                              : avgScore >= 60
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-red-100 text-red-700'
                              }`}>
                              {avgScore}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-bold text-slate-800">{student.mistake_count}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <aside className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-4">
              <h2 className="font-bold">学習履歴</h2>
              <p className="mt-1 text-sm text-slate-500">
                {selectedStudent ? getDisplayName(selectedStudent) : '生徒を選択してください'}
              </p>
            </div>

            {loadingResults ? (
              <div className="flex items-center justify-center py-16 text-sm font-medium text-slate-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                履歴を読み込み中...
              </div>
            ) : !selectedStudent ? (
              <div className="px-4 py-16 text-center text-sm text-slate-500">生徒を選択してください。</div>
            ) : studentResults.length === 0 ? (
              <div className="px-4 py-16 text-center text-sm text-slate-500">Mistapのテスト履歴がありません。</div>
            ) : (
              <div className="max-h-[760px] overflow-y-auto">
                {studentResults.map((result) => {
                  const score = formatScore(result.correct, result.total);
                  const range = getResultRange(result);

                  return (
                    <article key={result.result_id} className="border-b border-slate-100 p-4 last:border-b-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate font-bold text-slate-900">{result.selected_text || '小テスト'}</div>
                          <div className="mt-1 text-xs text-slate-500">{formatDate(result.created_at)}</div>
                        </div>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-black ${score >= 80
                          ? 'bg-emerald-100 text-emerald-700'
                          : score >= 60
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                          }`}>
                          {score}%
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-lg bg-slate-50 p-2">
                          <div className="text-xs text-slate-500">範囲</div>
                          <div className="mt-1 truncate text-sm font-bold text-slate-800">{range}</div>
                        </div>
                        <div className="rounded-lg bg-slate-50 p-2">
                          <div className="text-xs text-slate-500">結果</div>
                          <div className="mt-1 text-sm font-bold text-slate-800">{result.correct}/{result.total}</div>
                        </div>
                        <div className="rounded-lg bg-slate-50 p-2">
                          <div className="text-xs text-slate-500">誤答</div>
                          <div className="mt-1 text-sm font-bold text-slate-800">{result.incorrect_count}</div>
                        </div>
                      </div>

                      {Array.isArray(result.incorrect_words) && result.incorrect_words.length > 0 && (
                        <details className="mt-3 rounded-lg border border-red-100 bg-red-50 p-3">
                          <summary className="cursor-pointer text-sm font-bold text-red-700">間違えた単語</summary>
                          <div className="mt-3 space-y-2">
                            {result.incorrect_words.slice(0, 12).map((word) => (
                              <div key={`${result.result_id}-${word.word_number}`} className="rounded-lg bg-white p-2 text-sm">
                                <div className="font-bold text-slate-900">
                                  {word.word} <span className="font-mono text-xs text-slate-400">No.{word.word_number}</span>
                                </div>
                                <div className="mt-1 text-slate-600">{word.meaning}</div>
                              </div>
                            ))}
                            {result.incorrect_words.length > 12 && (
                              <div className="text-xs font-medium text-red-700">
                                他 {result.incorrect_words.length - 12} 件
                              </div>
                            )}
                          </div>
                        </details>
                      )}
                    </article>
                  );
                })}
              </div>
          )}
          </aside>
        </div>

        <section className="mt-6 rounded-lg border border-amber-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-amber-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold">1週間以内に未実施の生徒</h2>
                <p className="text-sm text-slate-500">{selectedSchool?.name ?? '塾未選択'} / {inactiveThisWeekStudents.length}名</p>
              </div>
            </div>
          </div>

          {loadingStudents ? (
            <div className="flex items-center justify-center py-10 text-sm font-medium text-slate-500">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              未実施の生徒を確認中...
            </div>
          ) : inactiveThisWeekStudents.length === 0 ? (
            <div className="px-4 py-8 text-sm font-bold text-emerald-700">
              直近1週間で未実施の生徒はいません。
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {inactiveThisWeekStudents.map((student) => (
                <button
                  key={student.student_id}
                  type="button"
                  onClick={() => setSelectedStudentId(student.student_id)}
                  className="flex w-full flex-col gap-3 bg-white px-4 py-3 text-left transition hover:bg-amber-50/60 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900">{getDisplayName(student)}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {student.grade || '学年未設定'} / テスト回数 {student.test_count}回
                    </div>
                  </div>
                  <div className="text-sm font-bold text-slate-700">
                    最終実施: {student.latest_test_at ? formatDateWithDaysAgo(student.latest_test_at) : '未実施'}
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-700">
                <History className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold">全生徒の学習履歴一覧</h2>
                <p className="text-sm text-slate-500">{selectedSchool?.name ?? '塾未選択'} / 最新200件まで</p>
              </div>
            </div>
            <button
              onClick={() => selectedSchoolId && loadAllStudentResults(selectedSchoolId)}
              disabled={!selectedSchoolId || loadingAllResults}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
            >
              {loadingAllResults ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              更新
            </button>
          </div>

          {loadingAllResults ? (
            <div className="flex items-center justify-center py-16 text-sm font-medium text-slate-500">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              全生徒の履歴を読み込み中...
            </div>
          ) : allStudentResults.length === 0 ? (
            <div className="px-4 py-16 text-center">
              <p className="font-bold text-slate-700">学習履歴がまだありません</p>
              <p className="mt-2 text-sm text-slate-500">
                連携済みの生徒がMistapでテストを実施すると、ここに一覧表示されます。
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-500">実施日時</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-500">生徒</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-500">教材 / 範囲</th>
                    <th className="px-4 py-3 text-right text-xs font-bold uppercase text-slate-500">結果</th>
                    <th className="px-4 py-3 text-right text-xs font-bold uppercase text-slate-500">正答率</th>
                    <th className="px-4 py-3 text-right text-xs font-bold uppercase text-slate-500">誤答</th>
                    <th className="px-4 py-3 text-right text-xs font-bold uppercase text-slate-500">テスト作成</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allStudentResults.map((result) => {
                    const score = formatScore(result.correct, result.total);
                    const studentName = result.full_name?.trim() || `生徒 ${result.student_id.slice(0, 8)}`;
                    const isExpanded = expandedResultId === result.result_id;
                    const canCreatePrintableTest = getPrintableWords(result).length > 0 || (
                      Boolean(result.selected_text) &&
                      result.start_num != null &&
                      result.end_num != null
                    );

                    return (
                      <Fragment key={result.result_id}>
                        <tr
                          onClick={() => {
                            setExpandedResultId(isExpanded ? null : result.result_id);
                            setSelectedStudentId(result.student_id);
                          }}
                          className="cursor-pointer bg-white transition hover:bg-slate-50"
                        >
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">{formatDate(result.created_at)}</td>
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-900">{studentName}</div>
                            <div className="mt-1 text-xs text-slate-500">{result.grade || '学年未設定'}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="max-w-[260px] truncate font-bold text-slate-900">{result.selected_text || '小テスト'}</div>
                            <div className="mt-1 text-xs text-slate-500">{getResultRange(result)}</div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-bold text-slate-800">
                            {result.correct}/{result.total}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ${score >= 80
                              ? 'bg-emerald-100 text-emerald-700'
                              : score >= 60
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-red-100 text-red-700'
                              }`}>
                              {score}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-bold text-slate-800">{result.incorrect_count}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              title="テスト作成"
                              disabled={!canCreatePrintableTest}
                              onClick={(event) => {
                                event.stopPropagation();
                                openPrintableTest(result, studentName);
                              }}
                              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Printer className="h-4 w-4" />
                              テスト作成
                            </button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-white">
                            <td colSpan={7} className="px-4 pb-4">
                              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="grid gap-3 sm:grid-cols-4">
                                  <div className="rounded-lg bg-slate-50 p-3">
                                    <div className="text-xs font-bold text-slate-500">生徒</div>
                                    <div className="mt-1 font-bold text-slate-900">{studentName}</div>
                                  </div>
                                  <div className="rounded-lg bg-slate-50 p-3">
                                    <div className="text-xs font-bold text-slate-500">教材</div>
                                    <div className="mt-1 truncate font-bold text-slate-900">{result.selected_text || '小テスト'}</div>
                                  </div>
                                  <div className="rounded-lg bg-slate-50 p-3">
                                    <div className="text-xs font-bold text-slate-500">範囲</div>
                                    <div className="mt-1 font-bold text-slate-900">{getResultRange(result)}</div>
                                  </div>
                                  <div className="rounded-lg bg-slate-50 p-3">
                                    <div className="text-xs font-bold text-slate-500">モード</div>
                                    <div className="mt-1 font-bold text-slate-900">
                                      {result.mode === 'meaning-word' ? '意味→単語' : result.mode === 'word-meaning' ? '単語→意味' : result.mode || '-'}
                                    </div>
                                  </div>
                                </div>

                                {Array.isArray(result.incorrect_words) && result.incorrect_words.length > 0 ? (
                                  <div className="mt-4">
                                    <div className="text-sm font-bold text-red-700">間違えた単語</div>
                                    <div className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                                      {result.incorrect_words.map((word) => (
                                        <div key={`${result.result_id}-all-${word.word_number}`} className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm">
                                          <div className="font-bold text-slate-900">
                                            {word.word} <span className="font-mono text-xs text-slate-400">No.{word.word_number}</span>
                                          </div>
                                          <div className="mt-1 text-slate-600">{word.meaning}</div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm font-bold text-emerald-700">
                                    このテストで記録された誤答はありません。
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
