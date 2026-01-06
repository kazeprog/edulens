"use client"

import { useEffect, useState } from "react"
import { Plus, Check, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { getSupabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { formatDateJP } from "@/lib/utils"
import type { OneOffTaskWithSubject, Subject, TaskType } from "@/types/database.types"

const taskTypeOptions: { value: TaskType; label: string; emoji: string }[] = [
    { value: "print", label: "プリント", emoji: "📄" },
    { value: "report", label: "レポート", emoji: "📝" },
    { value: "work", label: "ワーク", emoji: "📘" },
    { value: "other", label: "その他", emoji: "📌" },
]

export default function TasksPage() {
    const [tasks, setTasks] = useState<OneOffTaskWithSubject[]>([])
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)

    // フォーム状態
    const [selectedType, setSelectedType] = useState<TaskType>("print")
    const [selectedSubject, setSelectedSubject] = useState<number | null>(null)
    const [title, setTitle] = useState("")
    const [deadline, setDeadline] = useState("")

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

            const [tasksRes, subjectsRes] = await Promise.all([
                supabase
                    .from("one_off_tasks")
                    .select("*, subject:subjects(*)")
                    .eq("student_id", user.id)
                    .order("is_completed")
                    .order("deadline", { ascending: true }),
                supabase.from("subjects").select("*").order("id"),
            ])

            if (tasksRes.data) setTasks(tasksRes.data as OneOffTaskWithSubject[])
            if (subjectsRes.data) setSubjects(subjectsRes.data as Subject[])
        } catch (error) {
            console.error("Error fetching data:", error)
            toast.error("データの取得に失敗しました")
        } finally {
            setIsLoading(false)
        }
    }

    const handleComplete = async (taskId: string) => {
        const supabase = getSupabase()
        if (!supabase) return

        try {
            const { error } = await supabase
                .from("one_off_tasks")
                .update({ is_completed: true })
                .eq("id", taskId)

            if (error) throw error

            setTasks((prev) =>
                prev.map((t) => (t.id === taskId ? { ...t, is_completed: true } : t))
            )
            toast.success("完了しました！ 🎉")
        } catch (error) {
            console.error("Error completing task:", error)
            toast.error("更新に失敗しました")
        }
    }

    const handleAddTask = async () => {
        if (!userId || !selectedSubject) {
            toast.error("教科を選択してください")
            return
        }

        setIsSaving(true)

        const supabase = getSupabase()
        if (!supabase) return

        try {
            const subjectName = subjects.find((s) => s.id === selectedSubject)?.name
            const typeName = taskTypeOptions.find((t) => t.value === selectedType)?.label
            const defaultTitle = `${subjectName}の${typeName}`

            const { error } = await supabase.from("one_off_tasks").insert({
                student_id: userId,
                subject_id: selectedSubject,
                task_type: selectedType,
                title: title || defaultTitle,
                deadline: deadline || null,
                is_completed: false,
            })

            if (error) throw error

            toast.success("宿題を追加しました")
            setIsModalOpen(false)
            setSelectedType("print")
            setSelectedSubject(null)
            setTitle("")
            setDeadline("")
            fetchData()
        } catch (error) {
            console.error("Error adding task:", error)
            toast.error("追加に失敗しました")
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="h-24 bg-gray-100 rounded-lg" />
                    </Card>
                ))}
            </div>
        )
    }

    const pendingTasks = tasks.filter((t) => !t.is_completed)
    const completedTasks = tasks.filter((t) => t.is_completed)

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-800">宿題リスト</h1>
                <Button onClick={() => setIsModalOpen(true)} size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    追加
                </Button>
            </div>

            {/* 未完了タスク */}
            <div className="space-y-3">
                {pendingTasks.length > 0 ? (
                    pendingTasks.map((task) => (
                        <Card key={task.id} className="border-0 shadow-sm">
                            <CardContent className="p-4 flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="shrink-0 w-10 h-10 rounded-full border-2 border-gray-300 hover:border-green-500 hover:bg-green-50"
                                    onClick={() => handleComplete(task.id)}
                                >
                                    <Check className="w-5 h-5 text-gray-400" />
                                </Button>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-800 truncate">
                                        {task.title || `${task.subject?.name}の${task.task_type}`}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                                            {taskTypeOptions.find((t) => t.value === task.task_type)?.emoji}{" "}
                                            {taskTypeOptions.find((t) => t.value === task.task_type)?.label}
                                        </span>
                                        {task.deadline && (
                                            <span className="text-xs text-gray-500">
                                                〆 {formatDateJP(task.deadline)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="border-0 shadow-sm bg-green-50">
                        <CardContent className="py-8 text-center text-green-700">
                            すべての宿題が完了しています 🎉
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* 完了済み */}
            {completedTasks.length > 0 && (
                <div className="space-y-3">
                    <h2 className="text-sm font-medium text-gray-500">完了済み</h2>
                    {completedTasks.slice(0, 5).map((task) => (
                        <Card key={task.id} className="border-0 shadow-sm opacity-60">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <Check className="w-5 h-5 text-green-600" />
                                </div>
                                <p className="font-medium text-gray-500 line-through">
                                    {task.title || `${task.subject?.name}の${task.task_type}`}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* 追加モーダル */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>宿題を追加</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-5 py-4">
                        {/* タスクタイプ選択 */}
                        <div className="space-y-2">
                            <Label>タイプ</Label>
                            <div className="grid grid-cols-4 gap-2">
                                {taskTypeOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setSelectedType(option.value)}
                                        className={`p-3 rounded-xl border-2 text-center transition-all ${selectedType === option.value
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300"
                                            }`}
                                    >
                                        <span className="text-xl">{option.emoji}</span>
                                        <p className="text-xs mt-1 text-gray-600">{option.label}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 教科選択 */}
                        <div className="space-y-2">
                            <Label>教科 *</Label>
                            <Select onValueChange={(v) => setSelectedSubject(Number(v))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="教科を選択" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subjects.map((subject) => (
                                        <SelectItem key={subject.id} value={String(subject.id)}>
                                            {subject.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* タイトル */}
                        <div className="space-y-2">
                            <Label>タイトル（任意）</Label>
                            <Input
                                placeholder={`例: ${subjects[0]?.name || "数学"}のプリント`}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        {/* 締め切り */}
                        <div className="space-y-2">
                            <Label>締め切り（任意）</Label>
                            <Input
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button
                        onClick={handleAddTask}
                        disabled={!selectedSubject || isSaving}
                        className="w-full"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                追加中...
                            </>
                        ) : (
                            "追加する"
                        )}
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    )
}
