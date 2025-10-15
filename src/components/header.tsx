// src/components/Header.tsx
import Link from 'next/link';

import React from 'react';



export const Header = () => {


  return (
    <header className="fixed top-0 left-0 w-full z-50  backdrop-blur-lg shadow-sm">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo e Nome do App */}
        <Link href="/" className="flex items-center gap-2">
        <img src="/logoSite.png" alt="Logo do Google Calendar" className="h-10 w-18" /> 
        </Link>

        {/* Links de Navegação (centro) - some em telas pequenas */}
        <div className="hidden md:flex gap-8">
          <Link href="#funcionalidades" className="text-teal-400 hover:text-[#047857] transition-colors">
            Funcionalidades
          </Link>
          <Link href="#planos" className="text-teal-400 hover:text-[#047857] transition-colors">
            Planos
          </Link>
          <Link href="#como-funciona" className="text-teal-400 hover:text-[#047857] transition-colors">
            Como Funciona
          </Link>
        </div>

        {/* Botões de Ação (direita) */}
        <div className="flex items-center gap-4">
          <Link             
            href="/login" 
            className="hidden sm:block px-4 py-2 text-sm font-medium text-teal-400 rounded-md hover:bg-gray-100 transition-colors"
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