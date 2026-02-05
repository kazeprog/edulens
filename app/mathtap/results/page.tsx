import MathResultsContent from '@/components/mathtap/MathResultsContent';
import Background from '@/components/mistap/Background';
import MistapFooter from '@/components/mistap/Footer';
import { Suspense } from 'react';

export const metadata = {
    title: 'Mathtap - テスト結果',
};

export default function MathtapResultsPage() {
    return (
        <main className="min-h-screen flex flex-col">
            <Background className="flex justify-center items-start min-h-screen p-4 flex-grow bg-slate-900">
                <Suspense fallback={<div className="text-center text-white p-10">Loading...</div>}>
                    <MathResultsContent />
                </Suspense>
            </Background>
            <MistapFooter />
        </main>
    );
}
