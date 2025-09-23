"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

function PaymentStatusPageContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<{
    bookingId: string | null;
    status: string | null;
    amount: string;
    date: string;
  } | null>(null);

  const status = searchParams.get('status');
  const bookingId = searchParams.get('booking_id');

  useEffect(() => {
    // Simular carregamento de dados do pagamento
    const loadPaymentData = async () => {
      try {
        // Aqui você pode fazer uma chamada para a API para buscar detalhes do pagamento
        // const response = await fetch(`/api/payments/${bookingId}`);
        // const data = await response.json();
        
        // Por enquanto, vamos simular os dados
        setTimeout(() => {
          setPaymentData({
            bookingId,
            status,
            amount: 'R$ 150,00',
            date: new Date().toLocaleDateString('pt-BR')
          });
          setIsLoading(false);
        }, 2000);
      } catch (error) {
        console.error('Erro ao carregar dados do pagamento:', error);
        setIsLoading(false);
      }
    };

    if (bookingId) {
      loadPaymentData();
    } else {
      setIsLoading(false);
    }
  }, [bookingId, status]);

  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-500" />,
          title: 'Pagamento Aprovado!',
          message: 'Sua reserva foi confirmada com sucesso.',
          bgColor: 'bg-green-50',
          textColor: 'text-green-800'
        };
      case 'cancelled':
        return {
          icon: <XCircle className="h-16 w-16 text-red-500" />,
          title: 'Pagamento Cancelado',
          message: 'O pagamento foi cancelado.',
          bgColor: 'bg-red-50',
          textColor: 'text-red-800'
        };
      default:
        return {
          icon: <XCircle className="h-16 w-16 text-gray-500" />,
          title: 'Status Desconhecido',
          message: 'Não foi possível determinar o status do pagamento.',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-800'
        };
    }
  };

  const statusConfig = getStatusConfig();

  if (isLoading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Processando pagamento...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        {/* Ícone de Status */}
        <div className="text-center">
          {statusConfig.icon}
        </div>

        {/* Título e Mensagem */}
        <div className="text-center">
          <h1 className={`text-2xl font-bold ${statusConfig.textColor} mb-2`}>
            {statusConfig.title}
          </h1>
          <p className="text-gray-600 mb-4">
            {statusConfig.message}
          </p>
        </div>

        {/* Detalhes do Pagamento */}
        {paymentData && (
          <div className={`${statusConfig.bgColor} p-4 rounded-lg`}>
            <h3 className="font-semibold mb-2">Detalhes da Reserva:</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">ID da Reserva:</span> {paymentData.bookingId}</p>
              <p><span className="font-medium">Valor:</span> {paymentData.amount}</p>
              <p><span className="font-medium">Data:</span> {paymentData.date}</p>
            </div>
          </div>
        )}


        {/* Informações Adicionais */}
        {status === 'success' && (
          <div className="text-center text-sm text-gray-500">
            <p>Você receberá uma mensagem de confirmação em breve.</p>
            <p>Obrigado por escolher nossos serviços!</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <PaymentStatusPageContent />
    </Suspense>
  );
}
