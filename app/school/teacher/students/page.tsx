"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { getSupabase } from "@/lib/supabase"
import type { Profile } from "@/types/database.types"

const studentSchema = z.object({
    fullName: z.string().min(1, "氏名を入力してください").max(50, "氏名は50文字以内"),
    loginId: z
        .string()
        .min(1, "生徒IDを入力してください")
        .max(30, "生徒IDは30文字以内")
        .regex(/^[a-zA-Z0-9_-]+$/, "英数字、ハイフン、アンダースコアのみ"),
    password: z.string().min(6, "パスワードは6文字以上").max(50, "パスワードは50文字以内"),
    grade: z.string().optional(),
    schoolName: z.string().optional(),
})

type StudentFormData = z.infer<typeof studentSchema>

const gradeOptions = [
    { value: "小1", label: "小学1年" },
    { value: "小2", label: "小学2年" },
    { value: "小3", label: "小学3年" },
    { value: "小4", label: "小学4年" },
    { value: "小5", label: "小学5年" },
    { value: "小6", label: "小学6年" },
    { value: "中1", label: "中学1年" },
    { value: "中2", label: "中学2年" },
    { value: "中3", label: "中学3年" },
    { value: "高1", label: "高校1年" },
    { value: "高2", label: "高校2年" },
    { value: "高3", label: "高校3年" },
]

export default function StudentsPage() {
    const [students, setStudents] = useState<Profile[]>([])
    const [filteredStudents, setFilteredStudents] = useState<Profile[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [cramSchoolId, setCramSchoolId] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<StudentFormData>({
        resolver: zodResolver(studentSchema),
    })

    useEffect(() => {
        fetchStudents()
    }, [])

    useEffect(() => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            setFilteredStudents(
                students.filter(
                    (s) =>
                        s.full_name?.toLowerCase().includes(query) ||
                        s.login_id?.toLowerCase().includes(query) ||
                        s.grade?.toLowerCase().includes(query)
                )
            )
        } else {
            setFilteredStudents(students)
        }
    }, [searchQuery, students])

    const fetchStudents = async () => {
        const supabase = getSupabase()
        if (!supabase) return

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: teacherProfile } = await supabase
                .from("profiles")
                .select("cram_school_id")
                .eq("id", user.id)
                .single()

            const schoolId = teacherProfile?.cram_school_id
            setCramSchoolId(schoolId)

            if (!schoolId) {
                setStudents([])
                setFilteredStudents([])
                setIsLoading(false)
                return
            }

            const { data } = await supabase
                .from("profiles")
                .select("*")
                .eq("role", "student")
                .eq("cram_school_id", schoolId)
                .order("created_at", { ascending: false })

            if (data) {
                setStudents(data)
                setFilteredStudents(data)
            }
        } catch (error) {
            console.error("Error fetching students:", error)
            toast.error("生徒一覧の取得に失敗しました")
        } finally {
            setIsLoading(false)
        }
    }

    const onSubmit = async (data: StudentFormData) => {
        if (!cramSchoolId) {
            toast.error("塾IDが設定されていません")
            return
        }

        setIsCreating(true)

        try {
            const response = await fetch("/api/teacher/students", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    cramSchoolId,
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || "生徒の作成に失敗しました")
            }

            toast.success("生徒を登録しました")
            setIsModalOpen(false)
            reset()
            fetchStudents()
        } catch (error) {
            console.error("Error creating student:", error)
            toast.error(error instanceof Error ? error.message : "生徒の作成に失敗しました")
        } finally {
            setIsCreating(false)
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-40 bg-white rounded-2xl animate-pulse" />
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
                    <h1 className="text-3xl font-bold text-gray-900">生徒管理</h1>
                    <p className="text-gray-500 mt-1">登録されている生徒の一覧と管理</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    新規生徒登録
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
                    placeholder="生徒名、ID、学年で検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 text-base rounded-xl border-2 border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                />
            </div>

            {/* 生徒一覧 */}
            {filteredStudents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStudents.map((student) => (
                        <div
                            key={student.id}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
                                    <span className="text-white text-xl font-bold">
                                        {(student.full_name || "生")[0]}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                        {student.full_name || "名前未設定"}
                                    </h3>
                                    <p className="text-sm text-gray-500 truncate">
                                        ID: {student.login_id || "未設定"}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                                {student.grade && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                        {student.grade}
                                    </span>
                                )}
                                {student.school_name && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 truncate max-w-[150px]">
                                        {student.school_name}
                                    </span>
                                )}
                            </div>

                            <div className="mt-4 flex gap-2">
                                <button className="flex-1 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                    詳細を見る
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {searchQuery ? "生徒が見つかりません" : "生徒がいません"}
                        </h3>
                        <p className="text-gray-500 max-w-sm mb-6">
                            {searchQuery
                                ? "検索条件を変更して再度お試しください"
                                : "新しい生徒を登録して学習管理を始めましょう"}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                新規生徒登録
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* 新規登録モーダル */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">新規生徒登録</h2>
                            <p className="text-gray-500 mt-1">新しい生徒アカウントを作成します</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    氏名 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="例: 山田 太郎"
                                    className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                    {...register("fullName")}
                                />
                                {errors.fullName && (
                                    <p className="text-sm text-red-500">{errors.fullName.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    生徒ID <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="例: student01"
                                    className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                    {...register("loginId")}
                                />
                                <p className="text-xs text-gray-400">ログイン時に使用します（英数字のみ）</p>
                                {errors.loginId && (
                                    <p className="text-sm text-red-500">{errors.loginId.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    パスワード <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="6文字以上"
                                    className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                    {...register("password")}
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">学年</label>
                                <select
                                    className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-white"
                                    onChange={(e) => setValue("grade", e.target.value)}
                                    defaultValue=""
                                >
                                    <option value="">学年を選択</option>
                                    {gradeOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">学校名</label>
                                <input
                                    type="text"
                                    placeholder="〇〇中学校"
                                    className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                    {...register("schoolName")}
                                />
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
                                        "登録する"
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
