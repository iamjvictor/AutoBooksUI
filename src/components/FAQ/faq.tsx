// src/components/Faq.tsx
import AccordionItem from "./faqItem"; // Importa o componente que acabamos de criar

const faqData = [
  {
    question: "Em quanto tempo consigo começar a usar o AutoBooks?",
    answer: (
      <p>
        A configuração do AutoBooks é projetada para ser concluída em **menos de 15 minutos**. Em apenas alguns passos simples, você cadastra seu estabelecimento, informa seus quartos, configura os pagamentos e conecta o WhatsApp, estando pronto para automatizar seu atendimento.
      </p>
    ),
  },
  {
    question: "Preciso de conhecimento técnico para configurar o AutoBooks ou integrar com a Stripe/Google Calendar?",
    answer: (
      <p>
        Absolutamente não! A plataforma foi desenvolvida para ser **intuitiva e fácil de usar**. Nossas interfaces de conexão com a Stripe e o Google Calendar são guiadas e podem ser feitas em poucos cliques, sem a necessidade de desenvolvedores ou conhecimentos técnicos avançados.
      </p>
    ),
  },
  {
    question: "Meus dados e as conversas dos meus clientes estão seguros?",
    answer: (
      <p>
        Sim, a segurança é nossa prioridade máxima. Utilizamos criptografia de ponta para proteger todas as informações e seguimos as melhores práticas de segurança de dados. Suas conversas e os dados dos seus clientes estão em um ambiente seguro e confidencial.
      </p>
    ),
  },
  {
    question: "Além da mensalidade, existem outras taxas cobradas pelo AutoBooks?",
    answer: (
      <p>
        **Não!** O AutoBooks não cobra nenhuma taxa ou comissão adicional sobre suas reservas. Sua assinatura é uma mensalidade fixa e transparente. As únicas taxas extras são as de processamento de cartão (da nossa parceira Stripe) por transação bem-sucedida.
      </p>
    ),
  },
  {
    question: "Quais são as taxas de processamento da Stripe?",
    answer: (
      <p>
        A Stripe cobra uma taxa de **3.99% sobre o valor da transação + R$ 0,39 por transação**. Essa taxa é padrão no mercado para pagamentos online. O AutoBooks não adiciona nada a isso.
      </p>
    ),
  },
  {
    question: "Quais formas de pagamento são aceitas pelo AutoBooks?",
    answer: (
      <p>
        Atualmente, a plataforma aceita pagamentos via **cartão de crédito e débito** (Visa, Mastercard, Elo, Amex, etc.). Estamos trabalhando para integrar outras opções em breve, como Pix.
      </p>
    ),
  },
  {
    question: "Como funciona o cancelamento da assinatura?",
    answer: (
      <p>
        A flexibilidade é total. Você pode cancelar sua assinatura a qualquer momento, sem burocracia ou multas. O acesso à plataforma permanecerá ativo até o final do seu ciclo de faturamento atual.
      </p>
    ),
  },
  {
    question: "A IA pode responder qualquer tipo de pergunta?",
    answer: (
      <p>
        Nossa IA é treinada especificamente com os documentos e informações que você fornece (como cardápios, catálogos, políticas, etc.). Ela é especialista em responder perguntas sobre o seu negócio. Para perguntas fora desse contexto, ela foi instruída a direcionar o cliente para o atendimento humano.
      </p>
    ),
  },
  
];

export default function Faq() {
  return (
    <section id="faq" className="bg-teal-100 py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t pb-20 border-gray-900" />
        </div>
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Perguntas <span className="text-teal-600">Frequentes</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Esclarecemos as principais dúvidas sobre o Atende.AI
          </p>
        </div>
        <div className="mt-12 bg-white rounded-lg p-8">
          {faqData.map((item, index) => (
            <AccordionItem
              key={index}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
    </section>
  );
}