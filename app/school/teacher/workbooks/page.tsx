"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { getSupabase } from "@/lib/supabase"
import { formatDateJP } from "@/lib/utils"

// 型定義
type Workbook = {
    id: string
    title: string
    subject_id: number
    subject: { name: string } | null
    deadline: string | null
    target_page: number
    current_page: number
    created_at: string
}

type Subject = {
    id: number
    name: string
}

// フォームスキーマ
const workbookSchema = z.object({
    title: z.string().min(1, "タイトルを入力してください").max(100, "タイトルは100文字以内で入力してください"),
    subjectId: z.string().min(1, "教科を選択してください"),
    deadline: z.string().optional(),
    pageCount: z.string().optional(),
})

type WorkbookFormData = z.infer<typeof workbookSchema>

export default function WorkbooksPage() {
    const [workbooks, setWorkbooks] = useState<Workbook[]>([])
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [cramSchoolId, setCramSchoolId] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<WorkbookFormData>({
        resolver: zodResolver(workbookSchema),
    })

    useEffect(() => {
        const init = async () => {
            const supabase = getSupabase()
            if (!supabase) return

            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: teacherProfile } = await supabase
                .from("profiles")
                .select("cram_school_id")
                .eq("id", user.id)
                .single()

            // 教科マスタは常に取得
            await fetchSubjects()

            if (teacherProfile?.cram_school_id) {
                setCramSchoolId(teacherProfile.cram_school_id)
                await fetchWorkbooks(teacherProfile.cram_school_id)
            }

            setIsLoading(false)
        }
        init()
    }, [])

    const fetchWorkbooks = async (schoolId: string) => {
        const supabase = getSupabase()
        if (!supabase) return

        const { data } = await supabase
            .from("workbooks")
            .select(`
                *,
                subject:subjects(name)
            `)
            .eq("cram_school_id", schoolId)
            .order("created_at", { ascending: false })

        if (data) {
            setWorkbooks(data as unknown as Workbook[])
        }
    }

    const fetchSubjects = async () => {
        try {
            const response = await fetch("/api/subjects")
            const data = await response.json()

            if (Array.isArray(data) && data.length > 0) {
                setSubjects(data)
                return
            }
        } catch (error) {
            console.error("Failed to fetch subjects from API:", error)
        }

        // API取得失敗またはデータなしの場合のフォールバック
        setSubjects([
            { id: 1, name: "国語" },
            { id: 2, name: "数学" },
            { id: 3, name: "英語" },
            { id: 4, name: "理科" },
            { id: 5, name: "社会" },
            { id: 6, name: "音楽" },
            { id: 7, name: "美術" },
            { id: 8, name: "体育" },
            { id: 9, name: "技術" },
            { id: 10, name: "家庭" },
        ])
    }

    const onSubmit = async (data: WorkbookFormData) => {
        if (!cramSchoolId) {
            toast.error("塾IDが設定されていません")
            return
        }

        setIsCreating(true)
        const supabase = getSupabase()
        if (!supabase) return

        try {
            const { error } = await supabase
                .from("workbooks")
                .insert({
                    title: data.title,
                    subject_id: parseInt(data.subjectId),
                    cram_school_id: cramSchoolId,
                    deadline: data.deadline || null,
                    target_page: data.pageCount ? parseInt(data.pageCount) : 0,
                })

            if (error) throw error

            toast.success("ワークを作成しました")
            setIsModalOpen(false)
            reset()
            fetchWorkbooks(cramSchoolId)

        } catch (error) {
            console.error("Error creating workbook:", error)
            toast.error("ワークの作成に失敗しました")
        } finally {
            setIsCreating(false)
        }
    }

    const filteredWorkbooks = workbooks.filter((wb) =>
        wb.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // 教科ごとの色を取得
    const getSubjectColor = (subjectName: string | undefined) => {
        const colors: Record<string, { bg: string; text: string; gradient: string }> = {
            "国語": { bg: "bg-red-100", text: "text-red-700", gradient: "from-red-500 to-rose-500" },
            "数学": { bg: "bg-blue-100", text: "text-blue-700", gradient: "from-blue-500 to-indigo-500" },
            "英語": { bg: "bg-purple-100", text: "text-purple-700", gradient: "from-purple-500 to-violet-500" },
            "理科": { bg: "bg-green-100", text: "text-green-700", gradient: "from-green-500 to-emerald-500" },
            "社会": { bg: "bg-amber-100", text: "text-amber-700", gradient: "from-amber-500 to-orange-500" },
        }
        return colors[subjectName || ""] || { bg: "bg-gray-100", text: "text-gray-700", gradient: "from-gray-500 to-slate-500" }
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 bg-white rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* ヘッダー */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">ワーク管理</h1>
                    <p className="text-gray-500 mt-1">生徒に配布する課題ワークを管理します</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    新規ワーク作成
                </button>
            </div>

            {/* 検索バー */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="ワーク名で検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 text-base rounded-xl border-2 border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                />
            </div>

            {/* ワーク一覧 */}
            {filteredWorkbooks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredWorkbooks.map((workbook) => {
                        const color = getSubjectColor(workbook.subject?.name)
                        const progress = workbook.target_page > 0
                            ? Math.round((workbook.current_page / workbook.target_page) * 100)
                            : 0

                        return (
                            <div
                                key={workbook.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all overflow-hidden group"
                            >
                                {/* 上部カラーバー */}
                                <div className={`h-2 bg-gradient-to-r ${color.gradient}`} />

                                <div className="p-6">
                                    {/* 教科タグ */}
                                    <div className="flex items-start justify-between mb-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${color.bg} ${color.text}`}>
                                            {workbook.subject?.name || "教科未設定"}
                                        </span>
                                        <button className="p-1 rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* タイトル */}
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        {workbook.title}
                                    </h3>

                                    {/* 期限 */}
                                    <div className="flex items-center text-sm text-gray-500 mb-4">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {workbook.deadline ? (
                                            <>期限: {formatDateJP(workbook.deadline)}</>
                                        ) : (
                                            "期限なし"
                                        )}
                                    </div>

                                    {/* 進捗バー */}
                                    {workbook.target_page > 0 && (
                                        <div className="mb-4">
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>進捗</span>
                                                <span>{workbook.current_page} / {workbook.target_page} ページ</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full bg-gradient-to-r ${color.gradient} transition-all`}
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* フッター */}
                                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-xs text-gray-400">
                                            作成日: {formatDateJP(workbook.created_at)}
                                        </span>
                                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                                            詳細を見る →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {searchQuery ? "ワークが見つかりません" : "ワークがありません"}
                        </h3>
                        <p className="text-gray-500 max-w-sm mb-6">
                            {searchQuery
                                ? "検索条件を変更して再度お試しください"
                                : "新しいワークを作成して生徒に配布しましょう"}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                新規ワーク作成
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* 新規作成モーダル */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">新規ワーク作成</h2>
                            <p className="text-gray-500 mt-1">新しい課題ワークを作成します</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    タイトル <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="例: 中1数学 計算ドリル"
                                    className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                    {...register("title")}
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-500">{errors.title.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    教科 <span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-white"
                                    onChange={(e) => setValue("subjectId", e.target.value)}
                                    defaultValue=""
                                >
                                    <option value="" disabled>教科を選択</option>
                                    {subjects.map((subject) => (
                                        <option key={subject.id} value={subject.id.toString()}>
                                            {subject.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.subjectId && (
                                    <p className="text-sm text-red-500">{errors.subjectId.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">総ページ数</label>
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="例: 50"
                                        className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                        {...register("pageCount")}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">期限</label>
                                    <input
                                        type="date"
                                        className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                        {...register("deadline")}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 h-12 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    キャンセル
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                >
                                    {isCreating ? (
                                        <>
                                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            作成中...
                                        </>
                                    ) : (
                                        "作成する"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
