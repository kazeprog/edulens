"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import Link from "next/link"

import { getSupabase } from "@/lib/supabase"
import { formatDateJP, getDaysAgo } from "@/lib/utils"
import type { Profile, DailyLog, StudentAlert } from "@/types/database.types"

// アラートダッシュボード
import { AlertDashboard } from "@/components/teacher/AlertDashboard"

interface DashboardStats {
    totalStudents: number
    activeStudentsToday: number
    totalWorkbooks: number
    alertCount: number
}

export default function TeacherDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalStudents: 0,
        activeStudentsToday: 0,
        totalWorkbooks: 0,
        alertCount: 0,
    })
    const [alerts, setAlerts] = useState<StudentAlert[]>([])
    const [recentLogs, setRecentLogs] = useState<(DailyLog & { student: Profile })[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [cramSchoolId, setCramSchoolId] = useState<string | null>(null)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        const supabase = getSupabase()
        if (!supabase) return

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // 先生のプロフィールから塾IDを取得
            const { data: teacherProfile } = await supabase
                .from("profiles")
                .select("cram_school_id")
                .eq("id", user.id)
                .single()

            const schoolId = teacherProfile?.cram_school_id
            setCramSchoolId(schoolId)

            // 塾IDが設定されていない場合はデータを取得しない
            if (!schoolId) {
                setIsLoading(false)
                return
            }

            // 生徒一覧取得
            const { data: students } = await supabase
                .from("profiles")
                .select("*")
                .eq("role", "student")
                .eq("cram_school_id", schoolId)

            // 今日のログ取得
            const today = new Date().toISOString().split("T")[0]
            const { data: todayLogs } = await supabase
                .from("daily_logs")
                .select("student_id")
                .eq("date", today)

            // ワークブック数取得
            const { data: workbooks } = await supabase
                .from("workbooks")
                .select("*")
                .eq("cram_school_id", schoolId)

            // 3日以上ログがない生徒を検出
            const threeDaysAgo = getDaysAgo(3).toISOString().split("T")[0]
            const { data: recentLogsData } = await supabase
                .from("daily_logs")
                .select("student_id, date")
                .gte("date", threeDaysAgo)

            // 提出物忘れを検出
            const { data: forgotLogs } = await supabase
                .from("daily_logs")
                .select("student_id, date, subject_id")
                .eq("submission_status", "forgot")
                .gte("date", threeDaysAgo)

            // アラート生成
            const alertList: StudentAlert[] = []
            const studentLogMap = new Map<string, string>()

            recentLogsData?.forEach((log) => {
                const current = studentLogMap.get(log.student_id)
                if (!current || log.date > current) {
                    studentLogMap.set(log.student_id, log.date)
                }
            })

            students?.forEach((student) => {
                const lastLog = studentLogMap.get(student.id)
                const hasRecentLog = lastLog && lastLog >= threeDaysAgo

                if (!hasRecentLog) {
                    alertList.push({
                        student,
                        alertType: "no_log",
                        daysWithoutLog: lastLog
                            ? Math.floor((Date.now() - new Date(lastLog).getTime()) / (1000 * 60 * 60 * 24))
                            : 999,
                        lastLogDate: lastLog,
                    })
                }
            })

            forgotLogs?.forEach((log) => {
                const student = students?.find((s) => s.id === log.student_id)
                if (student) {
                    const existing = alertList.find(
                        (a) => a.student.id === student.id && a.alertType === "forgot_submission"
                    )
                    if (!existing) {
                        alertList.push({
                            student,
                            alertType: "forgot_submission",
                        })
                    }
                }
            })

            const activeStudentIds = new Set(todayLogs?.map((l) => l.student_id) || [])

            setStats({
                totalStudents: students?.length || 0,
                activeStudentsToday: activeStudentIds.size,
                totalWorkbooks: workbooks?.length || 0,
                alertCount: alertList.length,
            })

            setAlerts(alertList)

            const { data: logs } = await supabase
                .from("daily_logs")
                .select("*, student:profiles(*)")
                .order("created_at", { ascending: false })
                .limit(10)

            if (logs) {
                setRecentLogs(logs as (DailyLog & { student: Profile })[])
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error)
            toast.error("データの取得に失敗しました")
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 bg-white rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    // 塾IDが未設定の場合
    if (!cramSchoolId) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
                    <p className="text-gray-500 mt-1">{formatDateJP(new Date())} の状況</p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 border border-amber-200">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">塾の設定が必要です</h3>
                            <p className="text-gray-600 mb-4">
                                ダッシュボードを利用するには、所属する塾を設定してください。<br />
                                設定画面から塾の選択または新規作成ができます。
                            </p>
                            <Link
                                href="/school/teacher/settings"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/40 transform hover:-translate-y-0.5 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                設定画面へ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* ヘッダー */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
                <p className="text-gray-500 mt-1">{formatDateJP(new Date())} の状況</p>
            </div>

            {/* 統計カード */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 生徒数 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">生徒数</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
                        </div>
                    </div>
                </div>

                {/* 今日の記録者 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">今日の記録者</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.activeStudentsToday}</p>
                        </div>
                    </div>
                </div>

                {/* ワーク数 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">ワーク数</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.totalWorkbooks}</p>
                        </div>
                    </div>
                </div>

                {/* 要注意 */}
                <div className={`rounded-2xl p-6 shadow-sm border transition-shadow hover:shadow-md ${stats.alertCount > 0
                        ? "bg-gradient-to-br from-red-50 to-orange-50 border-red-200"
                        : "bg-white border-gray-100"
                    }`}>
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${stats.alertCount > 0
                                ? "bg-gradient-to-br from-red-500 to-orange-500 shadow-red-500/30"
                                : "bg-gradient-to-br from-gray-400 to-gray-500 shadow-gray-500/30"
                            }`}>
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <p className={`text-sm font-medium ${stats.alertCount > 0 ? "text-red-600" : "text-gray-500"}`}>要注意</p>
                            <p className={`text-3xl font-bold ${stats.alertCount > 0 ? "text-red-700" : "text-gray-900"}`}>{stats.alertCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* アラートセクション */}
            {alerts.length > 0 && (
                <AlertDashboard alerts={alerts} />
            )}

            {/* 最近のアクティビティ */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        最近のアクティビティ
                    </h2>
                </div>
                <div className="p-6">
                    {recentLogs.length > 0 ? (
                        <div className="space-y-4">
                            {recentLogs.slice(0, 5).map((log) => (
                                <div
                                    key={log.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                                            <span className="text-white font-bold">
                                                {(log.student?.full_name || "生")[0]}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {log.student?.full_name || "生徒"}
                                            </p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                                                    </svg>
                                                    挙手 {log.hand_raised_count}回
                                                </span>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${log.submission_status === "done"
                                                        ? "bg-green-100 text-green-700"
                                                        : log.submission_status === "forgot"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-gray-100 text-gray-600"
                                                    }`}>
                                                    {log.submission_status === "done" ? "提出済" :
                                                        log.submission_status === "forgot" ? "忘れ" : "なし"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-400 font-medium">
                                        {formatDateJP(log.date)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">アクティビティがありません</h3>
                            <p className="text-gray-500">生徒が記録を入力するとここに表示されます</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
