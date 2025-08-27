"use client";

import { Menu } from "lucide-react";
import React from "react";

// O Header recebe uma função 'onMenuClick' como propriedade
interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 bg-white shadow-sm p-4 z-10">
      <div className="flex items-center">
        {/* Este botão, ao ser clicado, chamará a função para ABRIR a sidebar */}
        <button 
          onClick={onMenuClick} 
          className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
        >
          <Menu className="h-6 w-6" />
        </button>
        {/* Você pode adicionar outros elementos ao header aqui */}
      </div>
    </header>
  );
}