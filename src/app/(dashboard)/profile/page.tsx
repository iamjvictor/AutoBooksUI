"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { createClient } from "@/clients/supabaseClient";
import { User, Building, Phone, MapPin, Loader2, Pencil, Save, X, CreditCard, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/types/user";
import Toast from "@/components/common/Toast";
import { E164Number } from "libphonenumber-js/core";
import PhoneInput from 'react-phone-number-input';

// PASSO 1: O componente ProfileField foi movido para FORA do ProfilePage.
// Agora ele é um componente independente e estável.
const ProfileField = ({ 
  label, 
  name, 
  value, 
  icon: Icon, 
  isEditing,    // <-- Adicionamos as props necessárias
  handleChange  // <--
}: { 
  label: string; 
  name: keyof UserProfile; 
  value: string; 
  icon: React.ElementType; 
  isEditing: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center">
    <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
      <Icon size={16}/> {label}
    </dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
      {isEditing ? (
        <input 
          type="text" 
          name={name} 
          value={value} 
          onChange={handleChange} 
          className="w-full input-style" // Adicione suas classes de estilo aqui
        />
      ) : (
        <span className="py-2 block">{value || "Não informado"}</span>
      )}
    </dd>
  </div>
);


export default function ProfilePage() {
  const { userData, loading: userLoading } = useUser();
  const [formData, setFormData] = useState<Partial<UserProfile> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [supabase] = useState(() => createClient());
  const [whatsappNumber, setWhatsappNumber] = useState<E164Number | undefined>();
  const router = useRouter();

  useEffect(() => {
    if (userData?.profile) {
      setFormData(userData.profile);
      console.log("userData.profile", userData.profile);
    }
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => (prev ? { ...prev, [name]: value } : null));
  };

  const sendResetEmail = async () => {
    if (!formData) return;

    const { email } = formData;

    if (!email) {
      alert("Por favor, forneça um endereço de email.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/send-reset-password-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao enviar email.");
      }

      alert("Email de redefinição de senha enviado com sucesso!");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Ocorreu um erro desconhecido.");
      }
    }
  }

  const cancelPlan = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Sessão não encontrada.");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe/cancel-subscription`, {
      method: 'POST',      
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Falha ao cancelar o plano.");
    }

    alert("Plano cancelado com sucesso!");
  }

 const handleSave = async () => {
    if (!formData) return;

    // whatsapp sem o +
    const whatsappNumberWithoutPlus = whatsappNumber?.replace(/^\+/, '');

    const dataToSend = {
        ...formData, // seus outros dados do formulário
        whatsapp_number: whatsappNumberWithoutPlus,
    };
    console.log("Dados a serem enviados para o backend:", dataToSend);
    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Usuário não autenticado.");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao atualizar o perfil.");
      }
      
      alert("Perfil atualizado com sucesso!"); // Lembre-se de substituir por um Toast/Notificação se preferir
      setIsEditing(false);
      
      // Lembrete: Para uma melhor UX, o ideal é atualizar o UserContext aqui
      // em vez de recarregar a página. Ex: await refetchUserData();
      // window.location.reload();

    } catch (error) {
      // É uma boa prática usar 'error instanceof Error' para mais segurança
      if (error instanceof Error) {
        alert(error.message); // Substitua por um Toast/Notificação
      } else {
        alert("Ocorreu um erro desconhecido.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (userData?.profile) setFormData(userData.profile);
    setIsEditing(false);
  };

  // Função para verificar se o plano foi cancelado
  const isPlanCancelled = () => {
    if (!formData) return false;
    
    // Se não está cancelado, retorna false
    if (formData.subscription_status !== 'cancelled') return false;
    
    // Se está cancelado, verifica se já passou da data de término
    if (formData.current_period_ends_at) {
      const endDate = new Date(formData.current_period_ends_at);
      const now = new Date();
      return now > endDate; // Só considera cancelado se já passou da data
    }
    
    // Se não há data de término, considera cancelado
    return true;
  };

  // Função para verificar se o plano está cancelando (cancelado mas ainda ativo)
  const isPlanCancelling = () => {
    if (!formData) return false;
    
    // Se não está cancelado, retorna false
    if (formData.subscription_status !== 'cancelled') return false;
    
    // Se está cancelado, verifica se ainda não passou da data de término
    if (formData.current_period_ends_at) {
      const endDate = new Date(formData.current_period_ends_at);
      const now = new Date();
      return now <= endDate; // Ainda ativo até a data de término
    }
    
    return false;
  };

  // Função para obter a data de fim do período atual
  const getPeriodEndDate = () => {
    if (!formData?.current_period_ends_at) return null;
    
    try {
      const date = new Date(formData.current_period_ends_at);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return null;
    }
  };

  // Função para verificar se deve mostrar o botão de assinar plano
  const shouldShowSubscribeButton = () => {
    // Mostra o botão se está cancelando (cancelado mas ainda ativo) ou se está realmente cancelado
    return isPlanCancelling() || isPlanCancelled();
  };

  // Função para navegar para a página de planos
  const handleSubscribePlan = () => {
    router.push('/onboarding/planos');
  };

  // Função para criar sessão do portal Stripe
  const handleCreatePortalSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Sessão não encontrada. Faça login novamente.");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe/create-portal-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao criar sessão do portal.");
      }

      const { url } = await response.json();
      
      // Redirecionar para o portal do Stripe
      window.open(url, '_blank');
      
    } catch (error) {
      console.error('Erro ao criar sessão do portal:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Ocorreu um erro ao acessar o portal de pagamentos.");
      }
    }
  };

  if (userLoading) {
    return <div className="p-8">Carregando...</div>;
  }
  if (!formData) {
    return <div className="p-8">Perfil não encontrado. <Link href="/login">Faça o login.</Link></div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Alerta de plano cancelado/cancelando */}
        {(isPlanCancelled() || isPlanCancelling()) && (
          <div className={`mb-6 border rounded-lg p-4 ${
            isPlanCancelled() 
              ? 'bg-red-50 border-red-200' 
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className={`h-5 w-5 ${
                  isPlanCancelled() ? 'text-red-400' : 'text-yellow-400'
                }`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${
                  isPlanCancelled() ? 'text-red-800' : 'text-yellow-800'
                }`}>
                  {isPlanCancelled() ? 'Plano Cancelado' : 'Plano Cancelando'}
                </h3>
                <div className={`mt-2 text-sm ${
                  isPlanCancelled() ? 'text-red-700' : 'text-yellow-700'
                }`}>
                  {isPlanCancelled() ? (
                    <>
                      <p>
                        Seu plano foi cancelado e terminou em{' '}
                        <strong>{getPeriodEndDate() || 'data não informada'}</strong>.
                      </p>
                      <p className="mt-1">
                        Você não tem mais acesso às funcionalidades premium.
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        Seu plano foi cancelado e terminará em{' '}
                        <strong>{getPeriodEndDate() || 'data não informada'}</strong>.
                      </p>
                      <p className="mt-1">
                        Você ainda tem acesso às funcionalidades até o final do período pago.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-teal-100 p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
           <div className="w-full flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                {/* Lado Esquerdo: Título e Subtítulo */}
                <div>
                    <h2 className="text-xl font-semibold leading-6 text-gray-900">Meu Perfil</h2>
                    <p className="mt-1 text-sm text-gray-500">Gerencie suas informações.</p>
                </div>

                {/* Lado Direito: Botões com Lógica Condicional */}
                <div>
                        {isEditing ? (
                            // --- Modo de Edição ---
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={handleSave} 
                                    disabled={isSaving} 
                                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? (
                                        <Loader2 className="animate-spin h-4 w-4" />
                                    ) : (
                                        <Save size={16} />
                                    )}
                                    {isSaving ? "Salvando..." : "Salvar"}
                                </button>
                                
                                <button 
                                    onClick={handleCancel} 
                                    disabled={isSaving}
                                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    <X size={16} />
                                    Cancelar
                                </button>
                            </div>

                        ) : (
                            // --- Modo de Visualização ---
                            <button 
                                onClick={() => setIsEditing(true)} 
                                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <Pencil size={16} />
                                Editar Perfil
                            </button>
                        )}
                    </div>
                </div>
          </div>

          <dl className="divide-y divide-gray-200">
            {/* PASSO 2: Agora passamos as props 'isEditing' e 'handleChange' para cada ProfileField */}
            <ProfileField label="Nome do Responsável" name="full_name" value={formData.full_name || ''} icon={User} isEditing={isEditing} handleChange={handleChange} />
            <ProfileField label="Nome do Estabelecimento" name="business_name" value={formData.business_name || ''} icon={Building} isEditing={isEditing} handleChange={handleChange} />
            {isEditing ? (
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center">
                    <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Phone size={16}/> WhatsApp
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <PhoneInput
                            international
                            defaultCountry="BR"
                            value={whatsappNumber}
                            onChange={setWhatsappNumber}
                            className="w-full input-style"
                        />
                    </dd>
                </div>
            ) : (
                <ProfileField label="WhatsApp" name="whatsapp_number" value={formData.whatsapp_number || ''} icon={Phone} isEditing={isEditing} handleChange={handleChange} />
            )}
          
            <ProfileField label="Endereço" name="address" value={formData.address || ''} icon={MapPin} isEditing={isEditing} handleChange={handleChange} />
            <ProfileField label="Cidade" name="city" value={formData.city || ''} icon={MapPin} isEditing={isEditing} handleChange={handleChange} />
            <ProfileField label="Estado" name="state" value={formData.state || ''} icon={MapPin} isEditing={isEditing} handleChange={handleChange} />
            <ProfileField label="CEP" name="zip_code" value={formData.zip_code || ''} icon={MapPin} isEditing={isEditing} handleChange={handleChange} />
            
            {/* Informações da Assinatura */}
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center border-t border-gray-200">
              <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Status da Assinatura
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  formData.subscription_status === 'active' && !isPlanCancelling() && !isPlanCancelled()
                    ? 'bg-green-100 text-green-800' 
                    : isPlanCancelled()
                    ? 'bg-red-100 text-red-800'
                    : isPlanCancelling()
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {formData.subscription_status === 'active' && !isPlanCancelling() && !isPlanCancelled()
                    ? 'Ativa' 
                    : isPlanCancelled()
                    ? 'Cancelada'
                    : isPlanCancelling()
                    ? 'Cancelando'
                    : formData.subscription_status || 'Não informado'
                  }
                </span>
              </dd>
            </div>
            
            {formData.current_period_ends_at && (
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center">
                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Período Atual Termina
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className="py-2 block">{getPeriodEndDate() || 'Não informado'}</span>
                </dd>
              </div>
            )}
          </dl>
        </div>
        <div className="flex justify-start items-center gap-4 pt-6 border-t mt-2">
          {/* Botão de Redefinir Senha (Ação Secundária) */}
          <button
            type="button" // Importante ser 'button' para não submeter o formulário
            onClick={sendResetEmail}
            className="flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-150 ease-in-out cursor-pointer disabled:bg-teal-400 disabled:cursor-not-allowed"
          >
            Redefinir senha
          </button>
          
          {/* Botão para acessar portal Stripe */}
          <button
            type="button"
            onClick={handleCreatePortalSession}
            className="flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-150 ease-in-out cursor-pointer"
          >
            <ExternalLink size={20} />
            Portal de Pagamentos
          </button>
          
          {/* Botão Condicional: Assinar Plano ou Cancelar Plano */}
          {shouldShowSubscribeButton() ? (
            <button
              type="button"
              onClick={handleSubscribePlan}
              className="flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150 ease-in-out cursor-pointer"
            >
              <CreditCard size={20} />
              Assinar Plano
            </button>
          ) : (
            <button
              type="button" // Importante ser 'button' para não submeter o formulário
              onClick={cancelPlan}
              className="flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-150 ease-in-out cursor-pointer disabled:bg-teal-400 disabled:cursor-not-allowed"
            >
              Cancelar Plano
            </button>
          )}
        </div>
        
        {/* Exibir data de encerramento quando houver current_period_ends_at e estiver cancelando */}
        {formData?.current_period_ends_at && isPlanCancelling() && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-sm text-yellow-800">
                <strong>Seu plano atual termina em:</strong> {getPeriodEndDate()}
              </p>
            </div>
          </div>
        )}

      

      </div>
    </div>
  );
}