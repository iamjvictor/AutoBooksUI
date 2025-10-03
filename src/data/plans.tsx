// src/data/plans.ts

// 1. A estrutura de tipos permanece a mesma, está ótima.
export type Feature = string | { text: string; soon: boolean };

export interface Plan {
  id: string;
  name: string;
  price: string;
  slogan: string;
  features: Feature[];
  popular?: boolean;
  avaiable: boolean;
}

// 2. A constante 'plans' foi refatorada para focar nos benefícios e na clareza da oferta.
export const plans: Plan[] = [
  {
    // --- PLANO ESSENCIAL: O MVP COMPLETO E ATRAENTE ---
    // O objetivo é mostrar o imenso valor da automação principal.
    id: process.env.NEXT_PUBLIC_ID_ESSENTIAL || 'essential_plan',  
    name: "Essencial",
    price: "R$ 97/mês",
    slogan: "A automação completa para suas reservas no WhatsApp.",
    popular: true,
    features: [
      "Assistente de IA 24/7 (Alfred) no WhatsApp",
      "IA treinada com seu conhecimento (PDFs)",
      "Verificação de Disponibilidade em Tempo Real",
      "Criação de Pré-Reservas com Link de Pagamento",
      "Recebimento de Pagamentos via Cartão (Stripe)",
      "Saques Diários e Automáticos para sua conta",
      "Sincronização com Google Agenda",
      
    ],
    avaiable: true // Seu MVP está pronto!
  },
  {
    // --- PLANO PRO: O UPSELL LÓGICO COM FOCO EM GESTÃO ---
    // O grande diferencial é o CRM. Marcamos este como 'popular'.
    id: process.env.NEXT_PUBLIC_ID_PRO || 'pro_plan',
    name: "Pro",
    price: "R$ 197/mês",
    slogan: "Organize seus clientes e maximize suas vendas.",
    popular: true, // Este é o plano que você quer que a maioria dos clientes escolha.
    features: [
      "Tudo do plano Essencial, e mais:",
      "CRM Completo para gestão de leads e hóspedes",
      "Histórico de conversas centralizado",
      "Funil de Vendas Visual (Kanban)",
      "Relatórios de Atendimento e Reservas",
     
    ],
    avaiable: false // Marcar como 'true' quando o CRM estiver pronto.
  },
  {
    // --- PLANO BUSINESS: PARA QUEM QUER DOMINAR O MARKETING E ATENDIMENTO ---
    // Diferenciais claros: múltiplos canais e ferramentas de fidelização.
    id: process.env.NEXT_PUBLIC_ID_BUSINESS || 'business_plan',
    name: "Business",
    price: "R$ 297/mês",
    slogan: "Domine todos os canais e fidelize seus clientes.",
    features: [
      "Tudo do plano Pro, e mais:",
      "Conexão Multi-canal (Instagram e Facebook Messenger)",
      "Ferramentas de Pós-Marketing", // Usando objeto para criar um "título" na lista
      "   Campanhas de Reengajamento ", // Sub-item para clareza
      "  Google Follow Up", // Sub-item
      "Dashboard Executivo com Métricas Avançadas",
      
    ],
    avaiable: false // Marcar como 'true' quando estas features estiverem prontas.
  },
];