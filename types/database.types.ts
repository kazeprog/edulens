// EduLens for School - データベース型定義
// 提供されたSQLスキーマに基づく

// ==========================================
// Enum型
// ==========================================

export type UserRole = 'teacher' | 'student';

export type SubmissionStatus = 'none' | 'done' | 'forgot' | 'incomplete';

export type TaskType = 'print' | 'report' | 'work' | 'other';

// ==========================================
// テーブル型
// ==========================================

/** 塾（学習塾） */
export interface CramSchool {
    id: string;
    name: string;
}

/** ユーザープロフィール（Mistap既存 + EduLens追加カラム） */
export interface Profile {
    id: string;
    // Mistap既存カラム
    full_name: string | null;
    role: string | null;  // TEXT型（'teacher' | 'student' などの値）
    grade: string | null;
    created_at: string;
    test_count: number | null;
    last_login: string | null;
    consecutive_login: number | null;
    last_login_daily_goal: string | null;
    start_date: string | null;
    selected_goal_start: string | null;
    goal_end_word: string | null;
    // EduLens for School 追加カラム
    login_id: string | null;
    cram_school_id: string | null;
    school_name: string | null;
}

/** 教科 */
export interface Subject {
    id: number;
    name: string;
}

/** 日々の記録 */
export interface DailyLog {
    id: string;
    student_id: string;
    subject_id: number;
    date: string;
    hand_raised_count: number;
    submission_status: SubmissionStatus;
    attitude_score: number | null;
    created_at: string;
}

/** ワーク（問題集） */
export interface Workbook {
    id: string;
    cram_school_id: string | null;
    student_id: string | null;
    subject_id: number | null;
    title: string;
    current_page: number;
    target_page: number;
    deadline: string | null;
    updated_at: string;
}

/** 単発タスク（宿題） */
export interface OneOffTask {
    id: string;
    student_id: string;
    subject_id: number | null;
    task_type: TaskType;
    title: string | null;
    deadline: string | null;
    is_completed: boolean;
    image_url: string | null;
    created_at: string;
}

// ==========================================
// 挿入用型（Insert Types）
// ==========================================

export type CramSchoolInsert = Omit<CramSchool, 'id'> & { id?: string };

export type ProfileInsert = Omit<Profile, 'id'> & { id: string };

export type SubjectInsert = Omit<Subject, 'id'> & { id?: number };

export type DailyLogInsert = Omit<DailyLog, 'id' | 'created_at'> & {
    id?: string;
    created_at?: string;
};

export type WorkbookInsert = Omit<Workbook, 'id' | 'updated_at'> & {
    id?: string;
    updated_at?: string;
};

export type OneOffTaskInsert = Omit<OneOffTask, 'id' | 'created_at'> & {
    id?: string;
    created_at?: string;
};

// ==========================================
// 更新用型（Update Types）
// ==========================================

export type DailyLogUpdate = Partial<Omit<DailyLog, 'id' | 'student_id' | 'created_at'>>;

export type WorkbookUpdate = Partial<Omit<Workbook, 'id' | 'updated_at'>>;

export type OneOffTaskUpdate = Partial<Omit<OneOffTask, 'id' | 'student_id' | 'created_at'>>;

// ==========================================
// リレーション付き型（Joined Types）
// ==========================================

/** 日々の記録（教科名付き） */
export interface DailyLogWithSubject extends DailyLog {
    subject: Subject;
}

/** ワーク（教科名付き） */
export interface WorkbookWithSubject extends Workbook {
    subject: Subject | null;
}

/** 単発タスク（教科名付き） */
export interface OneOffTaskWithSubject extends OneOffTask {
    subject: Subject | null;
}

/** 生徒プロフィール（塾名付き） */
export interface ProfileWithSchool extends Profile {
    cram_school: CramSchool | null;
}

// ==========================================
// アラート用型（先生向け）
// ==========================================

export interface StudentAlert {
    student: Profile;
    alertType: 'no_log' | 'forgot_submission' | 'workbook_behind';
    daysWithoutLog?: number;
    pagesBehind?: number;
    lastLogDate?: string;
}
