'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/mistap/supabaseClient';

interface ContactRequest {
    id: number;
    created_at: string;
    name: string;
    email: string;
    category: string;
    textbook_name?: string;
    publisher?: string;
    message: string;
}

export default function AdminContactsPage() {
    const [requests, setRequests] = useState<ContactRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('contact_requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching contact requests:', error);
        } else {
            setRequests(data || []);
        }
        setLoading(false);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('ja-JP');
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">お問い合わせ一覧</h2>
                <button
                    onClick={fetchRequests}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm transition"
                >
                    更新
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : requests.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
                    <p className="text-slate-500">お問い合わせはありません</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-slate-700 whitespace-nowrap">日時</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 whitespace-nowrap">種別</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 whitespace-nowrap">名前 / メール</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700">内容</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {requests.map((req) => (
                                    <tr key={req.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4 text-slate-500 whitespace-nowrap align-top">
                                            {formatDate(req.created_at)}
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${req.category === 'textbook-request' ? 'bg-blue-100 text-blue-700' :
                                                    req.category === 'bug-report' ? 'bg-red-100 text-red-700' :
                                                        req.category === 'feature-request' ? 'bg-green-100 text-green-700' :
                                                            'bg-slate-100 text-slate-700'
                                                }`}>
                                                {req.category === 'textbook-request' ? '📚 教材リクエスト' :
                                                    req.category === 'bug-report' ? '🐛 不具合報告' :
                                                        req.category === 'feature-request' ? '💡 機能要望' :
                                                            '❓ その他'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <p className="font-medium text-slate-800">{req.name}</p>
                                            <p className="text-slate-500 text-xs mt-0.5">{req.email}</p>
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            {req.category === 'textbook-request' && (
                                                <div className="mb-2 p-2 bg-slate-50 rounded border border-slate-100">
                                                    <p className="text-xs font-bold text-slate-700">希望教材:</p>
                                                    <p className="text-sm text-slate-800">{req.textbook_name}</p>
                                                    {req.publisher && (
                                                        <p className="text-xs text-slate-500 mt-1">({req.publisher})</p>
                                                    )}
                                                </div>
                                            )}
                                            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                                                {req.message}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
