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
    id: "price_1S8AytB29olWOHM6GmiUlVGa"  ,  
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
    id: "price_1S8CO2B29olWOHM6kwXcwuh5",
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
    id: "price_1S8COGB29olWOHM6sgmTFGGX",
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