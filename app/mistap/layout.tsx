'use client';

import ClientHeader from '@/components/mistap/ClientHeader';
import AddToHomePrompt from '@/components/mistap/AddToHomePrompt';

export default function MistapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ClientHeader />
      <AddToHomePrompt />
      {children}
    </>
  );
}