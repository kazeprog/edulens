import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export default function ContactLayout({
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
