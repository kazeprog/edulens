import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export default function TermsLayout({
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
