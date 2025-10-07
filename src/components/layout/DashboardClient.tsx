// src/app/dashboard/DashboardClient.tsx
"use client";

import React from 'react';
import { AlertTriangle, DollarSign, MessageCircle, CalendarDays, Lock, Phone, Calendar, Loader2, EyeOff, Eye } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/clients/supabaseClient';
import { useUser } from '@/context/UserContext';
import { useState, useEffect } from 'react';
import RoomTypeManager from '../infoUpload';
import PdfUpload from '../pdfUpload';
import axios from 'axios';

interface Balance {
  amount: number;
  currency: string;
}

// A função do componente agora é síncrona (sem 'async')
export default function DashboardClient() {
  const { userData, loading } = useUser();
  const supabase = createClient();
  const [view, setView] = useState<'dashboard' | 'manage_rooms' | 'manage_pdfs'>('dashboard');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isConnectingWhatsapp, setIsConnectingWhatsapp] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading_qr' | 'showing_qr' | 'connected' | 'error'>('idle');
  const [isConnectingStripe, setIsConnectingStripe] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [pendingBalance, setPendingBalance] = useState<number | null>(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number | null>(null);
  const [monthlyBookings, setMonthlyBookings] = useState<number | null>(null);
  const [monthlyLeads, setMonthlyLeads] = useState<number | null>(null);
 
  const [isVisible, setIsVisible] = useState(false);   // Controla se o saldo é visível
  const [loading2, setLoading] = useState(false);       // Controla o estado de carregamento
  const [error, setError] = useState<string | null>(null);            // Armazena mensagens de erro
  const [showDisconnectModal, setShowDisconnectModal] = useState(false); // Modal de desconexão
  const [disconnectLoading, setDisconnectLoading] = useState(false); // Loading da desconexão
  const [disconnectError, setDisconnectError] = useState<string | null>(null); // Erro da desconexão
  const [isGoogleConnected, setIsGoogleConnected] = useState<boolean | null>(null); // Estado dinâmico do Google
  const [isWhatsappConnected, setIsWhatsappConnected] = useState<boolean>(false); // Estado do WhatsApp
  const [whatsappDisconnectLoading, setWhatsappDisconnectLoading] = useState(false); // Loading da desconexão WhatsApp

  // Estado para armazenar dados de verificação
  const [verificationData, setVerificationData] = useState({
    subscriptionStatus: null as string | null,
    hasStripe: false,
    hasRooms: false,
    hasDocuments: false,
    loading: true
  });

  // Função para verificar status do Google dinamicamente
  const checkGoogleStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/check`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsGoogleConnected(data.hasGoogleIntegration);
      } else {
        setIsGoogleConnected(false);
      }
    } catch (error) {
      console.error('Erro ao verificar status do Google:', error);
      setIsGoogleConnected(false);
    }
  };

  // Função para verificar status do WhatsApp
  const checkWhatsappStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      if (!userData || !userData.profile) {
        alert('Dados do usuário não encontrados. Faça login novamente.');
        return;
      }

      const deviceId = `device-${userData.profile.whatsapp_number.replace(/\D/g, '')}`;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/devices/status/${encodeURIComponent(deviceId)}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });
     
      
      if (response.ok) {
        const data = await response.json();
        console.log('data', data);
        if(data.deviceId === deviceId){
          setIsWhatsappConnected(true);
        }
       
       
      } else {
        setIsWhatsappConnected(false);
      }
    } catch (error) {
      console.error('Erro ao verificar status do WhatsApp:', error);
      setIsWhatsappConnected(false);
    }
  };

  // --- FUNÇÃO PARA BUSCAR E/OU REVELAR O SALDO ---
  const handleToggleVisibility = async () => {
    // Se o saldo já foi buscado, apenas alterna a visibilidade
    if (balance !== null) {
      setIsVisible(!isVisible);
      return;
    }

    // Se é a primeira vez, busca o saldo na API
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Sessão atual:', session?.access_token);

    if (!session) {
      setError('Sessão não encontrada. Por favor, faça login novamente.');
      return;
    }

    setLoading(true);
    setError(null);
    setIsVisible(true); // Mostra o loader no lugar do saldo

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe/balance`, {
        headers: {
          // O padrão é 'Bearer ' seguido do token
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      const data = await response.json();
      console.log('Resposta da API de saldo:', data);

      if (response.status !== 200) {
        throw new Error(data.error || 'Não foi possível buscar o saldo.');
      }
      
      setBalance(data.available.amount);
      setPendingBalance(data.pending.amount);

    } catch (err) {
      setError((err as Error).message);
      setIsVisible(false); // Esconde o saldo em caso de erro
    } finally {
      setLoading(false);
    }
  }; 

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
      redirect_uri: `${process.env.NEXT_PUBLIC_API_URL}/auth/google/callback`,
      response_type: 'code',
      scope: scopes.join(' '),
      access_type: 'offline',
      prompt: 'consent',
      state: jwt, // Passa o JWT do usuário para o backend
    });

    // 3. Redireciona o usuário
    console.log("Redirecionando para o Google...");
    window.location.href = `${googleAuthUrl}?${params.toString()}`;
    
    // Nota: O estado será atualizado quando o usuário retornar do Google
    // através do callback que recarrega a página
  };

  const handleDisconnectGoogle = async () => {
    setDisconnectLoading(true);
    setDisconnectError(null);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Sessão não encontrada. Faça login novamente.');
      }
      
      const jwt = session.access_token;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/disconnect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwt}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao desconectar Google Agenda');
      }
      
      // Sucesso - fechar modal e atualizar estado
      setShowDisconnectModal(false);
      setIsGoogleConnected(false); 
      // Atualiza o estado local imediatamente
      handleDisconnectWhatsapp();
      
      // Opcional: recarregar dados do contexto também
      if (window.location) {
        window.location.reload();
      }
      
    } catch (error) {
      console.error('Erro ao desconectar Google:', error);
      setDisconnectError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setDisconnectLoading(false);
    }
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
      
      if (data.qrCodeBase64 && data.qrCodeBase64.startsWith('data:image')) {
        setQrCode(data.qrCodeBase64);
        setStatus('showing_qr');
        console.log('QR Code ativo: showing_qr');
        
       
        setTimeout(() => {
          setQrCode(null);
          setStatus('idle');
        }, 30000);
      
      }
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      const responseError = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      alert('Erro ao conectar WhatsApp: ' + (responseError || errorMessage));
    } finally {
      setIsConnectingWhatsapp(false);
    }
  };
  const handleDisconnectWhatsapp = async () => {
    setWhatsappDisconnectLoading(true);
    
    try {
      if (!userData || !userData.profile) {
        alert('Dados do usuário não encontrados. Faça login novamente.');
        return;
      }

      const deviceId = `device-${userData.profile.whatsapp_number.replace(/\D/g, '')}`;
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/devices/disconnect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deviceId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao desconectar WhatsApp');
      }

      // Atualizar estados locais
      setIsWhatsappConnected(false);
      setQrCode(null);
      setStatus('idle');
      

    } catch (error) {
      console.error('Erro ao desconectar WhatsApp:', error);
      alert('Erro ao desconectar WhatsApp: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    } finally {
      setWhatsappDisconnectLoading(false);
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      const responseError = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      alert('Erro ao conectar com o Stripe: ' + (responseError || errorMessage));
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
  if (typeof amount !== 'number' || !currency) return 'R$ --,--';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
  }).format(amount / 100);
  };

  // Executar verificação quando o componente montar
  React.useEffect(() => {
    if (!userData?.profile) return;
    checkOnboardingStatus();
    checkGoogleStatus(); // Verificar status do Google também
    checkWhatsappStatus(); // Verificar status do WhatsApp também
    fetchMonthlyData(); // Buscar dados mensais
  }, [userData?.profile?.id, status]);

  // Verificar se usuário está inadimplente e redirecionar para planos
  React.useEffect(() => {
    // Só executa a lógica quando o carregamento terminar e tivermos um status
    if (verificationData.loading || !verificationData.subscriptionStatus) {
      return;
    }

    const status = verificationData.subscriptionStatus;

    // --- LÓGICA DE REDIRECIONAMENTO INTELIGENTE ---

    // 1. O utilizador está com o pagamento em atraso?
    //    Se sim, redireciona-o para a página que aciona o Portal da Stripe.
    if (status === 'past_due' || status === 'unpaid') {
      console.log("Assinatura em atraso. A redirecionar para a atualização de pagamento...");
      // Esta é a nova página que criámos no guia anterior.
      window.location.href = '/atualizar-pagamento'; 
      return; // Para a execução para evitar outros redirecionamentos
    }

    // 2. A assinatura está ativa ou em período de teste?
    //    Se sim, não faz nada. O acesso está permitido.
    if (status === 'active' || status === 'trialing') {
      console.log("Assinatura ativa. Acesso permitido.");
      return;
    }

    // 3. Para todos os outros casos (ex: 'canceled', 'incomplete', etc.)
    //    Redireciona para a página de planos para que ele possa iniciar uma nova assinatura.
    console.log(`Assinatura com status '${status}'. A redirecionar para a página de planos...`);
    window.location.href = '/onboarding/planos';

  }, [verificationData.subscriptionStatus, verificationData.loading]);

  // O resto da lógica síncrona do componente continua aqui
  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!userData) {
    return <div>Dados do usuário não encontrados</div>;
  }  

  const { profile } = userData;
  const isOnboardingComplete = profile.status === 'active';
  const isGoogleAgendaConnected = isGoogleConnected ?? userData.hasGoogleIntegration; // Usa estado dinâmico ou fallback
  const hasGoogleIntegration = isGoogleConnected ?? userData.hasGoogleIntegration; // Usa estado dinâmico ou fallback
  const isStripeReady = !!profile.stripe_id; // Simples verificação de Stripe


  // Função para verificar status das etapas no banco
  const checkOnboardingStatus = async () => {
    try {
      setVerificationData(prev => ({ ...prev, loading: true }));

      // Buscar dados completos do perfil incluindo subscription_status
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('stripe_id, subscription_status')
        .eq('id', profile.id)
        .single();

      if (profileError) {
        console.error('Erro ao buscar dados do perfil:', profileError);
        return;
      }

      // Verificar se tem quartos cadastrados
      const { data: roomsData, error: roomsError } = await supabase
        .from('room_types')
        .select('id')
        .eq('user_id', profile.id)
        .limit(1);

      // Verificar se tem documentos
      const { data: documentsData, error: documentsError } = await supabase
        .from('documents')
        .select('id')
        .eq('user_id', profile.id)
        .limit(1);

      console.log('Dados do perfil retornados:', profileData);
      console.log('Status da assinatura:', profileData.subscription_status);
      
      setVerificationData({
        subscriptionStatus: profileData.subscription_status,
        hasStripe: !!profileData.stripe_id,
        hasRooms: !roomsError && roomsData && roomsData.length > 0,
        hasDocuments: !documentsError && documentsData && documentsData.length > 0,
        loading: false
      });

    } catch (error) {
      console.error('Erro ao verificar status do onboarding:', error);
      setVerificationData(prev => ({ ...prev, loading: false }));
    }
  };

  // Função para buscar dados mensais
  const fetchMonthlyData = async () => {
    if (!userData?.profile?.id) return;

    try {
      const currentDate = new Date();
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      // Buscar faturamento mensal (soma de total_price das reservas confirmadas)
      const { data: revenueData, error: revenueError } = await supabase
        .from('bookings')
        .select('total_price')
        .eq('user_id', profile.id)
        .eq('status', 'confirmada')
        .gte('created_at', startOfMonth.toISOString())
        .lte('created_at', endOfMonth.toISOString());

      if (!revenueError && revenueData) {
        const totalRevenue = revenueData.reduce((sum, booking) => sum + (booking.total_price || 0), 0);
        setMonthlyRevenue(totalRevenue);
      }

      // Buscar total de reservas confirmadas no mês
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('id')
        .eq('user_id', profile.id)
        .eq('status', 'confirmada')
        .gte('created_at', startOfMonth.toISOString())
        .lte('created_at', endOfMonth.toISOString());

      if (!bookingsError && bookingsData) {
        setMonthlyBookings(bookingsData.length);
      }

      // Buscar total de leads capturados no mês
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('id')
        .eq('user_id', userData.profile.id)
        .gte('created_at', startOfMonth.toISOString())
        .lte('created_at', endOfMonth.toISOString());

      if (!leadsError && leadsData) {
        setMonthlyLeads(leadsData.length);
      }

    } catch (error) {
      console.error('Erro ao buscar dados mensais:', error);
    }
  };

  
  // Função para determinar quais passos ainda precisam ser completados
  const getRemainingSteps = () => {
    if (verificationData.loading) return [];

    const steps = [];
    
    // 1. Verificar se tem subscription ativa
    if (!verificationData.subscriptionStatus || verificationData.subscriptionStatus !== 'active') {
      steps.push({
        id: 'subscription',
        title: 'Ativar assinatura',
        description: 'Escolha e pague por um plano para ativar seu assistente de IA',
        completed: false
      });
    }
    
    // 2. Verificar se Stripe está conectado
    if (!verificationData.hasStripe) {
      steps.push({
        id: 'stripe',
        title: 'Conectar Stripe',
        description: 'Conecte sua conta Stripe para receber pagamentos',
        completed: false
      });
    }
    
    // 3. Verificar se tem quartos cadastrados
    if (!verificationData.hasRooms) {
      steps.push({
        id: 'rooms',
        title: 'Configurar quartos',
        description: 'Cadastre seus quartos e acomodações',
        completed: false
      });
    }
    
    // 4. Verificar se tem PDFs enviados
    if (!verificationData.hasDocuments) {
      steps.push({
        id: 'pdfs',
        title: 'Enviar PDFs',
        description: 'Envie documentos com informações do seu negócio',
        completed: false
      });
    }
    
    // 5. Verificar se Google Agenda está conectado
    if (!isGoogleAgendaConnected) {
      steps.push({
        id: 'google_calendar',
        title: 'Conectar Google Agenda',
        description: 'Sincronize com sua agenda para gerenciar reservas',
        completed: false
      });
    }
    
    // 6. Conectar WhatsApp (sempre por último, apenas se não estiver conectado)
    if (!isWhatsappConnected) {
      steps.push({
        id: 'whatsapp',
        title: 'Conectar WhatsApp',
        description: 'Conecte seu WhatsApp para automatizar atendimento',
        completed: false
      });
    }
    
    return steps;
  };

  const remainingSteps = getRemainingSteps();
  const hasRemainingSteps = remainingSteps.length > 0;


  const renderAvailableBalance = () => {
    if (!isVisible) {
      return <span className="text-3xl font-bold text-gray-400 tracking-widest">••••••</span>;
    }
    if (loading2) {
      return <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />;
    }
    if (error) {
      return <span className="text-lg font-semibold text-red-500">Erro!</span>;
    }
   
    return (
      <span className="text-3xl font-bold text-teal-900"> 
        {formatCurrency(balance || 0, 'BRL')} 
      </span>
    );
  };
  const renderPendingBalance = () => {
    if (!isVisible) {
      return <span className="text-3xl font-bold text-gray-400 tracking-widest">••••••</span>;
    }
    if (loading2) {
      return <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />;
    }
    if (error) {
      return <span className="text-lg font-semibold text-red-500">Erro!</span>;
    }
    
    return (
      <span className="text-3xl font-bold text-teal-900"> 
        {formatCurrency(pendingBalance || 0, 'BRL')} 
      </span>
    );
  };

  const renderMonthlyRevenue = () => {
    if (monthlyRevenue === null) {
      return <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />;
    }
    return <span className="text-3xl font-bold text-green-600">{formatCurrency(monthlyRevenue * 100, 'BRL')}</span>;
  };

  const renderMonthlyBookings = () => {
    console.log('monthlyBookings', monthlyBookings);
    if (monthlyBookings === null) {
      return <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />;
    }
    return <span className="text-3xl font-bold text-blue-600">{monthlyBookings}</span>;
  };

  const renderMonthlyLeads = () => {
    console.log('monthlyLeads', monthlyLeads);
    if (monthlyLeads === null) {
      return <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />;
    }
    return <span className="text-3xl font-bold text-purple-600">{monthlyLeads}</span>;
  };

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

  if (view === 'manage_pdfs') {
    return (
      <div className="p-4 sm:p-6 lg:p-8"> 
        <div className="max-w-4xl mx-auto"> 
          <PdfUpload onComplete={handleReturnToDashboard} /> 
        
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

        {/* --- BANNER DE ONBOARDING DINÂMICO --- */}
        {verificationData.loading ? (
          <div className="mt-6 p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-800 rounded-md">
            <div className="flex items-center">
              <Loader2 className="h-5 w-5 animate-spin mr-3" />
              <span>Verificando status da sua conta...</span>
            </div>
          </div>
        ) : hasRemainingSteps ? (
          <div className="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 mt-0.5" />
              <div className="ml-3">
                <h2 className="font-semibold">
                  {remainingSteps.length === 1 
                    ? 'Falta apenas 1 passo!' 
                    : `Faltam ${remainingSteps.length} passos!`
                  }
                </h2>
                <p className="text-sm mb-3">
                  {remainingSteps.length === 1 
                    ? 'Complete a etapa abaixo para ativar seu assistente de IA.'
                    : 'Complete as etapas abaixo para ativar seu assistente de IA.'
                  }
                </p>
                <div className="space-y-2">
                  {remainingSteps.map((step, index) => (
                    <div key={step.id} className="flex items-center text-sm">
                      <span className="w-6 h-6 bg-yellow-200 text-yellow-800 rounded-full flex items-center justify-center text-xs font-semibold mr-3">
                        {index + 1}
                      </span>
                      <div>
                        <span className="font-medium">{step.title}</span>
                        <span className="text-yellow-700 ml-2">- {step.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Card 1: Saldo Pendente */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-md font-extrabold text-black">Saldo Pendente</p>
                  <button onClick={handleToggleVisibility} className="text-gray-500 hover:text-teal-600 transition">
                    {isVisible ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                  </button>
                </div>
                
                <div className="mt-2 h-10 flex items-center">
                  {renderPendingBalance()}
                </div>

                {/* Exibe a mensagem de erro detalhada abaixo do valor */}
                {error && !loading && (
                    <p className="text-xs text-red-600 mt-1">{error}</p>
                )}
              </div>

              {/* Card 2: Faturamento Mensal */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-md font-extrabold text-black">Faturamento Mensal</p>
                  <DollarSign className="h-6 w-6 text-green-400" />
                </div>
                
                <div className="mt-2 h-10 flex items-center">
                  {renderMonthlyRevenue()}
                </div>
              </div>

              {/* Card 3: Reservas no Mês */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-md font-extrabold text-black">Reservas no Mês</p>
                  <CalendarDays className="h-6 w-6 text-blue-400" />
                </div>
                
                <div className="mt-2 h-10 flex items-center">
                  {renderMonthlyBookings()}
                </div>
              </div>

              {/* Card 4: Leads Capturados */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-md font-extrabold text-black">Leads Capturados</p>
                  <MessageCircle className="h-6 w-6 text-purple-400" />
                </div>
                
                <div className="mt-2 h-10 flex items-center">
                  {renderMonthlyLeads()}
                </div>
              </div>
            </div>
          )}
        </div>
         
        {/* --- CARDS DE AÇÕES PRINCIPAIS --- */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Conecte seus Canais</h3>
                <p className="text-sm text-gray-500 mt-1">Conecte para automatizar o atendimento.</p>
                
                {!isWhatsappConnected ? (
                  <>
                 {status === 'showing_qr' ? (
                      <button
                        onClick={() => {}}
                        disabled={true}
                        className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-600 text-white rounded-md font-semibold transition-colors hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        <Phone className="h-5 w-5" />
                        {isConnectingWhatsapp ? 'Conectando...' : 'QR Code Ativo'}
                      </button>
                    ) : (
                      <button
                        onClick={handleConnectWhatsapp}
                        disabled={!isGoogleAgendaConnected || isConnectingWhatsapp}
                        className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2 bg-teal-600 text-white rounded-md font-semibold transition-colors hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        <Phone className="h-5 w-5" />
                        {isConnectingWhatsapp ? 'Conectando...' : 'Conectar WhatsApp'}
                      </button>
                    )}

                    {qrCode && (
                      <div className="mt-4 flex flex-col items-center">
                        <span className="mb-2 text-sm text-gray-700">Escaneie o QR Code abaixo no seu WhatsApp:</span>
                        <img src={qrCode} alt="QR Code WhatsApp" className="w-48 h-48" />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="mt-4">
                    <div className="flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-md">
                      <Phone className="h-5 w-5" />
                      <span className="font-semibold">WhatsApp Conectado</span>
                    </div>
                    <button
                      onClick={handleDisconnectWhatsapp}
                      disabled={whatsappDisconnectLoading}
                      className="mt-3 flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-600 text-white rounded-md font-semibold transition-colors hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      <Phone className="h-5 w-5" />
                      {whatsappDisconnectLoading ? 'Desconectando...' : 'Desconectar WhatsApp'}
                    </button>
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
            {/* Botão de Desconectar Google Agenda */}
            {hasGoogleIntegration && (
              <>
                <button
                  onClick={() => setShowDisconnectModal(true)}
                  className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-600 text-white rounded-md font-semibold transition-colors hover:bg-red-700"
                >
                  <Calendar className="h-5 w-5" />
                  Desconectar Google Agenda
                </button>
                {/* Modal de confirmação */}
                {showDisconnectModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                      <h4 className="text-lg font-bold mb-2 text-gray-900">Desconectar Google Agenda?</h4>
                      <p className="text-sm text-gray-700 mb-4">
                        Ao desconectar sua Google Agenda, o bot do WhatsApp também será parado. Tem certeza que deseja continuar?
                      </p>
                      {disconnectLoading ? (
                        <div className="flex justify-center items-center py-2">
                          <Loader2 className="animate-spin h-6 w-6 text-teal-600" />
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setShowDisconnectModal(false)}
                            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={handleDisconnectGoogle}
                            className="px-4 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700"
                          >
                            Desconectar
                          </button>
                        </div>
                      )}
                      {disconnectError && (
                        <p className="text-xs text-red-600 mt-2">{disconnectError}</p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
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
                <button 
                  onClick={() => setView('manage_pdfs')} // <-- Muda o estado para exibir o gerenciador
                  className="mt-4 block text-center w-full px-4 py-2 bg-white text-teal-700 border border-teal-600 rounded-md font-semibold hover:bg-teal-50"
                >
                    Gerenciar Pdfs 
                </button>
            </div> 
        </div>
      </div>
    </div>
  );
 
}