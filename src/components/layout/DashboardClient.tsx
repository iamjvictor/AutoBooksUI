// src/app/dashboard/DashboardClient.tsx 
"use client";

import React from 'react';
import { AlertTriangle, DollarSign, MessageCircle, CalendarDays, Lock, Phone, Calendar } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/clients/supabaseClient';
import { useUser } from '@/context/UserContext';
import { useState } from 'react';
import RoomTypeManager from '../infoUpload';
import axios from 'axios';

// A função do componente agora é síncrona (sem 'async')
export default function DashboardClient() {
  const { userData, loading } = useUser();
  const supabase = createClient();
  const [view, setView] = useState<'dashboard' | 'manage_rooms'>('dashboard');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isConnectingWhatsapp, setIsConnectingWhatsapp] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading_qr' | 'showing_qr' | 'connected' | 'error'>('idle');
  const [isConnectingStripe, setIsConnectingStripe] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);

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
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];
    
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      redirect_uri: `http://localhost:4000/api/auth/google/callback`,
      response_type: 'code',
      scope: scopes.join(' '),
      access_type: 'offline',
      prompt: 'consent',
      state: jwt, // Passa o JWT do usuário para o backend
    });

    // 3. Redireciona o usuário
    console.log("Redirecionando para o Google...");
    window.location.href = `${googleAuthUrl}?${params.toString()}`;
  };

  const handleReturnToDashboard = () => {
    setView('dashboard');
    // Opcional: recarregar os dados se houveram mudanças
    window.location.reload(); 
  };
  

  const handleConnectWhatsapp = async () => {
    setIsConnectingWhatsapp(true);
    setQrCode(null);
    try {
      if (!userData || !userData.profile) {
        alert('Dados do usuário não encontrados. Faça login novamente.');
        setIsConnectingWhatsapp(false);
        return;
      }
      // Monte o deviceConfig conforme necessário (ajuste os campos conforme seu backend espera)
      const deviceConfig = {
        id: `device-${userData.profile.whatsapp_number.replace(/\D/g, '')}`,
        name: `Dispositivo ${userData.profile.business_name || userData.profile.full_name}`,
        whatsappNumber: userData.profile.whatsapp_number.replace(/\D/g, ''),
        user_id: userData.profile.id,
      };
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/devices/connect`,
        deviceConfig
      );
      if (data.result && data.result.startsWith('data:image')) {
        setQrCode(data.result);
      } else if (data.result === 'CONNECTED') {
        setQrCode(null);
        alert('WhatsApp conectado com sucesso!');
      }
    } catch (err: any) {
      alert('Erro ao conectar WhatsApp: ' + (err?.response?.data?.error || err.message));
    } finally {
      setIsConnectingWhatsapp(false);
    }
  };
  const handleConnectStripe = async () => {
    try {
      if (!userData || !userData.profile) {
        alert('Dados do usuário não encontrados. Faça login novamente.');
        return;
      }
      // Chama o endpoint do backend para criar a conta de onboarding
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/stripe/create-onboarding`,
        { userId: userData.profile.id }
      );
      if (data.url) {
        // Redireciona o usuário para a URL de onboarding do Stripe
        window.location.href = data.url;
      } else {
        alert('Erro ao iniciar o processo de onboarding do Stripe.');
      }
    } catch (err: any) {
      alert('Erro ao conectar com o Stripe: ' + (err?.response?.data?.error || err.message));
    }}

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
  const hasGoogleIntegration = userData.hasGoogleIntegration;
  const isStripeReady = !!profile.stripe_id; // Simples verificação de Stripe
  

  // userData.hasGoogleIntegration || false;

  if (view === 'manage_rooms') {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
            {/* O onComplete agora apenas te leva de volta para a tela principal */}
            <RoomTypeManager onComplete={handleReturnToDashboard} />
        </div>
      </div>
    );
  }

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

    {/* --- SEÇÃO DE MÉTRICAS E ONBOARDING DO STRIPE --- */}
        <div className="mt-8">
          {/* BLOCO DE AÇÃO PARA ATIVAR PAGAMENTOS (NOVO DESIGN) */}
          {!isStripeReady && (
            <div className="mb-8 rounded-lg bg-slate-100 p-8 text-center">
              <h2 className="text-2xl font-bold text-slate-800">Ative seus pagamentos</h2>
              <p className="mt-2 max-w-md mx-auto text-slate-600">
                Conecte sua conta Stripe para visualizar suas métricas financeiras e começar a receber pagamentos de reservas.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleConnectStripe}
                  disabled={isConnectingStripe}
                  className="rounded-md bg-teal-600 px-8 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:bg-gray-400"
                >
                  {isConnectingStripe ? 'Aguarde...' : 'Ativar Pagamentos'}
                </button>
                {stripeError && <p className="mt-2 text-sm text-red-500">{stripeError}</p>}
              </div>
            </div>
          )}

          {/* Cards de KPI são exibidos apenas se o Stripe estiver pronto */}
          {isStripeReady && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
          )}
        </div>
         
        {/* --- CARDS DE AÇÕES PRINCIPAIS --- */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Conecte seus Canais</h3>
                <p className="text-sm text-gray-500 mt-1">Conecte para automatizar o atendimento.</p>
                <button
                  onClick={handleConnectWhatsapp}
                  disabled={!isGoogleAgendaConnected || isConnectingWhatsapp}
                  className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2 bg-teal-600 text-white rounded-md font-semibold transition-colors hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    <Phone className="h-5 w-5" />
                    {isConnectingWhatsapp ? 'Conectando...' : 'Conectar WhatsApp'}
                    {!isGoogleAgendaConnected && <Lock className="h-4 w-4 ml-2" />}
                </button>
                {qrCode && (
                  <div className="mt-4 flex flex-col items-center">
                    <span className="mb-2 text-sm text-gray-700">Escaneie o QR Code abaixo no seu WhatsApp:</span>
                    <img src={qrCode} alt="QR Code WhatsApp" className="w-48 h-48" />
                  </div>
                )}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Integre sua Agenda</h3>
                <p className="text-sm text-gray-500 mt-1">Sincronize com sua agenda para reservas.</p>
                <button 
                  onClick={handleConnectGoogleCalendar} // O onClick chama nossa nova função async
                  disabled={hasGoogleIntegration} 
                  className="mt-4 flex items-center cursor-pointer justify-center gap-2 w-full px-4 py-2 bg-teal-600 text-white rounded-md font-semibold transition-colors hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    <Calendar className="h-5 w-5" />
                    Conectar com Google Agenda
                    {hasGoogleIntegration && <Lock className="h-4 w-4 ml-2" />}
                </button>
            </div>
        </div>

        {/* --- CARDS DE GERENCIAMENTO --- */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
             <div className="bg-white p-6 rounded-lg shadow-sm"> 
                <h3 className="text-lg font-semibold text-gray-900">Gerenciar Acomodações</h3> 
                <p className="text-sm text-gray-500 mt-1">Configure e gerencie seus quartos e acomodações.</p> 
                <button 
                  onClick={() => setView('manage_rooms')} // <-- Muda o estado para exibir o gerenciador
                  className="mt-4 block text-center w-full px-4 py-2 bg-white text-teal-700 border border-teal-600 rounded-md font-semibold hover:bg-teal-50"
                >
                    Editar Quartos 
                </button>
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