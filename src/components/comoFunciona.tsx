import {
  Building2,     // Cadastro do Estabelecimento
  FileText,      // Envio do PDF
  Bed,           // Cadastro de Quartos
  CreditCard,    // Configurar Conta Bancária (Stripe)
  CalendarCheck, // Acesso Google Calendar
  MessageSquare, // Conectar WhatsApp
} from "lucide-react";
import React from 'react';

// Sub-componente para cada passo, para um código mais limpo
const StepCard = ({ icon, title, description }: { icon: React.ReactElement, title: string, description: string }) => (
  <div className="
  bg-white/5 border border-white/10 rounded-2xl p-6 h-full 
  transition-all duration-300 hover:bg-white/10 hover:-translate-y-2
">
  <div className="flex items-start gap-4">
    {/* Ícone */}
    <div className="flex-shrink-0 text-teal-400 bg-white/10 p-3 rounded-lg">
        {React.cloneElement(icon,)}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-teal-400">
          {title}
        </h3>
        <p className="mt-1 text-white-600 text-sm">
          {description}
        </p>
      </div>
    </div>
  </div>
);

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "1. Cadastro Rápido",
      description: "Crie sua conta em segundos e insira os dados básicos do seu hotel ou pousada.",
      icon: <Building2 />,
    },
    {
      id: 2,
      title: "2. Conhecimento Instantâneo",
      description: "Envie um PDF com as informações do seu local para treinar sua IA em minutos.",
      icon: <FileText />,
    },
    {
      id: 3,
      title: "3. Quartos Disponíveis",
      description: "Cadastre seus tipos de quartos, preços e regras para que a IA possa fazer reservas.",
      icon: <Bed />,
    },
    {
      id: 4,
      title: "4. Recebimento Fácil",
      description: "Configure sua conta Stripe Connect para receber pagamentos diretamente dos seus hóspedes.",
      icon: <CreditCard />,
    },
    {
      id: 5,
      title: "5. Agenda Sincronizada",
      description: "Conecte seu Google Calendar para gerenciar reservas e disponibilidade automaticamente.",
      icon: <CalendarCheck />,
    },
    {
      id: 6,
      title: "6. Ative seu WhatsApp",
      description: "Vincule o número do seu WhatsApp para iniciar a automação e o atendimento 24/7.", 
      icon: <MessageSquare className="" />,
    },
  ];

  return (
    <section id="como-funciona" className=" bg-[#121829] text-white font-sans min-h-screen flex items-center">
     <div className="w-full  mx-auto px-6 lg:px-8 py-24 sm:py-32">
      <div className="text-center">
          <h2 className="text-4xl font-extrabold text-white-800 sm:text-5xl tracking-tight">
            Comece a Automatizar em <span className="text-teal-500">Poucos Passos</span>
          </h2>
          <p className="mt-4 text-lg text-white-600">
            Simplifique sua gestão hoteleira com o AutoBooks. É mais fácil do que você imagina.
          </p>
        </div>

        <div className="w-24 h-px  mx-auto my-12"></div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step) => (
            <StepCard
              key={step.id}
              icon={step.icon}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
