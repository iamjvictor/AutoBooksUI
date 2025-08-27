// src/app/dashboard/DashboardClient.tsx
"use client";

import React from 'react';
import { AlertTriangle, DollarSign, MessageCircle, CalendarDays, Lock, BedDouble, FileText, Phone, Calendar } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/clients/supabaseClient';
import { useUser } from '@/context/UserContext';

// Supondo que 'profile' tenha a estrutura da sua tabela de perfis
export default  function DashboardClient() {
  const { userData, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>No user data found</div>;
  }

  const { profile } = userData;




  const isOnboardingComplete = profile.status === 'active';
  

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">
          Bem-vindo de volta, {profile.full_name}!
        </h1>

        {/* --- BANNER DE ONBOARDING --- */}
        {!isOnboardingComplete && (
          <div className="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 mt-0.5" />
              <div className="ml-3">
                <h2 className="font-semibold">Quase lá! Complete sua configuração.</h2>
                <p className="text-sm">Finalize as etapas abaixo para ativar seu assistente de IA.</p>
                 <ul className="list-disc list-inside mt-2 text-sm">
                    {profile.status === 'onboarding_pdf' && <li>Enviar PDF de informações</li>}
                    {profile.status === 'onboarding_rooms' && <li>Cadastrar acomodações</li>}
                 </ul>
              </div>
            </div>
          </div>
        )}

        {/* --- CARDS DE KPI (MÉTRICAS) --- */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Saldo (Stripe)</p>
              <DollarSign className="h-6 w-6 text-gray-400" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">R$ 0,00</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Conversas no Mês</p>
              <MessageCircle className="h-6 w-6 text-gray-400" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Reservas no Mês</p>
              <CalendarDays className="h-6 w-6 text-gray-400" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
          </div>
        </div>
        
        {/* --- CARDS DE AÇÕES PRINCIPAIS --- */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Conecte seus Canais</h3>
                <p className="text-sm text-gray-500 mt-1">Conecte para automatizar o atendimento.</p>
                <button disabled={!isOnboardingComplete} className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2 bg-teal-600 text-white rounded-md font-semibold transition-colors hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
                    <Phone className="h-5 w-5" />
                    Conectar WhatsApp
                    {!isOnboardingComplete && <Lock className="h-4 w-4 ml-2" />}
                </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Integre sua Agenda</h3>
                <p className="text-sm text-gray-500 mt-1">Sincronize com sua agenda para reservas.</p>
                <button disabled={!isOnboardingComplete} className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2 bg-teal-600 text-white rounded-md font-semibold transition-colors hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
                    <Calendar className="h-5 w-5" />
                    Conectar com Google Agenda
                    {!isOnboardingComplete && <Lock className="h-4 w-4 ml-2" />}
                </button>
            </div>
        </div>

        {/* --- CARDS DE GERENCIAMENTO --- */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
             <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Gerenciar Acomodações</h3>
                <p className="text-sm text-gray-500 mt-1">Configure e gerencie seus quartos e acomodações.</p>
                <Link href="/onboarding/rooms" className="mt-4 block text-center w-full px-4 py-2 bg-white text-teal-700 border border-teal-600 rounded-md font-semibold hover:bg-teal-50">
                    Editar Quartos
                </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Base de Conhecimento</h3>
                <p className="text-sm text-gray-500 mt-1">Gerencie os documentos e informações do seu negócio.</p>
                <Link href="/onboarding/pdf" className="mt-4 block text-center w-full px-4 py-2 bg-white text-teal-700 border border-teal-600 rounded-md font-semibold hover:bg-teal-50">
                    Gerenciar PDFs
                </Link>
            </div>
        </div>

      </div>
    </div>
  );
}