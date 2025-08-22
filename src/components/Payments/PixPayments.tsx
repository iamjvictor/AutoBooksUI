// src/components/payments/PixPayment.tsx
"use client";

import React from "react";
import { QrCode, ArrowLeft } from "lucide-react";
import { type Plan } from "@/data/plans"; // Importe a interface Plan

// Definindo as propriedades que o componente espera receber
interface PixPaymentProps {
  plan: Plan;
  onBack: () => void;
  onPaymentSuccess: () => void;
}

export default function PixPayment({ plan, onBack, onPaymentSuccess }: PixPaymentProps) {
    const handlePayment = () => {
        // Receber resposta da api de pix
        onPaymentSuccess();
    };
  return (
    <div className="text-center">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-4 w-4" />
        Voltar para os planos
      </button>
      <h1 className="text-2xl font-bold text-gray-900">Pagamento com Pix</h1>
      <p className="mt-1 text-gray-600 mb-6">
        Plano <span className="font-semibold text-teal-600">{plan.name}</span> - <span className="font-semibold">{plan.price}</span>
      </p>
      <div className="flex justify-center">
        {/* Placeholder para o QR Code */}
        <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
          <QrCode className="h-32 w-32 text-gray-400" />
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-500">Escaneie o QR Code com o app do seu banco.</p>
      <div className="mt-6">
        <label htmlFor="pixCode" className="block text-sm font-medium text-gray-700">Ou use o Pix Copia e Cola:</label>
        <input
          type="text"
          id="pixCode"
          readOnly
          value="00020126580014br.gov.bcb.pix..."
          className="mt-1 block w-full input-style text-gray-500 bg-gray-50 cursor-pointer"
        />
      </div>
    </div>
  );
}