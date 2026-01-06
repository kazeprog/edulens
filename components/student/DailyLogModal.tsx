"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Hand, FileCheck, Star, Loader2 } from "lucide-react"

import { getSupabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { cn, getToday } from "@/lib/utils"
import type { Subject, SubmissionStatus, DailyLogInsert } from "@/types/database.types"

// 教科アイコンのマッピング（色分け）
const subjectColors: Record<string, string> = {
    "国語": "bg-red-100 text-red-600 border-red-200",
    "数学": "bg-blue-100 text-blue-600 border-blue-200",
    "英語": "bg-purple-100 text-purple-600 border-purple-200",
    "理科": "bg-green-100 text-green-600 border-green-200",
    "社会": "bg-yellow-100 text-yellow-700 border-yellow-200",
}

interface DailyLogModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    subjects: Subject[]
    userId: string | null
    onSaved: () => void
}

export function DailyLogModal({
    open,
    onOpenChange,
    subjects,
    userId,
    onSaved,
}: DailyLogModalProps) {
    const [selectedSubject, setSelectedSubject] = useState<number | null>(null)
    const [handRaisedCount, setHandRaisedCount] = useState(0)
    const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>("none")
    const [attitudeScore, setAttitudeScore] = useState(3)
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        if (!selectedSubject || !userId) {
            toast.error("教科を選択してください")
            return
        }

        setIsSaving(true)

        try {
            const supabase = getSupabase()
            if (!supabase) {
                toast.error("システムエラーが発生しました")
                return
            }

            const logData: DailyLogInsert = {
                student_id: userId,
                subject_id: selectedSubject,
                date: getToday(),
                hand_raised_count: handRaisedCount,
                submission_status: submissionStatus,
                attitude_score: attitudeScore,
            }

            const { error } = await supabase.from("daily_logs").insert(logData)

            if (error) {
                console.error("Error saving log:", error)
                toast.error("保存に失敗しました")
                return
            }

            // リセット
            setSelectedSubject(null)
            setHandRaisedCount(0)
            setSubmissionStatus("none")
            setAttitudeScore(3)
            onSaved()
        } catch (error) {
            console.error("Unexpected error:", error)
            toast.error("予期せぬエラーが発生しました")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">今日の記録</DialogTitle>
                    <DialogDescription>授業の振り返りを入力しましょう</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* 教科選択 */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">教科を選択</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {subjects.map((subject) => (
                                <button
                                    key={subject.id}
                                    onClick={() => setSelectedSubject(subject.id)}
                                    className={cn(
                                        "p-3 rounded-xl border-2 text-sm font-medium transition-all",
                                        subjectColors[subject.name] || "bg-gray-100 text-gray-600 border-gray-200",
                                        selectedSubject === subject.id
                                            ? "ring-2 ring-blue-500 ring-offset-2 scale-105"
                                            : "hover:scale-102"
                                    )}
                                >
                                    {subject.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 挙手回数 */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold flex items-center gap-2">
                            <Hand className="w-5 h-5 text-blue-500" />
                            挙手回数
                        </Label>
                        <div className="grid grid-cols-4 gap-2">
                            {[0, 1, 2, 3].map((count) => (
                                <button
                                    key={count}
                                    onClick={() => setHandRaisedCount(count)}
                                    className={cn(
                                        "h-14 rounded-xl border-2 text-lg font-bold transition-all",
                                        handRaisedCount === count
                                            ? "bg-blue-500 text-white border-blue-500"
                                            : "bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300"
                                    )}
                                >
                                    {count === 3 ? "3+" : count}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 提出物 */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold flex items-center gap-2">
                            <FileCheck className="w-5 h-5 text-green-500" />
                            提出物
                        </Label>
                        <div className="grid grid-cols-3 gap-2">
                            <Button
                                type="button"
                                onClick={() => setSubmissionStatus("done")}
                                variant={submissionStatus === "done" ? "success" : "outline"}
                                size="touch"
                                className={cn(
                                    "h-14",
                                    submissionStatus === "done" && "ring-2 ring-green-300"
                                )}
                            >
                                提出済
                            </Button>
                            <Button
                                type="button"
                                onClick={() => setSubmissionStatus("forgot")}
                                variant={submissionStatus === "forgot" ? "danger" : "outline"}
                                size="touch"
                                className={cn(
                                    "h-14",
                                    submissionStatus === "forgot" && "ring-2 ring-red-300"
                                )}
                            >
                                忘れた
                            </Button>
                            <Button
                                type="button"
                                onClick={() => setSubmissionStatus("none")}
                                variant={submissionStatus === "none" ? "secondary" : "outline"}
                                size="touch"
                                className="h-14"
                            >
                                なし
                            </Button>
                        </div>
                    </div>

                    {/* 態度スコア */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500" />
                            今日の授業態度
                        </Label>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((score) => (
                                <button
                                    key={score}
                                    onClick={() => setAttitudeScore(score)}
                                    className="p-2 transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={cn(
                                            "w-10 h-10 transition-colors",
                                            score <= attitudeScore
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-center text-sm text-gray-500">
                            {attitudeScore === 1 && "もう少しがんばろう"}
                            {attitudeScore === 2 && "まあまあ"}
                            {attitudeScore === 3 && "ふつう"}
                            {attitudeScore === 4 && "よくできた"}
                            {attitudeScore === 5 && "最高！"}
                        </p>
                    </div>
                </div>

                {/* 保存ボタン */}
                <Button
                    onClick={handleSave}
                    disabled={!selectedSubject || isSaving}
                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-500 to-indigo-600"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            保存中...
                        </>
                    ) : (
                        "記録を保存"
                    )}
                </Button>
            </DialogContent>
        </Dialog>
    )
}
