// src/components/layout/Sidebar.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, User, BarChart3, LogOut, X, Bot } from 'lucide-react';
import { usePathname } from 'next/navigation';


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Itens da navegação para facilitar a manutenção
const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, active: true },
  { href: '/profile', label: 'Perfil', icon: User, active: false },
  { href: '/crm', label: 'CRM', icon: BarChart3, active: false },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  return (
    <>
      {/* Overlay escuro que aparece atrás do menu */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Conteúdo do Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-4 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛎️</span>
            <span className="text-xl font-bold">AutoBooks</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex flex-col h-full">
          <ul className="space-y-2 flex-grow">
            {navItems.map((item) => (
              <li key={item.label}>
              <Link
                  href={item.href}
                  onClick={onClose} 
                  className={`flex items-center gap-3 p-3 rounded-md transition-colors ${
                    // 4. Lógica para destacar o link ativo
                    pathname === item.href
                      ? 'bg-teal-600 text-white' // Estilo de ativo
                      : 'hover:bg-gray-700'      // Estilo normal
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto">
            <button className="flex items-center gap-3 p-3 rounded-md transition-colors hover:bg-gray-700">
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}