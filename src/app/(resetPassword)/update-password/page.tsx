"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/clients/supabaseClient'; // Ajuste o caminho se necessário
import { useRouter } from 'next/navigation';
import { KeyRound, Loader2 } from 'lucide-react';
import Toast from '@/components/common/Toast';

export default function UpdatePasswordPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Estado para controlar o status da verificação
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');

  // Este useEffect agora verifica ativamente se uma sessão foi criada
  useEffect(() => {
    const checkSession = async () => {
      // O middleware e o cliente Supabase já usaram o 'code' da URL para criar uma sessão.
      // Nós apenas precisamos verificar se ela existe.
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Se encontramos um usuário, a verificação foi um sucesso!
        setVerificationStatus('success');
      } else {
        // Se não, o link era inválido ou expirou.
        setVerificationStatus('failed');
      }
    };
    
    // Pequeno timeout para dar tempo ao cliente Supabase de processar o token da URL
    setTimeout(checkSession, 500);
    
  }, [supabase]);

  const showToast = (message: string, type: 'success' | 'error' = 'error') => {
    setToast({ message, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      showToast('A senha deve ter pelo menos 8 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      showToast('As senhas não coincidem.');
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (error) {
      showToast(`Erro ao atualizar senha: ${error.message}`);
    } else {
      showToast('Senha atualizada com sucesso! Redirecionando...', 'success');
      await supabase.auth.signOut(); // Desloga para forçar o login com a nova senha
      setTimeout(() => router.push('/login'), 2000);
    }
  };
  
  // Renderiza a UI com base no status da verificação
  return (
    <main className="flex items-center justify-center min-h-screen bg-teal-600">
       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        {verificationStatus === 'verifying' && (
          <div className="text-center">
            <h1 className="text-xl font-bold">Verificando seu link...</h1>
            <p className="text-gray-600 mt-2">Aguarde um momento.</p>
          </div>
        )}

        {verificationStatus === 'failed' && (
          <div className="text-center">
            <h1 className="text-xl font-bold text-red-500">Link inválido ou expirado.</h1>
            <p className="text-gray-600 mt-2">Por favor, solicite um novo link de recuperação.</p>
          </div>
        )}

        {verificationStatus === 'success' && (
          <>
            <div className="text-center">
              <KeyRound className="mx-auto h-12 w-12 text-teal-500" />
              <h1 className="text-2xl font-bold text-gray-900 mt-4">Crie sua Nova Senha</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 text-black">
              <div>
                <label htmlFor="password">Nova Senha</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full input-style" />
              </div>
              <div>
                <label htmlFor="confirmPassword">Confirme a Nova Senha</label>
                <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="mt-1 block w-full input-style" />
              </div>
              <div>
                <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out">
                  {loading ? <Loader2 className="animate-spin" /> : 'Salvar Nova Senha'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </main>
  );
}