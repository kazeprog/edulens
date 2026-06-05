'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/mistap/supabaseClient';
import Background from '@/components/mistap/Background';
import MistapFooter from '@/components/mistap/Footer';
import { useAuth } from '@/context/AuthContext';
import { Plus, Trash2, BookOpen, Search, ArrowLeft, Pencil } from 'lucide-react';

const FREE_WORD_STOCK_LIMIT = 30;

interface WordStock {
    id: string;
    word: string;
    meaning: string | null;
    created_at: string;
}

export default function WordStockPage() {
    const router = useRouter();
    const { user, profile, loading } = useAuth();
    const [words, setWords] = useState<WordStock[]>([]);
    const [isLoadingWords, setIsLoadingWords] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [wordFormMode, setWordFormMode] = useState<'add' | 'edit' | null>(null);
    const [editingWord, setEditingWord] = useState<WordStock | null>(null);
    const [formWord, setFormWord] = useState('');
    const [formMeaning, setFormMeaning] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [deletingWordId, setDeletingWordId] = useState<string | null>(null);
    const isFreeLimitReached = !profile?.is_pro && words.length >= FREE_WORD_STOCK_LIMIT;
    const isWordFormOpen = wordFormMode !== null;

    const fetchWords = useCallback(async () => {
        if (!user) return;

        setIsLoadingWords(true);
        const { data, error } = await supabase
            .from('mistap_word_stocks')
            .select('*')
            .eq('user_id', user?.id)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setWords(data);
        }
        setIsLoadingWords(false);
    }, [user]);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/mistap');
            return;
        }

        if (user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchWords();
        }
    }, [user, loading, router, fetchWords]);

    const openAddModal = () => {
        if (isFreeLimitReached) {
            alert(`無料プランでは${FREE_WORD_STOCK_LIMIT}語まで登録できます。`);
            return;
        }

        setEditingWord(null);
        setFormWord('');
        setFormMeaning('');
        setWordFormMode('add');
    };

    const openEditModal = (item: WordStock) => {
        setEditingWord(item);
        setFormWord(item.word);
        setFormMeaning(item.meaning ?? '');
        setWordFormMode('edit');
    };

    const closeWordForm = () => {
        if (isSaving) return;

        setWordFormMode(null);
        setEditingWord(null);
        setFormWord('');
        setFormMeaning('');
    };

    const handleSubmitWord = async () => {
        if (!user || !formWord.trim() || !wordFormMode) return;

        if (wordFormMode === 'add' && isFreeLimitReached) {
            alert(`無料プランでは${FREE_WORD_STOCK_LIMIT}語まで登録できます。`);
            return;
        }

        const trimmedWord = formWord.trim();
        const trimmedMeaning = formMeaning.trim() || null;

        setIsSaving(true);

        if (wordFormMode === 'edit') {
            if (!editingWord) {
                setIsSaving(false);
                return;
            }

            const { error } = await supabase
                .from('mistap_word_stocks')
                .update({
                    word: trimmedWord,
                    meaning: trimmedMeaning,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', editingWord.id)
                .eq('user_id', user.id);

            if (error) {
                alert('更新に失敗しました。');
            } else {
                setWords((currentWords) =>
                    currentWords.map((item) =>
                        item.id === editingWord.id
                            ? { ...item, word: trimmedWord, meaning: trimmedMeaning }
                            : item
                    )
                );
                closeWordForm();
            }

            setIsSaving(false);
            return;
        }

        const { error } = await supabase.from('mistap_word_stocks').insert({
            user_id: user.id,
            word: trimmedWord,
            meaning: trimmedMeaning,
        });

        if (error) {
            alert('保存に失敗しました。');
        } else {
            closeWordForm();
            fetchWords();
        }

        setIsSaving(false);
    };

    const handleDeleteWord = async (item: WordStock) => {
        if (deletingWordId) return;
        if (!confirm(`「${item.word}」を削除しますか？`)) return;

        setDeletingWordId(item.id);

        const { error } = await supabase
            .from('mistap_word_stocks')
            .delete()
            .eq('id', item.id)
            .eq('user_id', user?.id);

        if (!error) {
            setWords((currentWords) => currentWords.filter(w => w.id !== item.id));
        } else {
            alert('削除に失敗しました。');
        }

        setDeletingWordId(null);
    };

    const handleStartTest = () => {
        if (words.length === 0) {
            alert('まずは単語を登録しましょう！');
            return;
        }

        const availableCount = profile?.is_pro ? words.length : Math.min(words.length, FREE_WORD_STOCK_LIMIT);
        const count = Math.min(availableCount, 10); // Default to 10 or max available
        router.push(`/mistap/test?mode=word-stock&count=${count}`);
    };

    const filteredWords = words.filter(w =>
        w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (w.meaning && w.meaning.includes(searchQuery))
    );

    if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">読み込み中...</div>;

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <Background className="flex-grow">
                <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-8" style={{ marginTop: '25px' }}>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => router.push('/mistap/home')}
                            className="p-2 rounded-full bg-white/50 hover:bg-white text-gray-700 transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Word Stock</h1>
                        <div className="w-10"></div> {/* Spacer for center alignment */}
                    </div>

                    {/* Stats & Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 flex flex-col justify-center">
                            <p className="text-gray-500 text-sm mb-1">ストック単語数</p>
                            <p className="text-4xl font-bold text-gray-900">{words.length}<span className="text-lg font-normal text-gray-400 ml-1">語</span></p>
                            {!profile?.is_pro && (
                                <p className="text-xs text-gray-500 mt-2">
                                    無料プランは{FREE_WORD_STOCK_LIMIT}語まで登録できます
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={openAddModal}
                                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold p-4 flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isFreeLimitReached}
                            >
                                <Plus className="w-5 h-5" />
                                単語を追加
                            </button>
                            <button
                                onClick={handleStartTest}
                                className="flex-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold p-4 flex items-center justify-center gap-2 shadow-sm transition-all"
                            >
                                <BookOpen className="w-5 h-5" />
                                テストする
                            </button>
                        </div>
                    </div>

                    {!profile?.is_pro && (
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-red-100 shadow-sm">
                            <p className="text-sm text-gray-700">
                                無料プランではWord Stockを{FREE_WORD_STOCK_LIMIT}語まで使えます。Proプランでは登録数の上限なく利用できます。
                            </p>
                            <button
                                onClick={() => router.push('/upgrademistap')}
                                className="mt-3 text-sm font-bold text-red-600 hover:text-red-700"
                            >
                                Proプランを見る
                            </button>
                        </div>
                    )}

                    {/* Search */}
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="単語や意味を検索..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-red-500 bg-white/90 backdrop-blur-sm"
                        />
                    </div>

                    {/* Word List */}
                    <div className="space-y-3">
                        {isLoadingWords ? (
                            <div className="text-center py-12 text-gray-500">読み込み中...</div>
                        ) : filteredWords.length > 0 ? (
                            filteredWords.map((item) => (
                                <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-start gap-3">
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-lg text-gray-900 break-words">{item.word}</p>
                                        {item.meaning && <p className="text-gray-600 text-sm break-words">{item.meaning}</p>}
                                    </div>
                                    <div className="flex shrink-0 items-center gap-1">
                                        <button
                                            onClick={() => openEditModal(item)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            aria-label={`${item.word}を編集`}
                                            title="編集"
                                        >
                                            <Pencil className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteWord(item)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                            disabled={deletingWordId === item.id}
                                            aria-label={`${item.word}を削除`}
                                            title="削除"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-500 bg-white/50 rounded-2xl border border-dashed border-gray-300">
                                {searchQuery ? '見つかりませんでした' : 'まだ単語がありません。\n「単語を追加」から登録しましょう！'}
                            </div>
                        )}
                    </div>
                </div>
            </Background>

            {/* Add/Edit Modal */}
            {isWordFormOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h2 className="text-xl font-bold mb-6">
                            {wordFormMode === 'edit' ? '単語を編集' : '単語を追加'}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">単語 <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={formWord}
                                    onChange={(e) => setFormWord(e.target.value)}
                                    placeholder="例: apple"
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">意味</label>
                                <input
                                    type="text"
                                    value={formMeaning}
                                    onChange={(e) => setFormMeaning(e.target.value)}
                                    placeholder="例: りんご"
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={closeWordForm}
                                disabled={isSaving}
                                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors"
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={handleSubmitWord}
                                disabled={!formWord.trim() || isSaving}
                                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? '保存中...' : (wordFormMode === 'edit' ? '更新する' : '追加する')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <MistapFooter />
        </main>
    );
}
