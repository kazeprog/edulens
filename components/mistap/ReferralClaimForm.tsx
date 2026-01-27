'use client';

import { useState } from 'react';
import { supabase } from '@/lib/mistap/supabaseClient';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function ReferralClaimForm({ onSuccess }: { onSuccess?: () => void }) {
    const [code, setCode] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;

        setStatus('loading');
        setMessage('');

        try {
            const { data, error } = await supabase.rpc('claim_referral_code', { p_code: code.trim() });

            if (error) throw error;

            if (data && data.success) {
                setStatus('success');
                setMessage('招待コードを適用しました！10回テストを達成して特典に貢献しましょう。');
                if (onSuccess) onSuccess();
            } else {
                setStatus('error');
                setMessage(data?.message || 'コードの適用に失敗しました');
            }
        } catch (err: any) {
            console.error(err);
            setStatus('error');
            setMessage(err.message || 'エラーが発生しました');
        }
    };

    if (status === 'success') {
        return (
            <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-start gap-3 border border-green-100">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm font-medium">{message}</div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="font-bold text-lg text-slate-800 mb-2">招待コードをお持ちですか？</h3>
            <p className="text-sm text-slate-500 mb-4">
                友達から招待された場合はコードを入力してください。
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="USER-XXXXXX"
                        disabled={status === 'loading'}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 uppercase"
                    />
                </div>

                {status === 'error' && (
                    <div className="text-red-500 text-sm flex items-center gap-1.5 bg-red-50 p-2 rounded-lg">
                        <AlertCircle className="w-4 h-4" />
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!code.trim() || status === 'loading'}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {status === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
                    適用する
                </button>
            </form>
        </div>
    );
}
