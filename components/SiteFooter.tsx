import Link from 'next/link';

export default function SiteFooter() {
    return (
        <footer className="w-full py-8 text-center border-t border-slate-100 bg-slate-50">
            <nav className="flex flex-wrap justify-center gap-6 mb-4 text-sm text-slate-500">
                <Link href="/terms" prefetch={false} className="hover:text-slate-800 hover:underline">利用規約</Link>
                <Link href="/privacy" prefetch={false} className="hover:text-slate-800 hover:underline">プライバシーポリシー</Link>
                <Link href="/contact" prefetch={false} className="hover:text-slate-800 hover:underline">お問い合わせ</Link>
                <Link href="/legal/tokusho" prefetch={false} className="hover:text-slate-800 hover:underline">特定商取引法に基づく表記</Link>
                <Link href="/operator" prefetch={false} className="hover:text-slate-800 hover:underline">運営者情報</Link>
            </nav>
            <div className="space-y-2">
                <p className="text-xs text-slate-400">
                    &copy; {new Date().getFullYear()} EduLens
                </p>
                <p className="text-xs text-slate-400">
                    Amazonのアソシエイトとして、EduLensは適格販売により収入を得ています。
                </p>
            </div>
        </footer>
    );
}
