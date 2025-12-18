import Link from 'next/link';

type CategoryCardProps = {
    href: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: 'blue' | 'indigo' | 'emerald' | 'sky' | 'teal';
};

export default function CategoryCard({ href, title, description, icon, color }: CategoryCardProps) {
    // カラーマッピング
    const colorStyles = {
        blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'hover:border-blue-200', groupText: 'group-hover:text-blue-600' },
        indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'hover:border-indigo-200', groupText: 'group-hover:text-indigo-600' },
        emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'hover:border-emerald-200', groupText: 'group-hover:text-emerald-700' },
        sky: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'hover:border-sky-200', groupText: 'group-hover:text-sky-700' },
        teal: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'hover:border-teal-200', groupText: 'group-hover:text-teal-700' },
    };

    const s = colorStyles[color];

    return (
        <Link
            href={href}
            className={`group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-sm border border-slate-100 hover:shadow-md ${s.border} transition-all flex flex-row sm:flex-col items-center justify-start sm:justify-center text-left sm:text-center h-auto sm:h-64`}
        >
            <div className={`w-12 h-12 sm:w-16 sm:h-16 ${s.bg} ${s.text} rounded-full flex items-center justify-center mr-4 sm:mr-0 sm:mb-6 flex-shrink-0 group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <div>
                <h3 className={`text-base sm:text-xl font-bold text-slate-800 mb-1 sm:mb-2 ${s.groupText} transition-colors`}>{title}</h3>
                <p className="text-slate-400 text-xs sm:text-sm">{description}</p>
            </div>
            <div className="ml-auto sm:hidden text-slate-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
        </Link>
    );
}
