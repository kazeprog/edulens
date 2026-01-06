"use client"

import { AlertTriangle, Clock, FileX, BookX } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDateJP } from "@/lib/utils"
import type { StudentAlert } from "@/types/database.types"

interface AlertDashboardProps {
    alerts: StudentAlert[]
}

export function AlertDashboard({ alerts }: AlertDashboardProps) {
    // アラートタイプでグループ化
    const noLogAlerts = alerts.filter((a) => a.alertType === "no_log")
    const forgotAlerts = alerts.filter((a) => a.alertType === "forgot_submission")
    const behindAlerts = alerts.filter((a) => a.alertType === "workbook_behind")

    return (
        <Card className="border-2 border-red-200 bg-red-50/50 shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                    <AlertTriangle className="w-5 h-5" />
                    要注意の生徒
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* ログがない生徒 */}
                {noLogAlerts.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-500" />
                            3日以上記録がない ({noLogAlerts.length}名)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {noLogAlerts.map((alert) => (
                                <div
                                    key={alert.student.id}
                                    className="flex items-center justify-between bg-white rounded-lg p-3 border border-orange-200"
                                >
                                    <div>
                                        <p className="font-medium text-gray-800 text-sm">
                                            {alert.student.full_name || alert.student.login_id}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {alert.lastLogDate
                                                ? `最終: ${formatDateJP(alert.lastLogDate)}`
                                                : "記録なし"}
                                        </p>
                                    </div>
                                    <span className="text-xs font-medium px-2 py-1 bg-orange-100 text-orange-700 rounded">
                                        {alert.daysWithoutLog}日
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 提出物を忘れた生徒 */}
                {forgotAlerts.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <FileX className="w-4 h-4 text-red-500" />
                            提出物忘れ ({forgotAlerts.length}名)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {forgotAlerts.map((alert) => (
                                <div
                                    key={`forgot-${alert.student.id}`}
                                    className="flex items-center justify-between bg-white rounded-lg p-3 border border-red-200"
                                >
                                    <p className="font-medium text-gray-800 text-sm">
                                        {alert.student.full_name || alert.student.login_id}
                                    </p>
                                    <span className="text-xs font-medium px-2 py-1 bg-red-100 text-red-700 rounded">
                                        忘れ
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ワークが遅れている生徒 */}
                {behindAlerts.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <BookX className="w-4 h-4 text-purple-500" />
                            ワーク進捗遅れ ({behindAlerts.length}名)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {behindAlerts.map((alert) => (
                                <div
                                    key={`behind-${alert.student.id}`}
                                    className="flex items-center justify-between bg-white rounded-lg p-3 border border-purple-200"
                                >
                                    <div>
                                        <p className="font-medium text-gray-800 text-sm">
                                            {alert.student.full_name || alert.student.login_id}
                                        </p>
                                        {alert.pagesBehind && (
                                            <p className="text-xs text-gray-500">
                                                {alert.pagesBehind}ページ遅れ
                                            </p>
                                        )}
                                    </div>
                                    <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-700 rounded">
                                        遅れ
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
