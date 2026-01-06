"use client"

import { useEffect, useState } from "react"
import { Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { getSupabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { calculateProgress, formatDateJP, getDaysUntilDeadline } from "@/lib/utils"
import type { WorkbookWithSubject } from "@/types/database.types"

export default function WorkbooksPage() {
    const [workbooks, setWorkbooks] = useState<WorkbookWithSubject[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [updatingId, setUpdatingId] = useState<string | null>(null)

    useEffect(() => {
        fetchWorkbooks()
    }, [])

    const fetchWorkbooks = async () => {
        const supabase = getSupabase()
        if (!supabase) return

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data } = await supabase
                .from("workbooks")
                .select("*, subject:subjects(*)")
                .eq("student_id", user.id)
                .order("deadline", { ascending: true })

            if (data) {
                setWorkbooks(data as WorkbookWithSubject[])
            }
        } catch (error) {
            console.error("Error fetching workbooks:", error)
            toast.error("ワークの取得に失敗しました")
        } finally {
            setIsLoading(false)
        }
    }

    const updatePage = async (workbookId: string, newPage: number) => {
        if (newPage < 0) return

        setUpdatingId(workbookId)

        const supabase = getSupabase()
        if (!supabase) return

        try {
            const { error } = await supabase
                .from("workbooks")
                .update({ current_page: newPage, updated_at: new Date().toISOString() })
                .eq("id", workbookId)

            if (error) throw error

            setWorkbooks((prev) =>
                prev.map((w) =>
                    w.id === workbookId ? { ...w, current_page: newPage } : w
                )
            )

            toast.success("ページを更新しました")
        } catch (error) {
            console.error("Error updating page:", error)
            toast.error("更新に失敗しました")
        } finally {
            setUpdatingId(null)
        }
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
            <h1 className="text-xl font-bold text-gray-800">ワーク進捗</h1>

            {workbooks.length > 0 ? (
                <div className="space-y-4">
                    {workbooks.map((workbook) => {
                        const progress = calculateProgress(workbook.current_page, workbook.target_page)
                        const daysLeft = getDaysUntilDeadline(workbook.deadline)
                        const isUpdating = updatingId === workbook.id

                        return (
                            <Card key={workbook.id} className="border-0 shadow-md">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base flex items-center justify-between">
                                        <span>{workbook.title}</span>
                                        {workbook.subject && (
                                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                                {workbook.subject.name}
                                            </span>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* 進捗バー */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">進捗</span>
                                            <span className="font-medium text-gray-700">
                                                {workbook.current_page} / {workbook.target_page} ページ ({progress}%)
                                            </span>
                                        </div>
                                        <Progress value={progress} className="h-3" />
                                    </div>

                                    {/* 締め切り */}
                                    {workbook.deadline && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">締切</span>
                                            <span className={`font-medium ${daysLeft !== null && daysLeft <= 3
                                                    ? "text-red-600"
                                                    : "text-gray-700"
                                                }`}>
                                                {formatDateJP(workbook.deadline)}
                                                {daysLeft !== null && (
                                                    <span className="ml-1">
                                                        ({daysLeft > 0 ? `あと${daysLeft}日` : daysLeft === 0 ? "今日" : "期限切れ"})
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    )}

                                    {/* ページ更新ボタン */}
                                    <div className="flex items-center justify-center gap-4 pt-2">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="w-16 h-16 text-2xl font-bold"
                                            onClick={() => updatePage(workbook.id, workbook.current_page - 1)}
                                            disabled={workbook.current_page <= 0 || isUpdating}
                                        >
                                            −
                                        </Button>

                                        <div className="w-24 h-16 flex items-center justify-center bg-gray-100 rounded-xl">
                                            {isUpdating ? (
                                                <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                                            ) : (
                                                <span className="text-2xl font-bold text-gray-800">
                                                    {workbook.current_page}
                                                </span>
                                            )}
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="w-16 h-16 text-2xl font-bold"
                                            onClick={() => updatePage(workbook.id, workbook.current_page + 1)}
                                            disabled={isUpdating}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <Card className="border-0 shadow-sm">
                    <CardContent className="py-12 text-center text-gray-500">
                        登録されたワークはありません
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
