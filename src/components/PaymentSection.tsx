import React from 'react';
import { ShieldCheck, Clock, CreditCard, Tag, RefreshCw, Eye, Edit } from 'lucide-react';

// Componente para um item de benefício reutilizável, agora estilizado para o tema escuro
// Sub-componente para cada passo, para um código mais limpo
const BenefitItem = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) =>  (
        <div className="
          bg-white/5 border border-white/10 rounded-2xl p-6 h-full 
          transition-all duration-300 hover:bg-white/10 hover:-translate-y-2
        ">
          <div className="flex items-start gap-4">
            {/* Ícone */}
            <div className="flex-shrink-0 text-teal-400 bg-white/10 p-3 rounded-lg">
              <Icon className="w-8 h-8" strokeWidth={1.5} />
            </div>
            {/* Bloco de Texto */}
            <div className="text-left">
              <h3 className="font-bold text-lg text-white">
                {title}
              </h3>
              <p className="mt-2 text-slate-400 text-sm">
                {description}
              </p>
            </div>
          </div>
        </div>
      );
      

const PartnersSection = () => {
    const stripeBenefits = [
        {
            icon: ShieldCheck,
            title: "Segurança Máxima PCI DSS",
            description: "Processamento certificado PCI DSS Level 1, a mais alta certificação de segurança da indústria de pagamentos."
        },
        {
            icon: Clock,
            title: "Saques Automáticos",
            description: "Seu dinheiro das reservas é depositado automaticamente em sua conta bancária após 30 dias de processamento."
        },
        {
            icon: CreditCard,
            title: "Apenas Cartão de Crédito/Débito",
            description: "Atualmente, aceitamos pagamentos via cartão de crédito e débito. Mais opções em breve!"
        },
        {
            icon: Tag,
            title: "Taxa Transparente da Stripe",
            description: "Apenas a taxa da Stripe: 3,99% + R$ 0,39 por transação bem-sucedida. Zero taxas extras do AutoBooks."
        }
    ];

    const googleBenefits = [
        {
            icon: RefreshCw,
            title: "Sincronização Automática",
            description: "Suas reservas do AutoBooks são automaticamente sincronizadas com seu Google Calendar."
        },
        {
            icon: Eye,
            title: "Visão Completa",
            description: "Veja todas as suas reservas e compromissos pessoais em uma única agenda."
        },
        {
            icon: Edit,
            title: "Edição Manual",
            description: "Flexibilidade para adicionar e ajustar reservas diretamente no Google Calendar, que serão refletidas no AutoBooks."
        },
        {
            icon: ShieldCheck, // Usando o mesmo ícone para consistência
            title: "Evite Conflitos",
            description: "Reduza overbookings e conflitos de agenda com uma gestão centralizada."
        }
    ];

    return (
      <section className=" bg-[#121829] text-white font-sans min-h-screen flex items-center">
        <div className="w-full  mx-auto px-6 lg:px-8 py-24 sm:py-32">
                {/* Cabeçalho da Seção */}
                <div className="text-center">
                    <h2 className="text-4xl font-extrabold sm:text-5xl tracking-tight">
                        Nossos Parceiros de <span className="text-teal-400">Confiança</span>
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
                        Integrações poderosas que simplificam sua gestão e potencializam seus resultados.
                    </p>
                </div>

                {/* Grid com os cartões dos parceiros */}
                <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
                    
                    {/* Cartão Stripe */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                        <div className="flex items-center gap-4">
                            <img src="/stripe-logo.svg" alt="Logo da Stripe" className="h-10 w-auto" />
                            <h3 className="text-2xl font-bold">Pagamentos seguros com <span className="text-teal-400">Stripe</span> </h3>
                        </div>
                        <p className="mt-4 text-slate-400">
                            Parceria com o líder mundial em pagamentos online. Receba de forma segura, rápida e transparente.
                        </p>
                        <div className="mt-8 space-y-6">
                            {stripeBenefits.map((benefit, index) => (
                                <BenefitItem
                                    key={index}
                                    icon={benefit.icon}
                                    title={benefit.title}
                                    description={benefit.description}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Cartão Google Calendar */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                        <div className="flex items-center gap-4">
                            <img src="/google-calendar-svgrepo-com.svg" alt="Logo do Google Calendar" className="h-10 w-10" />
                            <h3 className="text-2xl font-bold">Sincronize suas reservas e centralize com o <span className="text-teal-400"> Google Calendar</span>  </h3>
                        </div>
                        <p className="mt-4 text-slate-400">
                            Mantenha sua agenda organizada e atualizada. Visualize e gerencie todas as suas reservas em um só lugar.
                        </p>
                        <div className="mt-8 space-y-6">
                            {googleBenefits.map((benefit, index) => (
                                <BenefitItem
                                    key={index}
                                    icon={benefit.icon}
                                    title={benefit.title}
                                    description={benefit.description}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PartnersSection;

