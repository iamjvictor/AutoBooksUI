// src/components/Hero.tsx
import React from "react";
import Image from "next/image";
import { Hotel, Home, LayoutList } from "lucide-react"; 

export const Hero = () => {
  return (
    // Container principal: A seção inteira agora tem o gradiente no fundo
    <section className="bg-teal-100 to-white pt-20 pb-20"> {/* Ajustado pb para dar espaço ao card */}
      <div className="max-w-7xl mx-auto pt-30 px-6 lg:px-8"> {/* Container principal da página */}
        
        {/* Parte Superior do Hero: Conteúdo Principal e Imagem */}
        <div className="grid md:grid-cols-2 gap-16 items-center"> {/* Removido px aqui, já está no container pai */}
          
          {/* Lado Esquerdo: Texto e CTAs */}
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Menos tempo no chat,{" "}
              <span className="text-teal-600">mais reservas</span>{" "}
              no balcão.
            </h1>
            <p className="mt-6 text-lg text-gray-700 max-w-lg">
              Automatize o agendamento e o atendimento 24h do seu hotel no WhatsApp com Alfred, seu recepcionista virtual inteligente, treinado por você.
            </p>
            
            <div className="mt-8 flex gap-4">
              <a
                href="/register"
                className="px-6 py-3 font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
              >
                Criar minha conta
              </a>
              <a
                href="/login"
                className="px-6 py-3 font-semibold text-teal-600 bg-white border border-teal-600 rounded-lg hover:bg-teal-50 transition-colors"
              >
                Fazer Login
              </a>
            </div>
          </div>

          {/* Lado Direito: Imagem do Hero */}
          <div className="hidden md:flex justify-center mt-10 lg:mt-0">
            <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-xl w-full max-w-xl border border-gray-100">
              <Image
                src="/HeroImage.png"
                alt="Dashboard do sistema AutoBooks mostrando a gestão de atendimento via WhatsApp"
                width={1200}
                height={750}
                priority 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Parte Inferior do Hero: "Feito especialmente para" - Agora DENTRO do mesmo container do gradiente */}
        {/* Esta div não precisa de -mt, pois o padding-bottom da seção principal já dá o espaço. */}
        <div className="mt-20"> {/* Ajuste este mt para controlar o espaçamento entre a parte superior e esta caixa */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"> {/* Fundo branco, shadow, e borda */}
            <div className="relative flex items-center mb-8">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                FEITO ESPECIALMENTE PARA
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              {/* Card para Hotéis */}
              <div className="flex flex-col items-center p-4">
                <div className="p-3 rounded-full bg-teal-50 mb-3">
                  <Hotel className="w-8 h-8 text-teal-600" />
                </div>
                <p className="text-lg font-medium text-gray-800">Hotéis</p>
              </div>
              {/* Card para Pousadas */}
              <div className="flex flex-col items-center p-4">
                <div className="p-3 rounded-full bg-teal-50 mb-3">
                  <Home className="w-8 h-8 text-teal-600" />
                </div>
                <p className="text-lg font-medium text-gray-800">Pousadas</p>
              </div>
              {/* Card para Hostels */}
              <div className="flex flex-col items-center p-4">
                <div className="p-3 rounded-full bg-teal-50 mb-3">
                  <LayoutList className="w-8 h-8 text-teal-600" />
                </div>
                <p className="text-lg font-medium text-gray-800">Hostels</p>
              </div>
            </div>
          </div>
        </div> {/* Fim da div mt-20 */}

      </div> {/* Fim do max-w-7xl mx-auto */}
    </section>
  );
};