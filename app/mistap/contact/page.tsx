'use client';

import { useState } from 'react';
import Background from '@/components/mistap/Background';
import Link from 'next/link';
import { supabase } from '@/lib/mistap/supabaseClient';
import MistapFooter from '@/components/mistap/Footer';
import { useAuth } from '@/context/AuthContext';

export default function ContactPage() {
  // document.title removed for server-side metadata
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'textbook-request',
    textbookName: '',
    publisher: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Supabaseに保存
      const { error: insertError } = await supabase
        .from('contact_requests')
        .insert([
          {
            user_id: user?.id ?? null,
            name: formData.name,
            email: formData.email,
            category: formData.category,
            textbook_name: formData.category === 'textbook-request' ? formData.textbookName : null,
            publisher: formData.category === 'textbook-request' ? formData.publisher : null,
            message: formData.message,
          }
        ]);

      if (insertError) {
        throw insertError;
      }

      setSubmitted(true);
    } catch (err) {
      console.error('送信エラー:', err);
      setError('送信に失敗しました。しばらくしてからもう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Background>
        <div className="min-h-screen pt-20">
          <div className="max-w-2xl mx-auto px-4 py-16">
            <div className="bg-white/40 backdrop-blur-lg rounded-xl p-8 shadow-xl border border-white/50 text-center">
              <div className="text-6xl mb-6">✅</div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                お問い合わせありがとうございます
              </h1>
              <p className="text-gray-700 mb-8 leading-relaxed">
                {formData.category === 'textbook-request'
                  ? `「${formData.textbookName}」のリクエストを受け付けました。検討させていただき、対応可能な場合は今後のアップデートで追加いたします。`
                  : 'お問い合わせ内容を確認し、必要に応じてご連絡いたします。'
                }
              </p>
              <div className="space-y-4">
                <Link
                  href="/mistap/test-setup"
                  prefetch={false}
                  className="block bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  テスト作成に戻る
                </Link>
                <Link
                  href="/mistap"
                  prefetch={false}
                  className="block text-gray-600 hover:text-gray-800"
                >
                  ホームに戻る
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Background>
    );
  }

  return (
    <Background>
      <main className="min-h-screen pt-20">
        <div className="max-w-2xl mx-auto px-4 py-8 md:py-16">
          <div className="bg-white/40 backdrop-blur-lg rounded-xl p-6 md:p-8 shadow-xl border border-white/50">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
              お問い合わせ
            </h1>

            <div className="mb-8 text-center bg-white/50 rounded-lg p-4 border border-white/60">
              <p className="text-sm text-gray-600 mb-1">メールでのお問い合わせはこちら</p>
              <a href="mailto:mistap.edulens@gmail.com" className="text-red-600 font-bold hover:underline">
                mistap.edulens@gmail.com
              </a>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* お問い合わせ種別 */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  お問い合わせ種別 <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="textbook-request">📚 単語帳の追加リクエスト</option>
                  <option value="bug-report">🐛 不具合の報告</option>
                  <option value="feature-request">💡 機能の要望</option>
                  <option value="other">❓ その他</option>
                </select>
              </div>

              {/* 単語帳リクエスト専用フィールド */}
              {formData.category === 'textbook-request' && (
                <>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      リクエストする単語帳名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="textbookName"
                      value={formData.textbookName}
                      onChange={handleChange}
                      placeholder="例：DUO 3.0、速読英単語 必修編"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required={formData.category === 'textbook-request'}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      出版社名
                    </label>
                    <input
                      type="text"
                      name="publisher"
                      value={formData.publisher}
                      onChange={handleChange}
                      placeholder="例：旺文社、Z会"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              {/* お名前 */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  お名前 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="山田太郎"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              {/* メールアドレス */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              {/* メッセージ */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  {formData.category === 'textbook-request' ? '追加の詳細・理由など' : 'お問い合わせ内容'}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder={
                    formData.category === 'textbook-request'
                      ? '学校で使用している教材で、ぜひ対応していただきたいです。多くの生徒が使っているので需要があると思います。'
                      : 'お問い合わせ内容を具体的にお聞かせください。'
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-y"
                  required
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                  {error}
                </div>
              )}

              {/* 送信ボタン */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                {isSubmitting ? '送信中...' : '送信する'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                📚 単語帳リクエストについて
              </h3>
              <div className="text-sm text-gray-600 space-y-2 leading-relaxed">
                <p>• 学校や塾で使用されている教材を優先的に検討いたします</p>
                <p>• 著作権の関係で対応できない場合があります</p>
                <p>• 実装時期は未定ですが、需要の高い教材から順次対応予定です</p>
                <p>• 同じ教材へのリクエストが多いほど優先度が上がります</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <MistapFooter />
    </Background>
  );
}
