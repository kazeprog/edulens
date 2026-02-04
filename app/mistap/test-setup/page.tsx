'use client';

import Background from "@/components/mistap/Background";
import MistapFooter from "@/components/mistap/Footer";
import TestSetupContent from "@/components/mistap/TestSetupContent";

export default function TestSetupPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Background className="flex justify-center items-start min-h-screen p-4 flex-grow">
        <TestSetupContent embedMode={true} />
      </Background>
      <MistapFooter />
    </main>
  );
}