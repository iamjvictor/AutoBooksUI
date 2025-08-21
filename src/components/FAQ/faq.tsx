// src/components/Faq.tsx
import AccordionItem from "./faqItem"; // Importa o componente que acabamos de criar

const faqData = [
  {
    question: "Preciso de conhecimento técnico para usar o Atende.AI?",
    answer: (
      <p>
        Não! Nossa plataforma foi desenhada para ser extremamente intuitiva. Com
        apenas alguns cliques, você conecta suas redes sociais e envia o PDF com
        as informações do seu negócio. O resto é com a nossa inteligência
        artificial.
      </p>
    ),
  },
  {
    question: "Meus dados e as conversas dos meus clientes estão seguros?",
    answer: (
      <p>
        Absolutamente. A segurança é nossa prioridade máxima. Utilizamos
        criptografia de ponta para proteger todas as informações e seguimos as
        melhores práticas de segurança de dados. Suas conversas e os dados dos
        seus clientes estão em um ambiente seguro e confidencial.
      </p>
    ),
  },
  {
    question: "Como funciona o cancelamento?",
    answer: (
      <p>
        A flexibilidade é total. Você pode cancelar sua assinatura a qualquer
        momento, sem burocracia ou multas. O acesso à plataforma permanecerá
        ativo até o final do seu ciclo de faturamento atual.
      </p>
    ),
  },
  {
    question: "A IA pode responder qualquer tipo de pergunta?",
    answer: (
      <p>
        Nossa IA é treinada especificamente com os documentos e informações que
        você fornece (como cardápios, catálogos, políticas, etc.). Ela é
        especialista em responder perguntas sobre o seu negócio. Para perguntas
        fora desse contexto, ela foi instruída a direcionar o cliente para o
        atendimento humano.
      </p>
    ),
  },
  
];

export default function Faq() {
  return (
    <section id="faq" className="bg-white py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Perguntas <span className="text-teal-600">Frequentes</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Esclarecemos as principais dúvidas sobre o Atende.AI
          </p>
        </div>
        <div className="mt-12">
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