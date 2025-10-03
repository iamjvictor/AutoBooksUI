import { Calendar, MessageCircle, CreditCard, Clock } from "lucide-react";

export const Features = () => {
  return (
    <section id="funcionalidades" className="py-16 bg-teal-100 pt-40">
      
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Tudo que você precisa em{" "}
          <span className="text-teal-600">uma plataforma</span>
        </h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Centralize seu atendimento, automatize reservas e pagamentos com
          ferramentas pensadas especialmente para o setor de hospitalidade.
        </p>

        {/* Cards */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Integração com WhatsApp */}
          <div className="p-6 bg-white rounded-xl shadow-md border hover:shadow-lg transition">
            <MessageCircle className="w-10 h-10 text-teal-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg text-gray-800">
              Integração com WhatsApp
            </h3>
            <p className="mt-2 text-gray-600 text-sm">
              Conecte seu número e gerencie todas as conversas em um só lugar.
            </p>
          </div>

          {/* Gestão de Reservas com IA */}
          <div className="p-6 bg-white rounded-xl shadow-md border hover:shadow-lg transition">
            <Calendar className="w-10 h-10 text-teal-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg text-gray-800">
              Gestão de Reservas
            </h3>
            <p className="mt-2 text-gray-600 text-sm">
              A IA agenda e confirma reservas diretamente no WhatsApp, com
              pagamento integrado.
            </p>
          </div>

          {/* Atendimento Inteligente */}
          <div className="p-6 bg-white rounded-xl shadow-md border hover:shadow-lg transition">
            <Clock className="w-10 h-10 text-teal-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg text-gray-800">
              Atendimento Inteligente
            </h3>
            <p className="mt-2 text-gray-600 text-sm">
              A IA responde automaticamente seguindo as regras e informações do
              seu estabelecimento.
            </p>
          </div>

          {/* Em breve */}
          <div className="p-6 bg-white rounded-xl shadow-md border hover:shadow-lg transition opacity-70">
            <CreditCard className="w-10 h-10 text-gray-400 mx-auto mb-4" />
            <h3 className="font-semibold text-lg text-gray-500">Em breve</h3>
            <p className="mt-2 text-gray-500 text-sm">
              Novas funcionalidades exclusivas serão lançadas em breve.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
