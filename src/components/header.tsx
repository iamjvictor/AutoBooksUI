// src/components/Header.tsx
import Link from 'next/link';

import React from 'react';



export const Header = () => {


  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-sm shadow-sm">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo e Nome do App */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🛎️</span>
          <span className="text-xl font-bold text-gray-800">
            AutoBooks
          </span>
        </Link>

        {/* Links de Navegação (centro) - some em telas pequenas */}
        <div className="hidden md:flex gap-8">
          <Link href="#funcionalidades" className="text-gray-600 hover:text-[#047857] transition-colors">
            Funcionalidades
          </Link>
          <Link href="#planos" className="text-gray-600 hover:text-[#047857] transition-colors">
            Planos
          </Link>
          <Link href="#como-funciona" className="text-gray-600 hover:text-[#047857] transition-colors">
            Como Funciona
          </Link>
        </div>

        {/* Botões de Ação (direita) */}
        <div className="flex items-center gap-4">
          <Link             
            href="/login" 
            className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          >
            Login
          </Link>
          <Link 
            
            href="/register" 
            className="px-4 py-2 text-sm font-medium text-white bg-[#047857] rounded-md hover:bg-[#065f46] transition-colors"
          >
            Começar Agora
          </Link>
        </div>
      </nav>
    </header>
  );
};