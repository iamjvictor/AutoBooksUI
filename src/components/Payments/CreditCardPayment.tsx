// src/components/payments/CreditCardForm.tsx
"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { type Plan } from "@/data/plans";

// Definindo as propriedades que o componente espera receber
interface CreditCardFormProps {
  plan: Plan;
  onBack: () => void;
  onPaymentSuccess: () => void;
}

export default function CreditCardForm({ plan, onBack, onPaymentSuccess }: CreditCardFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você validaria os dados do cartão e chamaria o gateway de pagamento
    // Ao receber a confirmação de sucesso do gateway, chame a função abaixo:
    onPaymentSuccess();
  };

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-4 w-4" />
        Voltar para os planos
      </button>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Pagamento com Cartão</h1>
        <p className="mt-1 text-gray-600">
          Plano <span className="font-semibold text-teal-600">{plan.name}</span> - <span className="font-semibold">{plan.price}</span>
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Número do Cartão</label>
          <input type="text" id="cardNumber" placeholder="0000 0000 0000 0000" className="mt-1 block w-full input-style" />
        </div>
        <div>
          <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">Nome no Cartão</label>
          <input type="text" id="cardName" placeholder="Seu nome como no cartão" className="mt-1 block w-full input-style" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700">Validade (MM/AA)</label>
            <input type="text" id="cardExpiry" placeholder="MM/AA" className="mt-1 block w-full input-style" />
          </div>
          <div>
            <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700">CVV</label>
            <input type="text" id="cardCvc" placeholder="123" className="mt-1 block w-full input-style" />
          </div>
        </div>
        <button type="submit" className="w-full flex justify-center py-3 px-4 mt-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-teal-600 hover:bg-teal-700">
          Pagar Agora
        </button>
      </form>
    </div>
  );
}