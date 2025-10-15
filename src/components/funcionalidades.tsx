import { Calendar, MessageSquare, BrainCircuit, BotMessageSquare } from "lucide-react";
import React from 'react';

// Sub-componente para cada card de funcionalidade, para um código mais limpo
const FeatureCard = (
  { icon: Icon, title, description, isComingSoon }: { icon: React.ElementType, title: string, description: string, isComingSoon?: boolean }
) => (
  <div className={`
    bg-white/5 border border-white/10 rounded-2xl p-6 text-center
    flex flex-col items-center transition-all duration-300
    ${isComingSoon ? 'opacity-50' : 'hover:bg-white/10 hover:-translate-y-2'}
  `}>
    <div className="mb-4 text-teal-400 bg-white/10 p-3 rounded-lg">
      <Icon className="w-8 h-8" strokeWidth={1.5} />
    </div>
    <h3 className={`font-bold text-lg ${isComingSoon ? 'text-slate-400' : 'text-teal-400'}`}>
      {title}
    </h3>
    <p className={`mt-2 ${isComingSoon ? 'text-slate-500' : 'text-slate-400'} text-sm`}>
      {description}
    </p>
  </div>
);

export const Features = () => {
  const featuresList = [
    {
      icon: MessageSquare,
      title: "Gateway de WhatsApp Integrado",
      description: "Conecte seu número e centralize todas as conversas e reservas em uma única plataforma, gerida pelo PM2 para máxima estabilidade."
    },
    {
      icon: Calendar,
      title: "Gestão de Reservas com IA",
      description: "Alfred, sua IA, agenda e confirma reservas diretamente no chat, com links de pagamento da Stripe integrados."
    },
    {
      icon: BrainCircuit,
      title: "Atendimento Inteligente 24/7",
      description: "A IA é treinada com as suas regras e informações, respondendo a perguntas frequentes e libertando a sua equipa."
    },
    {
      icon: BotMessageSquare,
      title: "Em breve: Dashboard Analítico",
      description: "Visualize métricas de atendimento, taxas de conversão e insights sobre as perguntas mais frequentes dos seus clientes.",
      isComingSoon: true
    }
  ];

  return (
    <section id="funcionalidades" className="bg-[#121829] text-white font-sans py-20 sm:py-32">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-extrabold text-white sm:text-5xl tracking-tight">
            Tudo que você precisa em <span className="text-teal-400">uma plataforma</span>
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Centralize seu atendimento, automatize reservas e pagamentos com ferramentas pensadas para o setor de hospitalidade.
          </p>
        </div>
        
        {/* Grid com os cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {featuresList.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              isComingSoon={feature.isComingSoon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
