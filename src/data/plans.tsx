// src/data/plans.ts

// 1. Feature agora pode ser uma string OU um objeto
export type Feature = string | { text: string; soon: boolean };

// 2. A interface Plan é atualizada para usar o novo tipo Feature
export interface Plan {
  id: string;
  name: string;
  price: string; // Ex: "R$ 97/mês"
  slogan: string;
  features: Feature[];
  popular?: boolean;
  avaiable: boolean;
}

// 3. A constante 'plans' agora com a estrutura de dados exata
export const plans: Plan[] = [
  {
   // id: "prod_T4JcAxvgvKBRkW",
    id: "price_1S8CXJAzh8iKKBsjp83bSYJV"  ,  
    name: "Essencial",
    price: "R$ 97/mês",
    slogan: "Sua recepção automática, 24 horas por dia.",
    popular: true,
    features: [
      "Assistente de IA com Base de Conhecimento (PDF)",
      "1 Rede Social Conectada (WhatsApp)",
      "Agendamento e Reservas Inteligentes",
      "Suporte Padrão (email e tickets)",

    ],
    avaiable: true
  },
  {
    id: "prod_T4L4fyS3ykjGTD",
    name: "Pro",
    price: "R$ 197/mês",
    slogan: "Transforme conversas em reservas pagas.",
    popular: true,
    features: [
      "Tudo do Essencial",
      
      
      "Lembretes Automáticos",
      "Relatórios de Atendimento",
      "Suporte Prioritário (chat)",
      { text: "CRM", soon: true },
    ],
    avaiable: false
  },
  {
    id: "prod_T4L4H0ZwQUwB4b",
    name: "Business",
    price: "R$ 297/mês",
    slogan: "Domine sua comunicação em todos os canais.",
    popular: false,
    features: [
      "Tudo do Pro",
      "Conexão Multi-canal (WhatsApp, Instagram, etc)",
      "Dashboard Executivo e Relatórios Avançados",
      "Ferramenta de pós Marketing",
      "Suporte Prioritário (chat)",
      { text: "CRM Enterprise", soon: true },
    ],
    avaiable: false
  },
];