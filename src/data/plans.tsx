// src/data/plans.ts

// A estrutura de tipos, permitindo destacar features, está ótima.
export type Feature = string | { text: string; highlight?: boolean; avaiable?: boolean };

export interface Plan {
  id: string;
  name: string;
  price: string;
  slogan: string;
  features: Feature[];
  popular?: boolean;
  avaiable: boolean;
}

// --- BENEFÍCIOS DO PLANO ESSENCIAL ---
// Agrupamos os benefícios principais para serem reutilizados e listados em todos os planos.
const essentialFeatures: Feature[] = [
  "Assistente Virtual 24/7 no WhatsApp",
  "IA Treinada com as Informações do seu Hotel",
  "Agendamento de Reservas Automatizado",
  "Recebimento Automático de Pagamentos (Cartão)",
  "Repasses Diários e Automáticos para sua conta",
  "Sincronização com a sua Agenda Google",
];

export const plans: Plan[] = [
  {
    // --- PLANO ESSENCIAL: A automação completa do seu WhatsApp ---
    id: process.env.NEXT_PUBLIC_ID_ESSENTIAL || 'essential_plan',  
    name: "Essencial",
    price: "R$ 97/mês",
    slogan: "Sua recepção automática, 24 horas por dia.",
    features: [
      ...essentialFeatures,
    ],
    avaiable: true,
  },
  {
    // --- PLANO PRO: Adiciona a camada de gestão e organização ---
    id: process.env.NEXT_PUBLIC_ID_PRO || 'pro_plan',
    name: "Pro",
    price: "R$ 197/mês",
    slogan: "Organize seus hóspedes e profissionalize sua gestão.",
    popular: true, // Marcamos este como o mais popular para guiar a escolha.
    features: [
      "Tudo do plano Essencial, e mais:",
      { text: "Painel de Gestão de Hóspedes (CRM)", highlight: true, avaiable: false },
      "Histórico de Conversas Centralizado",
      "Funil de Reservas Visual",
      "Relatórios de Atendimento e Faturamento",
    ],
    avaiable: false,
  },
  {
    // --- PLANO BUSINESS: Adiciona a camada de marketing e expansão ---
    id: process.env.NEXT_PUBLIC_ID_BUSINESS || 'business_plan',
    name: "Business",
    price: "R$ 297/mês",
    slogan: "Domine todos os canais e fidelize seus clientes.",
    features: [
      "Tudo do plano Pro, e mais:",
      { text: "Conexão com Instagram e Facebook", highlight: true, avaiable: false },
      { text: "Ferramentas de Pós-Marketing", highlight: true, avaiable: false },
      "Campanhas de Reengajamento",
      "Solicitação Automática de Avaliações no Google",
      "Dashboard com Métricas Avançadas",
    ],
    avaiable: false,
  },
];
