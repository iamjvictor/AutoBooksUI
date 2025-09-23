"use client";

import React, { useState } from 'react';
import { createClient } from '@/clients/supabaseClient';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import Toast from '@/components/common/Toast'; // Reutilizando nosso componente de Toast

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'error') => {
    setToast({ message, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // 1. Chama a função do Supabase para enviar o email de recuperação
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // 2. Define para qual página o usuário será redirecionado a partir do link no email
      redirectTo: `${window.location.origin}/update-password`,
    });

    setLoading(false);
    if (error) {
      showToast(`Erro: ${error.message}`);
    } else {
      // Por segurança, sempre mostramos uma mensagem de sucesso,
      // mesmo que o email não exista no banco.
      showToast('Se uma conta com este email existir, um link de recuperação foi enviado.', 'success');
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-teal-600">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <Mail className="mx-auto h-12 w-12 text-teal-500" />
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Recuperar Senha</h1>
          <p className="mt-2 text-gray-600">
            Digite seu email e enviaremos um link para você criar uma nova senha.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="mt-1 block w-full input-style"
              required
            />
          </div>
          
          <div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 bg-teal-600 text-white rounded-md hover:bg-teal-700">
              {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm">
          <Link href="/login" className="font-medium text-teal-600 hover:underline">
            Lembrou a senha? Voltar para o Login
          </Link>
        </p>
      </div>
    </main>
  );
}