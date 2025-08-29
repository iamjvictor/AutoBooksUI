// src/app/dashboard/DashboardClient.tsx 
"use client";

import React from 'react';
import { AlertTriangle, DollarSign, MessageCircle, CalendarDays, Lock, Phone, Calendar } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/clients/supabaseClient';
import { useUser } from '@/context/UserContext';

// A função do componente agora é síncrona (sem 'async')
export default function DashboardClient() {
  const { userData, loading } = useUser();
  const supabase = createClient();

  // O handler do clique agora é uma função 'async'
  const handleConnectGoogleCalendar = async () => {
    console.log("Iniciando conexão com Google Agenda...");

    // 1. Pega a sessão do usuário de forma assíncrona
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      console.error('Erro ao buscar a sessão:', error?.message);
      alert('Não foi possível obter sua sessão. Por favor, faça o login novamente.');
      return; // Interrompe a execução se não houver sessão
    }

    const jwt = session.access_token;
    console.log("JWT recuperado com sucesso.");

    // 2. Constrói a URL de autorização do Google com o JWT no 'state'
    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      redirect_uri: `http://localhost:4000/api/auth/google/callback`,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/calendar',
      access_type: 'offline',
      prompt: 'consent',
      state: jwt, // Passa o JWT do usuário para o backend
    });

    // 3. Redireciona o usuário
    console.log("Redirecionando para o Google...");
    window.location.href = `${googleAuthUrl}?${params.toString()}`;
  };


  // O resto da lógica síncrona do componente continua aqui
  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!userData) {
    return <div>Dados do usuário não encontrados</div>;
  }

  const { profile } = userData;
  const isOnboardingComplete = profile.status === 'active';
  const isGoogleAgendaConnected = profile.status === 'activeAndConnected';

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">
          Bem-vindo de volta, {profile.full_name}!
        </h1>

        {/* --- BANNER DE ONBOARDING --- */}
        {!isGoogleAgendaConnected && (
          <div className="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 mt-0.5" />
              <div className="ml-3">
                <h2 className="font-semibold">Quase lá! Complete sua configuração.</h2>
                <p className="text-sm">Finalize as etapas abaixo para ativar seu assistente de IA.</p>
                 <ul className="list-disc list-inside mt-2 text-sm">
                    {profile.status === 'onboarding_pdf' && <li>Enviar PDF de informações</li>}
                    {profile.status === 'onboarding_rooms' && <li>Cadastrar acomodações</li>}
                    {profile.status === 'active' && <li>Conectar Google Agenda</li>}
                 </ul>
              </div>
            </div>
          </div>
        )}

        {/* --- CARDS DE KPI (MÉTRICAS) --- */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
           <div className="bg-white p-6 rounded-lg shadow-sm"> 
             <div className="flex items-center justify-between"> 
               <p className="text-md font-extrabold text-black">Saldo (Stripe)</p> 
               <DollarSign className="h-6 w-6 text-teal-400" /> 
             </div> 
             <p className="mt-2 text-3xl font-bold text-teal-900">R$ 0,00</p> 
           </div> 
           <div className="bg-white p-6 rounded-lg shadow-sm"> 
             <div className="flex items-center justify-between"> 
               <p className="text-md font-extrabold text-black">Conversas no Mês</p> 
               <MessageCircle className="h-6 w-6 text-teal-400" /> 
             </div> 
             <p className="mt-2 text-3xl font-bold text-teal-900">0</p> 
           </div> 
           <div className="bg-white p-6 rounded-lg shadow-sm"> 
             <div className="flex items-center justify-between"> 
               <p className="text-md font-extrabold text-black">Reservas no Mês</p> 
               <CalendarDays className="h-6 w-6 text-teal-400" /> 
             </div> 
             <p className="mt-2 text-3xl font-bold text-teal-900">0</p> 
           </div> 
        </div>
         
        {/* --- CARDS DE AÇÕES PRINCIPAIS --- */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Conecte seus Canais</h3>
                <p className="text-sm text-gray-500 mt-1">Conecte para automatizar o atendimento.</p>
                <button disabled={!isGoogleAgendaConnected} className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2 bg-teal-600 text-white rounded-md font-semibold transition-colors hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
                    <Phone className="h-5 w-5" />
                    Conectar WhatsApp
                    {!isGoogleAgendaConnected && <Lock className="h-4 w-4 ml-2" />}
                </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Integre sua Agenda</h3>
                <p className="text-sm text-gray-500 mt-1">Sincronize com sua agenda para reservas.</p>
                <button 
                  onClick={handleConnectGoogleCalendar} // O onClick chama nossa nova função async
                  disabled={!isOnboardingComplete} 
                  className="mt-4 flex items-center cursor-pointer justify-center gap-2 w-full px-4 py-2 bg-teal-600 text-white rounded-md font-semibold transition-colors hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
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