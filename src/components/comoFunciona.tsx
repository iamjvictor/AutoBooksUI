// src/components/HowItWorks.tsx
import { Building2, Share2, Upload, Sparkles } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Cadastre seu estabelecimento",
      description:
        "Insira as informações do seu negócio para personalizar a assistente virtual.",
      icon: <Building2 className="w-8 h-8 text-white" />, // Ícone de hotel/prédio
    },
    {
      id: 2,
      title: "Conecte suas contas",
      description:
        "Vincule WhatsApp, Instagram e outras redes sociais em segundos.",
      icon: <Share2 className="w-8 h-8 text-white" />,
    },
    {
      id: 3,
      title: "Envie seu documento",
      description:
        "Faça upload das informações do seu estabelecimento para treinar a IA.",
      icon: <Upload className="w-8 h-8 text-white" />,
    },
    {
      id: 4,
      title: "Deixe a IA trabalhar",
      description:
        "Sua assistente virtual está pronta para atender clientes 24/7.",
      icon: <Sparkles className="w-8 h-8 text-white" />,
    },
  ];

  return (
    <section id="como-funciona" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Como funciona o <span className="text-teal-600">Atende.AI</span>
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          Configuração simples em apenas 4 passos. Comece a automatizar seu
          atendimento em menos de 5 minutos.
        </p>

        <div className="grid md:grid-cols-4 gap-12">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-teal-600 shadow-lg mb-6">
                {step.icon}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white text-sm font-bold">
                  {step.id}
                </span>
                <h3 className="text-xl font-semibold text-gray-800">
                  {step.title}
                </h3>
              </div>
              <p className="text-gray-600 max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
