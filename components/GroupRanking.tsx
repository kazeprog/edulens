'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserGroups, getGroupRanking, getOverallRanking, createGroup, updateGroup } from '@/lib/mistap/group';
import type { Group, RankingEntry } from '@/types/group';

export default function GroupRanking() {
    const { user } = useAuth();
    const [groups, setGroups] = useState<Group[]>([]);
    const [activeTab, setActiveTab] = useState<number | 'all'>('all');
    const [ranking, setRanking] = useState<RankingEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [groupsLoaded, setGroupsLoaded] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [editGroupName, setEditGroupName] = useState('');
    const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const hasFetchedGroups = useRef(false);

    // グループ一覧を取得（一度だけ）
    useEffect(() => {
        if (!user?.id || hasFetchedGroups.current) return;

        hasFetchedGroups.current = true;

        const fetchGroups = async () => {
            try {
                const userGroups = await getUserGroups(user.id);
                setGroups(userGroups);
            } catch (error) {
                console.error('Failed to fetch groups:', error);
            } finally {
                setGroupsLoaded(true);
                setLoading(false);
            }
        };

        fetchGroups();
    }, [user?.id]);

    // ランキングを取得（タブ変更時）
    useEffect(() => {
        if (!user?.id || !groupsLoaded) return;

        const fetchRanking = async () => {
            setLoading(true);
            try {
                let rankingData: RankingEntry[];

                if (activeTab === 'all') {
                    rankingData = await getOverallRanking(user.id);
                } else {
                    rankingData = await getGroupRanking(activeTab);
                }

                setRanking(rankingData);
            } catch (error) {
                console.error('Failed to fetch ranking:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRanking();
    }, [user?.id, activeTab, groupsLoaded]);

    // グループ作成
    const handleCreateGroup = async () => {
        if (!user || !newGroupName.trim()) return;

        setCreating(true);
        const newGroup = await createGroup(newGroupName.trim(), user.id);

        if (newGroup) {
            setGroups(prev => [...prev, newGroup]);
            setNewGroupName('');
            setShowCreateModal(false);
        }
        setCreating(false);
    };

    // 編集モーダルを開く
    const openEditModal = (group: Group) => {
        setEditingGroupId(group.id);
        setEditGroupName(group.name);
        setShowEditModal(true);
    };

    // グループ名を更新
    const handleEditGroup = async () => {
        if (!editingGroupId || !editGroupName.trim()) return;

        setUpdating(true);
        const updatedGroup = await updateGroup(editingGroupId, editGroupName.trim());

        if (updatedGroup) {
            setGroups(prev => prev.map(g =>
                g.id === editingGroupId ? updatedGroup : g
            ));
            setShowEditModal(false);
            setEditingGroupId(null);
            setEditGroupName('');
        }
        setUpdating(false);
    };

    // 招待リンクをコピー（フォールバック付き）
    const copyInviteLink = async (inviteCode: string) => {
        const url = `${window.location.origin}/mistap/join/${inviteCode}`;

        try {
            // 標準のClipboard APIを試す
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(url);
            } else {
                // フォールバック: execCommandを使用
                const textArea = document.createElement('textarea');
                textArea.value = url;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            setCopiedCode(inviteCode);
            setTimeout(() => setCopiedCode(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            // エラー時はURLをalertで表示
            alert(`招待リンク: ${url}`);
        }
    };

    // ランクに応じた背景色
    const getRankStyle = (rank: number) => {
        switch (rank) {
            case 1:
                return 'bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-300';
            case 2:
                return 'bg-gradient-to-r from-gray-100 to-slate-100 border-gray-300';
            case 3:
                return 'bg-gradient-to-r from-orange-100 to-amber-50 border-orange-300';
            default:
                return 'bg-white border-gray-100';
        }
    };

    // ランクに応じたメダル
    const getRankMedal = (rank: number) => {
        switch (rank) {
            case 1:
                return '🥇';
            case 2:
                return '🥈';
            case 3:
                return '🥉';
            default:
                return null;
        }
    };

    // グループがない場合
    if (!loading && groups.length === 0) {
        return (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </span>
                    グループランキング
                </h2>

                <div className="text-center py-8">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">グループに参加しよう</h3>
                    <p className="text-gray-500 mb-6 max-w-xs mx-auto">
                        グループに参加すると、メンバーとランキングで競い合えます
                    </p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                    >
                        グループを作成する
                    </button>
                </div>

                {/* グループ作成モーダル */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">新しいグループを作成</h3>
                            <input
                                type="text"
                                placeholder="グループ名（例: 2年2組）"
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors"
                                >
                                    キャンセル
                                </button>
                                <button
                                    onClick={handleCreateGroup}
                                    disabled={!newGroupName.trim() || creating}
                                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white py-3 rounded-xl font-medium transition-colors"
                                >
                                    {creating ? '作成中...' : '作成'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8">
            {/* ヘッダー */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </span>
                    グループランキング
                </h2>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    作成
                </button>
            </div>

            {/* タブ */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide -mx-2 px-2">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'all'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    全体
                </button>
                {groups.map((group) => (
                    <button
                        key={group.id}
                        onClick={() => setActiveTab(group.id)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === group.id
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {group.name}
                    </button>
                ))}
            </div>

            {/* グループ設定（個別グループ選択時） */}
            {/* グループ設定（個別グループ選択時） */}
            {activeTab !== 'all' && (() => {
                const currentGroup = groups.find(g => g.id === activeTab);
                const isOwner = currentGroup?.owner_id === user?.id;

                return (
                    <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-3 mb-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <p className="text-base font-bold text-gray-900 truncate">{currentGroup?.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            {/* 招待リンクボタン */}
                            <button
                                onClick={() => {
                                    if (currentGroup) copyInviteLink(currentGroup.invite_code);
                                }}
                                className={`
                                    px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm
                                    ${copiedCode === currentGroup?.invite_code
                                        ? 'bg-green-50 text-green-700 border border-green-200'
                                        : 'bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200'
                                    }
                                `}
                            >
                                {copiedCode === currentGroup?.invite_code ? (
                                    <>
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        コピー
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                        招待
                                    </>
                                )}
                            </button>

                            {/* 名前変更ボタン（オーナーのみ） */}
                            {isOwner && currentGroup && (
                                <button
                                    onClick={() => openEditModal(currentGroup)}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                    title="グループ名を編集"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                );
            })()}

            {/* ランキングリスト */}
            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="relative">
                        <div className="w-10 h-10 border-4 border-gray-200 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-10 h-10 border-4 border-transparent border-t-red-600 rounded-full animate-spin"></div>
                    </div>
                </div>
            ) : ranking.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">まだランキングデータがありません</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {ranking.slice(0, 10).map((entry) => (
                        <div
                            key={entry.user_id}
                            className={`flex items-center gap-4 p-4 rounded-xl border ${getRankStyle(entry.rank)} ${entry.user_id === user?.id ? 'ring-2 ring-red-500' : ''
                                }`}
                        >
                            {/* 順位 */}
                            <div className="w-10 text-center">
                                {getRankMedal(entry.rank) ? (
                                    <span className="text-2xl">{getRankMedal(entry.rank)}</span>
                                ) : (
                                    <span className="text-lg font-bold text-gray-400">{entry.rank}</span>
                                )}
                            </div>

                            {/* ユーザー情報 */}
                            <div className="flex-1 min-w-0">
                                <p className={`font-semibold truncate ${entry.user_id === user?.id ? 'text-red-600' : 'text-gray-900'
                                    }`}>
                                    {entry.full_name || '名前未設定'}
                                    {entry.user_id === user?.id && (
                                        <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                                            あなた
                                        </span>
                                    )}
                                </p>
                            </div>

                            {/* スコア */}
                            <div className="text-right">
                                <span className="text-xl font-bold text-gray-900">{entry.test_count}</span>
                                <span className="text-sm text-gray-500 ml-1">回</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* グループ作成モーダル */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">新しいグループを作成</h3>
                        <input
                            type="text"
                            placeholder="グループ名（例: 2年2組）"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors"
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={handleCreateGroup}
                                disabled={!newGroupName.trim() || creating}
                                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white py-3 rounded-xl font-medium transition-colors"
                            >
                                {creating ? '作成中...' : '作成'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* グループ編集モーダル */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">グループ名を変更</h3>
                        <input
                            type="text"
                            placeholder="新しいグループ名"
                            value={editGroupName}
                            onChange={(e) => setEditGroupName(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditingGroupId(null);
                                    setEditGroupName('');
                                }}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors"
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={handleEditGroup}
                                disabled={!editGroupName.trim() || updating}
                                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white py-3 rounded-xl font-medium transition-colors"
                            >
                                {updating ? '更新中...' : '変更'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
