'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/mistap/supabaseClient';
import Background from '@/components/mistap/Background';
import MistapFooter from '@/components/mistap/Footer';
import { useAuth } from '@/context/AuthContext';
import { Plus, Trash2, BookOpen, Search, ArrowLeft, Lock } from 'lucide-react';

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
    const [showAddModal, setShowAddModal] = useState(false);
    const [newWord, setNewWord] = useState('');
    const [newMeaning, setNewMeaning] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/mistap');
            return;
        }

        if (user) {
            fetchWords();
        }
    }, [user, loading, router]);

    const fetchWords = async () => {
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
    };

    const handleAddWord = async () => {
        if (!newWord.trim()) return;
        if (!profile?.is_pro) {
            // Should not happen if UI is blocked, but double check
            alert('Proプランへのアップグレードが必要です。');
            return;
        }

        setIsSaving(true);
        const { error } = await supabase.from('mistap_word_stocks').insert({
            user_id: user?.id,
            word: newWord.trim(),
            meaning: newMeaning.trim() || null,
        });

        if (error) {
            alert('保存に失敗しました。');
        } else {
            setNewWord('');
            setNewMeaning('');
            setShowAddModal(false);
            fetchWords();
        }
        setIsSaving(false);
    };

    const handleDeleteWord = async (id: string) => {
        if (!confirm('この単語を削除しますか？')) return;

        const { error } = await supabase
            .from('mistap_word_stocks')
            .delete()
            .eq('id', id);

        if (!error) {
            setWords(words.filter(w => w.id !== id));
        } else {
            alert('削除に失敗しました。');
        }
    };

    const handleStartTest = () => {
        if (words.length === 0) {
            alert('まずは単語を登録しましょう！');
            return;
        }

        const count = Math.min(words.length, 10); // Default to 10 or max available
        router.push(`/mistap/test?mode=word-stock&count=${count}`);
    };

    const filteredWords = words.filter(w =>
        w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (w.meaning && w.meaning.includes(searchQuery))
    );

    if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">読み込み中...</div>;

    // Non-Pro user view (Access blocked or limited preview?)
    // User requested authorized feature. Let's show upgrade prompt if not Pro.
    if (!profile?.is_pro) {
        return (
            <main className="min-h-screen bg-gray-50 flex flex-col">
                <Background className="flex-grow flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Lock className="w-8 h-8 text-red-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Proプラン限定機能</h1>
                        <p className="text-gray-600 mb-8">
                            「育てる単語帳 Word Stock」はProプラン限定の機能です。<br />
                            あなただけの単語帳を作って効率的に学習しましょう！
                        </p>
                        <button
                            onClick={() => router.push('/upgrade')}
                            className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                        >
                            Proプランにアップグレード
                        </button>
                        <button
                            onClick={() => router.back()}
                            className="mt-4 text-gray-500 hover:text-gray-800 text-sm"
                        >
                            戻る
                        </button>
                    </div>
                </Background>
                <MistapFooter />
            </main>
        );
    }

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
                        </div>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold p-4 flex items-center justify-center gap-2 shadow-md transition-all"
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
                                <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between group">
                                    <div>
                                        <p className="font-bold text-lg text-gray-900">{item.word}</p>
                                        {item.meaning && <p className="text-gray-600 text-sm">{item.meaning}</p>}
                                    </div>
                                    <button
                                        onClick={() => handleDeleteWord(item.id)}
                                        className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
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

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h2 className="text-xl font-bold mb-6">単語を追加</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">単語 <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={newWord}
                                    onChange={(e) => setNewWord(e.target.value)}
                                    placeholder="例: apple"
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">意味</label>
                                <input
                                    type="text"
                                    value={newMeaning}
                                    onChange={(e) => setNewMeaning(e.target.value)}
                                    placeholder="例: りんご"
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors"
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={handleAddWord}
                                disabled={!newWord.trim() || isSaving}
                                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? '保存中...' : '追加する'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <MistapFooter />
        </main>
    );
}
