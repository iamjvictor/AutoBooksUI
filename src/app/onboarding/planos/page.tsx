// src/app/onboarding/planos/page.tsx
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Check, Clock, CreditCard, QrCode } from "lucide-react";
import { plans, type Plan } from "@/data/plans";
import { useRouter, useSearchParams } from "next/navigation";

// IMPORTE OS NOVOS COMPONENTES
import PixPayment from "@/components/Payments/PixPayments";
import CreditCardForm from "@/components/Payments/CreditCardPayment";
import PdfUpload from "@/components/pdfUpload";
import InfoUpload from "@/components/infoUpload";
import { createClient } from "@/clients/supabaseClient";

// --- COMPONENTE PRINCIPAL DA PÁGINA ---
function PlanosPageContent() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [currentStep, setCurrentStep] = useState<'plans' | 'payment' | 'pdfUpload' | 'infoUpload'>('plans');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | null>(null);

  const nav = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Verifica se deve mostrar a etapa de upload baseado na URL
  useEffect(() => {
    const showUploadStep = searchParams.get('showUploadStep') === 'true';
    if (showUploadStep) {
      setCurrentStep('pdfUpload');
    }
  }, [searchParams]);

  // ... (todas as suas funções handle... continuam aqui, sem alterações)
  const handleSelectPlan = (plan: Plan) => {
    // Só permite selecionar planos disponíveis
    if (plan.avaiable) {
      setSelectedPlan(plan);
    }
  };

  const handlePaymentMethodSelect = (method: 'pix' | 'credit_card') => {
    if (!selectedPlan) return;
    setPaymentMethod(method);
    setCurrentStep('payment');
  };
  
  const handleBackToPlans = () => {
    setCurrentStep('plans');
    setPaymentMethod(null);
  }

  const handlePaymentSuccess = async () => {
    console.log("Pagamento simulado com sucesso!");
     try {
      // 1. Pega a sessão para se autenticar com o backend
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Sessão não encontrada.");

      // 2. Chama a API para fazer a ÚLTIMA atualização de status
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/update-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ nextStep: 'onboarding_pdf' }) // O status final!
      });

      if (!response.ok) {
        throw new Error("Falha ao ativar a sua conta.");
      }

      console.log("Usuário ativado com sucesso! Redirecionando para o dashboard.");

    } catch (error) {
      console.error("Erro ao ativar o usuário:", error);
      // Exiba um toast de erro aqui
    }
    
    setCurrentStep('pdfUpload');
  };

  const handlePdfComplete = async () => {
    console.log("pdf enviado! Redirecionando para o dashboard...");
    try {
      // 1. Pega a sessão para se autenticar com o backend
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Sessão não encontrada.");

      // 2. Chama a API para fazer a ÚLTIMA atualização de status
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/update-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ nextStep: 'onboarding_rooms' }) // O status final!
      });

      if (!response.ok) {
        throw new Error("Falha ao ativar a sua conta.");
      }

      console.log("Usuário ativado com sucesso! Redirecionando para o dashboard.");

    } catch (error) {
      console.error("Erro ao ativar o usuário:", error);
      // Exiba um toast de erro aqui
    }
    
    setCurrentStep('infoUpload');
  };
  const handleInfoComplete = async() => {
    console.log("Informações enviadas! Redirecionando para o dashboard...");

    try {
      // 1. Pega a sessão para se autenticar com o backend
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Sessão não encontrada.");

      // 2. Chama a API para fazer a ÚLTIMA atualização de status
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/update-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ nextStep: 'active' }) // O status final!
      });

      if (!response.ok) {
        throw new Error("Falha ao ativar a sua conta.");
      }

      console.log("Usuário ativado com sucesso! Redirecionando para o dashboard.");

      // 3. Redireciona para o dashboard, finalizando o onboarding.
      nav.push('/dashboard');

    } catch (error) {
      console.error("Erro ao ativar o usuário:", error);
      // Exiba um toast de erro aqui
    }
    
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-teal-600 py-12 px-4">
      <div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        
        {currentStep === 'plans' && (
          <>
            {/* Cabeçalho da Seção */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Quase lá! Escolha seu plano:</h1>
              <p className="mt-2 text-gray-600">Sem fidelidade, cancele quando quiser.</p>

            </div>

            {/* Mapeamento e Exibição dos Planos */}
            <div className="space-y-4">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  onClick={() => handleSelectPlan(plan)}
                  className={`p-6 rounded-lg border-2 transition-all relative ${
                    !plan.avaiable 
                      ? 'border-gray-200 bg-gray-100 opacity-75 cursor-not-allowed'
                      : selectedPlan?.name === plan.name
                        ? 'border-teal-500 bg-teal-50 cursor-pointer'
                        : 'border-gray-200 hover:border-gray-400 cursor-pointer'
                  }`}
                >
                  {plan.popular && plan.avaiable && selectedPlan?.name !== plan.name && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-teal-500 text-white font-semibold px-3 py-1 rounded-full">
                      Mais Popular
                    </span>
                  )}
                  {selectedPlan?.name === plan.name && plan.avaiable && (
                    <div className="absolute top-4 right-4 bg-teal-500 text-white rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-gray-800">{plan.name}</h2>
                    {!plan.avaiable && (
                      <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                        Em Breve
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{plan.slogan}</p>
                  
                  <p className="text-3xl font-bold text-gray-900 mt-4">
                    {plan.price}
                  </p>

                  <ul className="mt-6 space-y-2 text-left">
                    {plan.features.map((feature, index) => {
                      const isSoon = typeof feature === 'object';
                      const featureText = isSoon ? feature.text : feature;

                      return (
                        <li key={index} className="flex items-center gap-3">
                          {isSoon ? (
                            <Clock className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Check className="h-5 w-5 text-green-500" />
                          )}
                          <span className={isSoon ? 'text-gray-500' : 'text-gray-700'}>
                            {featureText}
                            {isSoon && (
                              <span className="ml-2 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                Em Breve
                              </span>
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            {/* Seção Condicional de Pagamento (aparece após selecionar um plano) */}
            {selectedPlan && (
              <div className="border-t-2 border-dashed pt-8 mt-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900">Finalize o Pagamento</h2>
                  <p className="mt-1 text-gray-600">
                    Você selecionou o plano <span className="font-semibold text-teal-600">{selectedPlan.name}</span>.
                  </p>
                </div>
                <div className="mt-6">
                  <button
                    onClick={() => handlePaymentMethodSelect('credit_card')}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors"
                  >
                    <CreditCard className="h-6 w-6"/>
                    Pagar com Cartão
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        
        {currentStep === 'payment' && paymentMethod === 'pix' && selectedPlan && (
            <PixPayment plan={selectedPlan} onBack={handleBackToPlans}  onPaymentSuccess={handlePaymentSuccess}/>
        )}
        {currentStep === 'payment' && paymentMethod === 'credit_card' && selectedPlan && (
            <CreditCardForm 
              plan={selectedPlan} 
              onBack={handleBackToPlans} 
              onPaymentSuccess={handlePaymentSuccess} 
            />
        )}
        {currentStep === 'pdfUpload' && (
          <PdfUpload onComplete={handlePdfComplete} />
        )}
        {currentStep === 'infoUpload' && <InfoUpload onComplete={handleInfoComplete} />}

      </div>
    </main>
  );
}

// --- COMPONENTE WRAPPER COM SUSPENSE ---
export default function PlanosPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <PlanosPageContent />
    </Suspense>
  );
}
