import Link from 'next/link';

export default function MistapFooter() {
    return (
        <footer className="w-full py-8 text-center border-t border-red-100 bg-gradient-to-b from-white to-red-50/30">
            <nav className="flex flex-wrap justify-center gap-6 mb-4 text-sm text-gray-500">
                <Link href="/terms" className="hover:text-red-600 hover:underline transition-colors">利用規約</Link>
                <Link href="/privacy" className="hover:text-red-600 hover:underline transition-colors">プライバシーポリシー</Link>
                <Link href="/mistap/contact" className="hover:text-red-600 hover:underline transition-colors">お問い合わせ</Link>
                <Link href="/mistap/blog" className="hover:text-red-600 hover:underline transition-colors">ブログ</Link>
                <Link href="/mistap/about" className="hover:text-red-600 hover:underline transition-colors">Mistapとは</Link>
                <Link href="/operator" className="hover:text-red-600 hover:underline transition-colors">運営者情報</Link>
            </nav>
            <div className="space-y-2">
                <p className="text-xs text-gray-400">
                    &copy; {new Date().getFullYear()} EduLens - Mistap
                </p>
                <p className="text-xs text-gray-400">
                    Amazonのアソシエイトとして、EduLensは適格販売により収入を得ています。
                </p>
            </div>
        </footer>
    );
}
