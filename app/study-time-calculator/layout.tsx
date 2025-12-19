import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export default function StudyTimeCalculatorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <SiteHeader />
            <main>
                {children}
            </main>
            <SiteFooter />
        </>
    );
}
