"use client"

import { useEffect, useState } from "react"
import { Plus, Hand, FileCheck, Star, BookOpen, ClipboardList } from "lucide-react"
import { toast } from "sonner"

import { getSupabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatDateJP, calculateProgress, getToday } from "@/lib/utils"
import type { DailyLogWithSubject, WorkbookWithSubject, OneOffTaskWithSubject, Subject } from "@/types/database.types"

// 日々の記録入力モーダル
import { DailyLogModal } from "@/components/student/DailyLogModal"

export default function StudentDashboard() {
    const [todayLogs, setTodayLogs] = useState<DailyLogWithSubject[]>([])
    const [workbooks, setWorkbooks] = useState<WorkbookWithSubject[]>([])
    const [tasks, setTasks] = useState<OneOffTaskWithSubject[]>([])
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const supabase = getSupabase()
        if (!supabase) return

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return
            setUserId(user.id)

            const today = getToday()

            // 並列でデータ取得
            const [logsRes, workbooksRes, tasksRes, subjectsRes] = await Promise.all([
                supabase
                    .from("daily_logs")
                    .select("*, subject:subjects(*)")
                    .eq("student_id", user.id)
                    .eq("date", today)
                    .order("created_at", { ascending: false }),
                supabase
                    .from("workbooks")
                    .select("*, subject:subjects(*)")
                    .eq("student_id", user.id)
                    .order("deadline", { ascending: true })
                    .limit(5),
                supabase
                    .from("one_off_tasks")
                    .select("*, subject:subjects(*)")
                    .eq("student_id", user.id)
                    .eq("is_completed", false)
                    .order("deadline", { ascending: true })
                    .limit(5),
                supabase
                    .from("subjects")
                    .select("*")
                    .order("id"),
            ])

            if (logsRes.data) setTodayLogs(logsRes.data as DailyLogWithSubject[])
            if (workbooksRes.data) setWorkbooks(workbooksRes.data as WorkbookWithSubject[])
            if (tasksRes.data) setTasks(tasksRes.data as OneOffTaskWithSubject[])
            if (subjectsRes.data) setSubjects(subjectsRes.data as Subject[])
        } catch (error) {
            console.error("Error fetching data:", error)
            toast.error("データの取得に失敗しました")
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogSaved = () => {
        setIsModalOpen(false)
        fetchData()
        toast.success("記録を保存しました")
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="h-32 bg-gray-100 rounded-lg" />
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-5">
            {/* 今日の日付 */}
            <div className="text-center">
                <p className="text-sm text-gray-500">今日</p>
                <p className="text-2xl font-bold text-gray-800">{formatDateJP(new Date())}</p>
            </div>

            {/* 今日の記録カード */}
            <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
                        <Star className="w-5 h-5" />
                        今日の記録
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {todayLogs.length > 0 ? (
                        <div className="space-y-2">
                            {todayLogs.map((log) => (
                                <div
                                    key={log.id}
                                    className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm"
                                >
                                    <span className="font-medium text-gray-700">{log.subject?.name}</span>
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="flex items-center gap-1 text-blue-600">
                                            <Hand className="w-4 h-4" />
                                            {log.hand_raised_count}回
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${log.submission_status === 'done' ? 'bg-green-100 text-green-700' :
                                                log.submission_status === 'forgot' ? 'bg-red-100 text-red-700' :
                                                    'bg-gray-100 text-gray-600'
                                            }`}>
                                            {log.submission_status === 'done' ? '提出済' :
                                                log.submission_status === 'forgot' ? '忘れ' : 'なし'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">まだ記録がありません</p>
                    )}

                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                        size="lg"
                    >
                        <Plus className="w-5 h-5 mr-1" />
                        記録を追加
                    </Button>
                </CardContent>
            </Card>

            {/* ワーク進捗カード */}
            <Card className="border-0 shadow-md">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2 text-gray-700">
                        <BookOpen className="w-5 h-5 text-indigo-500" />
                        ワーク進捗
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {workbooks.length > 0 ? (
                        <div className="space-y-4">
                            {workbooks.map((workbook) => {
                                const progress = calculateProgress(workbook.current_page, workbook.target_page)
                                return (
                                    <div key={workbook.id} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-gray-700 text-sm">{workbook.title}</span>
                                            <span className="text-xs text-gray-500">
                                                {workbook.current_page}/{workbook.target_page}P
                                            </span>
                                        </div>
                                        <Progress value={progress} className="h-2" />
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">登録されたワークはありません</p>
                    )}
                </CardContent>
            </Card>

            {/* 宿題リストカード */}
            <Card className="border-0 shadow-md">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2 text-gray-700">
                        <ClipboardList className="w-5 h-5 text-orange-500" />
                        宿題リスト
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {tasks.length > 0 ? (
                        <div className="space-y-2">
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                                >
                                    <div>
                                        <p className="font-medium text-gray-700 text-sm">
                                            {task.title || `${task.subject?.name}の${task.task_type}`}
                                        </p>
                                        {task.deadline && (
                                            <p className="text-xs text-gray-500">
                                                締切: {formatDateJP(task.deadline)}
                                            </p>
                                        )}
                                    </div>
                                    <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">
                                        {task.task_type === 'print' ? 'プリント' :
                                            task.task_type === 'report' ? 'レポート' :
                                                task.task_type === 'work' ? 'ワーク' : 'その他'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">未完了の宿題はありません 🎉</p>
                    )}
                </CardContent>
            </Card>

            {/* 日々の記録入力モーダル */}
            <DailyLogModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                subjects={subjects}
                userId={userId}
                onSaved={handleLogSaved}
            />
        </div>
    )
}
