// src/data/plans.ts

// 1. Feature agora pode ser uma string OU um objeto
export type Feature = string | { text: string; soon: boolean };

// 2. A interface Plan é atualizada para usar o novo tipo Feature
export interface Plan {
  name: string;
  price: string; // Ex: "R$ 97/mês"
  slogan: string;
  features: Feature[];
  popular?: boolean;
}

// 3. A constante 'plans' agora com a estrutura de dados exata
export const plans: Plan[] = [
  {
    name: "Essencial",
    price: "R$ 97/mês",
    slogan: "Sua recepção automática, 24 horas por dia.",
    popular: false,
    features: [
      "Assistente de IA com Base de Conhecimento (PDF)",
      "1 Rede Social Conectada (WhatsApp)",
      "Histórico de Conversas",
      "Suporte Padrão (email e tickets)",
      { text: "CRM Básico", soon: true },
    ],
  },
  {
    name: "Pro",
    price: "R$ 197/mês",
    slogan: "Transforme conversas em reservas pagas.",
    popular: true,
    features: [
      "Tudo do Essencial",
      "Agendamento e Reservas Inteligentes",
      "Confirmação com Pagamento Online",
      "Lembretes Automáticos",
      "Relatórios de Atendimento",
      "Suporte Prioritário (chat)",
      { text: "CRM Completo", soon: true },
    ],
  },
  {
    name: "Business",
    price: "R$ 297/mês",
    slogan: "Domine sua comunicação em todos os canais.",
    popular: false,
    features: [
      "Tudo do Pro",
      "Conexão Multi-canal (WhatsApp, Instagram, etc)",
      "Dashboard Executivo e Relatórios Avançados",
      "Suporte Prioritário (chat)",
      { text: "CRM Enterprise", soon: true },
    ],
  },
];