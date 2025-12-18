import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'お問い合わせ | EduLens',
    description: 'EduLensに関するお問い合わせはこちらからお願いします。',
};

export default function ContactPage() {
    return (
        <div className="min-h-[calc(100vh-80px)] bg-white py-12 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">お問い合わせ</h1>

                <p className="text-slate-600 mb-12 leading-relaxed">
                    当サイトに関するご意見、ご感想、不具合のご報告は、<br />
                    公式X (旧Twitter) アカウントよりご連絡ください。
                </p>

                <div className="space-y-6">
                    {/* Googleフォーム等が決まったらここにiframeを埋め込む */}
                    <a
                        href="https://twitter.com/EduLensjp"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-colors shadow-md"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                        公式X (@EduLensjp) へ連絡
                    </a>

                    <div className="text-sm text-slate-400 mt-8">
                        ※ 現在、試験日程の個別のご相談には対応しておりません。<br />
                        あらかじめご了承ください。
                    </div>
                </div>
            </div>
        </div>
    );
}
