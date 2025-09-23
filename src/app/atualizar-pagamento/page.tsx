"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/clients/supabaseClient";
import { CreditCard, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

export default function AtualizarPagamentoPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleUpdatePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Obter sessão do usuário
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("Sessão não encontrada. Por favor, faça login novamente.");
        return;
      }

      // 2. Chamar endpoint para criar sessão do portal
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe/create-portal-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao acessar portal de pagamento');
      }

      const { url } = await response.json();
      
      // 3. Redirecionar para o portal do Stripe
      window.location.href = url;
      
    } catch (error) {
      console.error("Erro ao atualizar pagamento:", error);
      setError(error instanceof Error ? error.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-red-500">
            <AlertCircle className="h-12 w-12" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Pagamento em Atraso
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sua assinatura está em atraso. Atualize seu método de pagamento para continuar usando nossos serviços.
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            {/* Informações sobre o problema */}
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Ação Necessária
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>
                      Para manter o acesso aos nossos serviços, você precisa atualizar seu método de pagamento.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botão de ação */}
            <div className="space-y-4">
              <button
                onClick={handleUpdatePayment}
                disabled={loading}
                className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Carregando...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Atualizar Método de Pagamento
                  </>
                )}
              </button>

              <button
                onClick={handleBackToDashboard}
                disabled={loading}
                className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Voltar ao Dashboard
              </button>
            </div>

            {/* Mensagem de erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Erro
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Informações adicionais */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    O que acontece depois?
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Você será redirecionado para o portal seguro do Stripe</li>
                      <li>Poderá atualizar seu método de pagamento</li>
                      <li>Após a atualização, seu acesso será restaurado automaticamente</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
