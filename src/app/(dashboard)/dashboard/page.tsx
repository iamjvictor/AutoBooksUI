"use client";

import React from 'react';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';
import DashboardClient from '@/components/layout/DashboardClient';

export default function DashboardPage() {
  // Pega os dados diretamente do UserProvider que está no layout.tsx
  const { userData, loading } = useUser();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Carregando seus dados...</div>;
  }
  if (!userData || !userData.profile) {
    return <div>Sessão não encontrada. <Link href="/login" className="underline">Faça o login.</Link></div>;
  }
  
  const { profile, rooms, documents } = userData;
  const isOnboardingComplete = profile.status === 'active';
  
  // AQUI COMEÇA O SEU JSX DO DASHBOARD QUE JÁ ESTÁ PRONTO
  return (
    <div className="p-4 sm:p-6 lg:p-8">
        <DashboardClient />
    </div>
  );
}