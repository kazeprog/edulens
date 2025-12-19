import Link from 'next/link';
import Image from 'next/image';

export default function SiteHeader() {
    return (
        <header className="w-full py-4 px-0 flex items-center justify-start sticky top-0 bg-white/80 backdrop-blur-sm z-50">
            <Link href="/" className="w-48 h-12 block hover:opacity-80 transition-opacity relative">
                <Image
                    src="/logo.png"
                    alt="EduLens"
                    fill
                    className="object-contain"
                    priority
                />
            </Link>
        </header>
    );
}
