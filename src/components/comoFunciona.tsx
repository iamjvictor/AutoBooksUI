// src/components/HowItWorks.tsx
import {
  Building2,     // Cadastro do Estabelecimento
  FileText,      // Envio do PDF
  Bed,           // Cadastro de Quartos
  CreditCard,    // Configurar Conta Bancária (Stripe)
  CalendarCheck, // Acesso Google Calendar
  MessageSquare, // Conectar WhatsApp
} from "lucide-react";
import React from 'react'; // Importar React para JSX

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "1. Cadastro Rápido",
      description: "Crie sua conta em segundos e insira os dados básicos do seu hotel ou pousada.",
      icon: <Building2 className="w-7 h-7 text-teal-600" />,
    },
    {
      id: 2,
      title: "2. Conhecimento Instantâneo",
      description: "Envie um PDF com as informações do seu local para treinar sua IA em minutos.",
      icon: <FileText className="w-7 h-7 text-teal-600" />,
    },
    {
      id: 3,
      title: "3. Quartos Disponíveis",
      description: "Cadastre seus tipos de quartos, preços e regras para que a IA possa fazer reservas.",
      icon: <Bed className="w-7 h-7 text-teal-600" />,
    },
    {
      id: 4,
      title: "4. Recebimento Fácil",
      description: "Configure sua conta Stripe Connect para receber pagamentos diretamente dos seus hóspedes.",
      icon: <CreditCard className="w-7 h-7 text-teal-600" />,
    },
    {
      id: 5,
      title: "5. Agenda Sincronizada",
      description: "Conecte seu Google Calendar para gerenciar reservas e disponibilidade automaticamente.",
      icon: <CalendarCheck className="w-7 h-7 text-teal-600" />,
    },
    {
      id: 6,
      title: "6. Ative seu WhatsApp",
      description: "Vincule o número do seu WhatsApp para iniciar a automação e o atendimento 24/7.",
      icon: <MessageSquare className="w-7 h-7 text-teal-600" />,
    },
  ];

  return (
    <section id="como-funciona" className="bg-white">
      <div className="max-w-7xl mx-auto pt-30 bg-teal-100 px-6 lg:px-8 text-center">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t pb-20 border-gray-900" />
        </div>
        </div>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
          Comece a Automatizar em <span className="text-teal-600">Poucos Passos</span>
        </h2>
        <p className="text-xl text-gray-600 mb-16 max-w-2xl mx-auto">
          Simplifique sua gestão hoteleira com o AutoBooks. É mais fácil do que você imagina.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-lg hover:bg-gray-100 transition-shadow duration-300">
              <div className="mb-4 text-teal-600">
                {step.icon}
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 max-w-xs leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        
    

      </div>
    </section>
  );
}