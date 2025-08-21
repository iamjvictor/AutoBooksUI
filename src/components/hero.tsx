// Hero.tsx
import React from "react";
import Image from "next/image";
import HeroImage from "../public/HeroImage.png"; // Substitua pelo caminho correto da sua imagem


export const Hero = () => {
  return (
    <section className="h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Texto */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Menos tempo no chat,{" "}
            <span className="text-[#0D9488] text-5xl md:text-6xl font-serif">
              mais reservas
            </span>{" "}
            no balcão.
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Seu recepcionista virtual 24h no WhatsApp, treinado por você.
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
              className="px-6 py-3 font-semibold text-teal-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Fazer Login
            </a>
          </div>
        </div>

        <div className="hidden md:flex justify-center mt-10">
          <div className="bg-teal-50 p-4 lg:p-6 rounded-2xl shadow-xl w-full max-w-5xl">
            <Image
              src="/HeroImage.png" // <-- AQUI ESTÁ A CORREÇÃO
              alt="Dashboard do sistema Atende.AI mostrando a gestão de leads"
              width={1200}
              height={750}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
