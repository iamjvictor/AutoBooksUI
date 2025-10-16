"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, BarChart3, Bot, X, LogOut, Share2, MessageSquare, Calendar } from 'lucide-react';
import { createClient } from '@/clients/supabaseClient'; // Ajuste o caminho se necessário
import { useRouter } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/profile', label: 'Perfil', icon: User },
  { href: '/reservas', label: 'Reservas', icon: Calendar },
  { href: '/crm', label: 'CRM', icon: BarChart3, disabled: true, comingSoon: true },
  { href: '/marketing', label: 'Campanhas', icon: Share2, disabled: true, comingSoon: true },
  { href: '/canais', label: 'Meus Canais', icon: MessageSquare, disabled: true, comingSoon: true },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
    onClose(); // Fecha a sidebar após o logout
  };

  

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        
      />
      
      {/* Conteúdo do Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-4 z-50 flex flex-col transition-transform duration-300 ease-in-out ${
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

        {/* O <nav> agora ocupa o espaço restante */}
        <nav className="flex flex-col flex-grow">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.disabled ? (
                  <div className="flex items-center gap-3 p-3 rounded-md transition-colors opacity-50 cursor-not-allowed">
                    <item.icon className="h-5 w-5" />
                    <span className="flex-1">{item.label}</span>
                    {item.comingSoon && (
                      <span className="bg-yellow-500 text-yellow-900 text-xs px-2 py-1 rounded-full font-medium">
                        Em breve
                      </span>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onClose} 
                    className={`flex items-center gap-3 p-3 rounded-md transition-colors ${
                      pathname === item.href
                        ? 'bg-teal-600 text-white'
                        : 'hover:bg-gray-700'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* ESTA É A PARTE CORRIGIDA */}
          <div className="mt-auto">
            <button 
              onClick={handleLogout} // O onClick vai no botão
              className="w-full flex items-center gap-3 p-3 rounded-md text-gray-300 transition-colors hover:bg-red-500 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}