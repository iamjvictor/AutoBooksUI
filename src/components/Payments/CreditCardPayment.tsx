// src/components/payments/CreditCardForm.tsx
"use client";

import React, { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { type Plan } from "@/data/plans";
import { createClient } from "@/clients/supabaseClient";


// Definindo as propriedades que o componente espera receber
interface CreditCardFormProps {
  plan: Plan;
  onBack: () => void;
  onPaymentSuccess: () => void;
}

export default function CreditCardForm({ plan, onBack, onPaymentSuccess }: CreditCardFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Obter sessão do usuário
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Sessão não encontrada. Faça login novamente.");
      }

      // 2. Obter priceId do Stripe para o plano
      const priceId = plan.id;
      if (!priceId) {
        throw new Error("Plano não encontrado. Tente novamente.");
      }

      // 3. Chamar API para criar subscription
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe/create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ priceId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao processar pagamento");
      }

      const { sessionId, url } = await response.json();
      console.log(response.json);
      // 4. Redirecionar para o checkout do Stripe
      window.location.href = url;

    } catch (error) {
      console.error("Erro no pagamento:", error);
      setError(error instanceof Error ? error.message : "Erro inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button 
        onClick={onBack} 
        disabled={isLoading}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 disabled:opacity-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para os planos
      </button>
      
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Pagamento com Cartão</h1>
        <p className="mt-1 text-gray-600">
          Plano <span className="font-semibold text-teal-600">{plan.name}</span> - <span className="font-semibold">{plan.price}</span>
        </p>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Redirecionando para o Stripe
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Você será redirecionado para uma página segura do Stripe para finalizar o pagamento.
          </p>
          <div className="flex items-center justify-center gap-2 text-teal-600">
            <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium">Processando...</span>
          </div>
        </div>
      </div>

      <button 
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full flex justify-center items-center gap-2 py-3 px-4 mt-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Processando...
          </>
        ) : (
          'Continuar para o Pagamento'
        )}
      </button>
    </div>
  );
}