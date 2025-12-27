import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'お問い合わせ',
    description: 'Mistapに関するお問い合わせ、機能追加の要望、不具合の報告、対応単語帳のリクエストなどを受け付けています。',
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
