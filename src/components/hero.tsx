"use client";
import React from "react";
import { Hotel, Home, LayoutList } from "lucide-react";

// Componente para o Logo do AutoBooks (similar ao do template)


export const Hero = () => {
  return (
    <>
      {/* --- Seção Hero Principal (Ocupa o Ecrã Inteiro) --- */}
      <section className="hero-section bg-[#121829] text-white font-sans min-h-screen flex flex-col justify-center">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-24 sm:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Coluna de Texto (Esquerda) */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                Menos tempo no chat, <br />
                <span className="text-teal-400">mais reservas</span> no balcão.
              </h1>
              <p className="mt-6 text-lg text-slate-300 max-w-lg mx-auto lg:mx-0">
                Automatize o agendamento e o atendimento 24h do seu hotel no WhatsApp com Alfred, seu recepcionista virtual inteligente.
              </p>
              <div className="mt-10">
                <a 
                  href="/register" 
                  className="inline-block bg-teal-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-teal-600"
                >
                  Comece a Automatizar
                </a>
              </div>
            </div>

            {/* Coluna de Imagem (Direita) - Imagens Sobrepostas */}
            <div className="relative flex items-center justify-center h-full min-h-[400px]">
                {/* Efeito de Brilho */}
                <div className="absolute w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"></div>
                
                {/* Container para as duas imagens */}
                <div className="relative w-full h-80">
                    {/* Imagem de Trás (Dashboard) */}
                    <div className="absolute top-0 right-0 w-full max-w-md transform rotate-6 -translate-x-4 translate-y-16 rounded-lg shadow-2xl overflow-hidden">
                        <img
                            src="/WPPWEB.png"
                            alt="Dashboard do sistema AutoBooks"
                            className="w-full h-auto"
                            onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400/1C163C/FFFFFF?text=Dashboard')}
                        />
                    </div>
                    {/* Imagem da Frente (Chat) - Borda Removida */}
                    <div className="absolute bottom-0 left-0 w-2/3 max-w-[280px] transform -rotate-8 translate-x-4 -translate-y-16 rounded-lg shadow-2xl overflow-hidden">
                        <img
                            src="/WhatsMObile.png"
                            alt="Conversa de agendamento no WhatsApp"
                            className="w-full h-auto"
                            onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x700/1C163C/FFFFFF?text=Chat')}
                        />
                    </div>
                </div>
            </div>

          </div>
          
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              {/* Card para Hotéis */}
              <div className="flex flex-col items-center p-4">
                <div className="p-4 rounded-full bg-teal-50 mb-4 border border-teal-100">
                  <Hotel className="w-8 h-8 text-teal-600" />
                </div>
                <p className="text-lg font-semibold text-white">Hotéis</p>
              </div>
              {/* Card para Pousadas */}
              <div className="flex flex-col items-center p-4">
                <div className="p-4 rounded-full bg-teal-50 mb-4 border border-teal-100">
                  <Home className="w-8 h-8 text-teal-600" />
                </div>
                <p className="text-lg font-semibold text-white">Pousadas</p>
              </div>
              {/* Card para Hostels */}
              <div className="flex flex-col items-center p-4">
                <div className="p-4 rounded-full bg-teal-50 mb-4 border border-teal-100">
                  <LayoutList className="w-8 h-8 text-teal-600" />
                </div>
                <p className="text-lg font-semibold text-white">Hostels</p>
              </div>
            </div>
      </section>

     
           

           
        
    </>
  );
};

export default Hero;

