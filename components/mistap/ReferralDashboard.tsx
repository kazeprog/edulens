'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/mistap/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { Copy, Check, Users, Gift, Share2 } from 'lucide-react';

export default function ReferralDashboard() {
    const { user } = useAuth();
    const [referralCode, setReferralCode] = useState<string | null>(null);
    const [invitedCount, setInvitedCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [referralEnabled, setReferralEnabled] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchReferralData = async () => {
            try {
                // Check campaign status first
                const { data: config } = await supabase
                    .from('app_config')
                    .select('value')
                    .eq('key', 'referral_campaign_enabled')
                    .single();

                if (config) {
                    setReferralEnabled(config.value as boolean);
                    if (config.value === false) return; // Stop fetching if disabled
                }

                // 1. Ensure/Get Code
                const { data: codeData, error: codeError } = await supabase.rpc('ensure_referral_code');
                if (!codeError && codeData) {
                    setReferralCode(codeData);
                }

                // 2. Get Count
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('invited_count')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    setInvitedCount(profile.invited_count || 0);
                }
            } catch (err) {
                console.error('Referral fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchReferralData();
    }, [user]);

    const handleCopy = async () => {
        if (!referralCode) {
            return;
        }
        // Link leads to LP, stores code, then redirects to signup
        const url = `${window.location.origin}/mistap?ref=${referralCode}&signup=1`;

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(url);
            } else {
                // Fallback for non-secure context (e.g. dev http)
                const textArea = document.createElement("textarea");
                textArea.value = url;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                textArea.style.top = "0";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                } catch (err) {
                    console.error('Fallback copy failed', err);
                    alert('リンクのコピーに失敗しました。URLを手動でコピーしてください:\n' + url);
                    return;
                }
                document.body.removeChild(textArea);
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed', err);
            alert('リンクのコピーに失敗しました。');
        }
    };

    const handleShare = async () => {
        if (!referralCode) return;
        const url = `${window.location.origin}/mistap?ref=${referralCode}&signup=1`;
        const text = `Mistapで一緒に勉強しよう！招待リンクから登録してね。 #Mistap`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Mistap 招待',
                    text: text,
                    url: url,
                });
            } catch (err) {
                // ignore share abort
            }
        } else {
            // Fallback
            handleCopy();
        }
    };

    if (loading) return <div className="animate-pulse h-32 bg-slate-100 rounded-xl"></div>;

    if (!referralEnabled) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-2">キャンペーン終了</h3>
                <p className="text-slate-500 text-sm">
                    友達招待キャンペーンは現在実施しておりません。<br />
                    次回の開催をお楽しみに！
                </p>
            </div>
        );
    }

    const nextGoal = Math.ceil((invitedCount + 1) / 3) * 3;
    const currentProgress = invitedCount % 3;
    // If invitedCount is 0, nextGoal is 3. Progress 0/3.
    // If invitedCount is 1, nextGoal is 3. Progress 1/3.
    // If invitedCount is 3, nextGoal is 6. Progress 0/3 (Reset visually for next cycle or show accumulated?)
    // Let's show "Current Cycle: X / 3"

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-4 text-white">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <Gift className="w-5 h-5" />
                    友達招待キャンペーン
                </h3>
                <p className="text-red-100 text-sm mt-1">
                    友達が10回テストするとカウント！3人でProプラン1ヶ月無料！
                </p>
            </div>

            <div className="p-6">
                {/* Stats */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="text-sm text-slate-500 font-medium mb-1">現在の招待人数</div>
                        <div className="text-3xl font-bold text-slate-800 flex items-baseline gap-2">
                            {invitedCount}
                            <span className="text-sm text-slate-400 font-normal">人</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-slate-500 font-medium mb-1">次の特典まで</div>
                        <div className="text-xl font-bold text-red-600">
                            あと {3 - (invitedCount % 3)} 人
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-red-500 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${(currentProgress / 3) * 100}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium">
                        <span>0人</span>
                        <span>1人</span>
                        <span>2人</span>
                        <span>3人 (GET!)</span>
                    </div>
                </div>

                {/* Code Area */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex flex-col items-center">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        あなたの招待コード
                    </div>
                    <div onClick={handleCopy} className="text-2xl font-mono font-bold text-slate-800 tracking-widest cursor-pointer hover:opacity-70 transition-opacity mb-3">
                        {referralCode || '読み込み中...'}
                    </div>

                    <div className="flex w-full gap-3">
                        <button
                            onClick={handleCopy}
                            disabled={!referralCode}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'コピーしました' : '招待リンクをコピー'}
                        </button>
                        <button
                            onClick={handleShare}
                            disabled={!referralCode}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-rose-600 rounded-lg text-sm font-bold text-white hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Share2 className="w-4 h-4" />
                            シェアする
                        </button>
                    </div>
                </div>

                <div className="mt-4 text-xs text-slate-400 leading-relaxed text-center">
                    注意: 招待された方がアカウント登録し、<span className="font-bold text-slate-500">小テストを10回完了</span>した時点でカウントされます。
                </div>
            </div>
        </div>
    );
}
