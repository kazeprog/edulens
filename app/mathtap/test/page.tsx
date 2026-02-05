import MathTestContent from '@/components/mathtap/MathTestContent';
import { Suspense } from 'react';

export const metadata = {
    title: 'Mathtap - テスト中',
};

export default function MathtapTestPage() {
    return (
        <Suspense fallback={<div className="text-center text-white p-10">Loading...</div>}>
            <MathTestContent />
        </Suspense>
    );
}
