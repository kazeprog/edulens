'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/mistap/supabaseClient';

interface NaruhodoLogWithUser {
    id: string;
    created_at: string;
    has_image: boolean;
    is_pro: boolean;
    user_id: string | null;
    guest_id: string | null;
    user_name?: string;

    ip_hash?: string;
}

export default function NaruhodoLogsPage() {
    const [logs, setLogs] = useState<NaruhodoLogWithUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLogs() {
            setLoading(true);
            try {
                // Fetch logs
                const { data: rawLogs, error } = await supabase
                    .from('naruhodo_usage_logs')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(50);

                if (error) throw error;

                if (rawLogs) {
                    setLogs(rawLogs as any);
                }
            } catch (err) {
                console.error('Failed to fetch logs:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchLogs();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-slate-800">ナルホドレンズ履歴</h2>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3 font-medium">日時</th>
                                <th className="px-6 py-3 font-medium">ユーザー</th>
                                <th className="px-6 py-3 font-medium">ステータス</th>
                                <th className="px-6 py-3 font-medium">IPハッシュ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400">読み込み中...</td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400">履歴がありません</td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-3 text-slate-600 whitespace-nowrap">
                                            {formatDate(log.created_at)}
                                        </td>
                                        <td className="px-6 py-3">
                                            {log.user_id ? (
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-800">
                                                        {log.user_name || '名称未設定'}
                                                    </span>
                                                    <span className="text-xs text-slate-400 font-mono">
                                                        {log.user_id.substring(0, 8)}...
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col">
                                                    <span className="text-slate-500 italic">Guest</span>
                                                    <span className="text-xs text-slate-400 font-mono">
                                                        {log.guest_id ? `ID: ${log.guest_id.substring(0, 8)}` : '-'}
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex gap-2">
                                                {log.is_pro && (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                                                        PRO
                                                    </span>
                                                )}
                                                {log.has_image && (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                                                        IMG
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-xs text-slate-400 font-mono">
                                            {log.ip_hash ? log.ip_hash.substring(0, 10) + '...' : '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
