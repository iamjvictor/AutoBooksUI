// src/components/PaymentsSection.tsx

import React from 'react';

// Dados dos cards para facilitar a manutenção
const featureCards = [
    {
      // Ícone de Cadeado para Segurança Máxima
      icon: (
        <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: 'Segurança Máxima PCI DSS',
      description: 'Processamento certificado PCI DSS Level 1, a mais alta certificação de segurança da indústria de pagamentos.',
    },
    {
      // Ícone de Saque/Transferência para Recebimento Automático
      icon: (
        <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Saques Diários e Automáticos',
      description: 'Seu dinheiro das reservas é depositado automaticamente em sua conta bancária, todos os dias. Zero complicação com repasses.',
    },
    {
      // Ícone de Cartão de Crédito para indicar forma de pagamento
      icon: (
        <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      title: 'Apenas Cartão de Crédito/Débito',
      description: 'Atualmente, nossa plataforma aceita pagamentos via cartão de crédito e débito. Mais opções em breve!',
    },
    {
      // Ícone de Taxa/Cálculo para Taxa Transparente
      icon: (
        <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Taxa Transparente da Stripe',
      description: 'Apenas a taxa da Stripe: 3,99% + R$ 0,39 por transação bem-sucedida. Zero taxas extras do AutoBooks.',
    },
  ];
export const PaymentsSection = () => {
  return (
    <section className="bg-white ">
      <div className="mx-auto max-w-7xl pt-30 rounded-lg bg-teal-100 px-6 lg:px-8">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t pb-20 border-gray-900" />
        </div>
        </div>
        {/* Título da Seção */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Pagamentos seguros com a <span className="text-teal-600">Stripe</span>
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Parceria com a líder mundial em pagamentos online. Receba de forma segura, rápida e transparente.
          </p>
        </div>

        {/* Conteúdo Principal: Logo + Cards */}
        <div className="mt-16 grid grid-cols-1 items-center gap-y-12 lg:grid-cols-2 lg:gap-x-16">
          
          {/* Lado Esquerdo: Logo da Stripe */}
          <div className="flex justify-center items-center p-8  rounded-lg">
            <img
              src="/stripe-logo.svg"
              alt="Logo da Stripe"
              width={250}
              height={100}
              className="max-w-full h-auto"
            />
          </div>

          {/* Lado Direito: Cards de Features */}
          <div className="space-y-8">
            {featureCards.map((card) => (
              <div key={card.title} className="flex gap-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center">
                  {card.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold leading-7 text-gray-900">{card.title}</h3>
                  <p className="mt-1 text-base leading-7 text-gray-600">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};