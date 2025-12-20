import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'ログイン',
    description: 'EduLensアカウントにログインまたは新規登録',
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
