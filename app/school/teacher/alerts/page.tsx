"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import Link from "next/link"

import { getSupabase } from "@/lib/supabase"
import { getDaysAgo } from "@/lib/utils"
import type { Profile, StudentAlert } from "@/types/database.types"

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<StudentAlert[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState<"all" | "no_log" | "forgot_submission">("all")

    useEffect(() => {
        fetchAlerts()
    }, [])

    const fetchAlerts = async () => {
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

            if (!teacherProfile?.cram_school_id) {
                setIsLoading(false)
                return
            }

            // 生徒一覧取得
            const { data: students } = await supabase
                .from("profiles")
                .select("*")
                .eq("role", "student")
                .eq("cram_school_id", teacherProfile.cram_school_id)

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

            // 重要度順にソート
            alertList.sort((a, b) => {
                if (a.alertType === "no_log" && b.alertType !== "no_log") return -1
                if (a.alertType !== "no_log" && b.alertType === "no_log") return 1
                if (a.daysWithoutLog && b.daysWithoutLog) {
                    return b.daysWithoutLog - a.daysWithoutLog
                }
                return 0
            })

            setAlerts(alertList)
        } catch (error) {
            console.error("Error fetching alerts:", error)
            toast.error("アラートの取得に失敗しました")
        } finally {
            setIsLoading(false)
        }
    }

    const filteredAlerts = alerts.filter((alert) => {
        if (filter === "all") return true
        return alert.alertType === filter
    })

    const noLogCount = alerts.filter((a) => a.alertType === "no_log").length
    const forgotCount = alerts.filter((a) => a.alertType === "forgot_submission").length

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-48" />
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-white rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* ヘッダー */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">アラート</h1>
                <p className="text-gray-500 mt-1">注意が必要な生徒の一覧</p>
            </div>

            {/* 統計カード */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                    onClick={() => setFilter("all")}
                    className={`p-6 rounded-2xl border-2 transition-all text-left ${filter === "all"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${filter === "all" ? "bg-blue-500" : "bg-gray-100"
                            }`}>
                            <svg className={`w-6 h-6 ${filter === "all" ? "text-white" : "text-gray-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">すべて</p>
                            <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
                        </div>
                    </div>
                </button>

                <button
                    onClick={() => setFilter("no_log")}
                    className={`p-6 rounded-2xl border-2 transition-all text-left ${filter === "no_log"
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${filter === "no_log" ? "bg-red-500" : "bg-red-100"
                            }`}>
                            <svg className={`w-6 h-6 ${filter === "no_log" ? "text-white" : "text-red-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">未記録</p>
                            <p className="text-2xl font-bold text-gray-900">{noLogCount}</p>
                        </div>
                    </div>
                </button>

                <button
                    onClick={() => setFilter("forgot_submission")}
                    className={`p-6 rounded-2xl border-2 transition-all text-left ${filter === "forgot_submission"
                            ? "border-amber-500 bg-amber-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${filter === "forgot_submission" ? "bg-amber-500" : "bg-amber-100"
                            }`}>
                            <svg className={`w-6 h-6 ${filter === "forgot_submission" ? "text-white" : "text-amber-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">提出忘れ</p>
                            <p className="text-2xl font-bold text-gray-900">{forgotCount}</p>
                        </div>
                    </div>
                </button>
            </div>

            {/* アラート一覧 */}
            {filteredAlerts.length > 0 ? (
                <div className="space-y-4">
                    {filteredAlerts.map((alert, index) => (
                        <div
                            key={`${alert.student.id}-${alert.alertType}-${index}`}
                            className={`bg-white rounded-2xl p-6 border-l-4 shadow-sm hover:shadow-md transition-all ${alert.alertType === "no_log" ? "border-l-red-500" : "border-l-amber-500"
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${alert.alertType === "no_log"
                                            ? "bg-gradient-to-br from-red-500 to-rose-500"
                                            : "bg-gradient-to-br from-amber-500 to-orange-500"
                                        }`}>
                                        <span className="text-white text-xl font-bold">
                                            {(alert.student.full_name || "生")[0]}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">
                                            {alert.student.full_name || "名前未設定"}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            {alert.student.grade && (
                                                <span className="text-sm text-gray-500">{alert.student.grade}</span>
                                            )}
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${alert.alertType === "no_log"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-amber-100 text-amber-700"
                                                }`}>
                                                {alert.alertType === "no_log" ? "未記録" : "提出忘れ"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    {alert.alertType === "no_log" && (
                                        <div>
                                            <p className="text-2xl font-bold text-red-600">
                                                {alert.daysWithoutLog === 999 ? "∞" : alert.daysWithoutLog}
                                            </p>
                                            <p className="text-xs text-gray-500">日間記録なし</p>
                                        </div>
                                    )}
                                    {alert.alertType === "forgot_submission" && (
                                        <div className="flex items-center gap-2 text-amber-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            <span className="font-medium">要確認</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {filter === "all" ? "アラートはありません" : "該当するアラートがありません"}
                        </h3>
                        <p className="text-gray-500 max-w-sm">
                            {filter === "all"
                                ? "すべての生徒が順調に学習を進めています"
                                : "フィルターを変更してみてください"}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
