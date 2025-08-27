// src/app/login/page.tsx"
"use client";
import { Bell } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/clients/supabaseClient";
import { useRef } from "react";
import { useState } from "react";
import Toast from "@/components/common/Toast";
import { useRouter } from "next/navigation";
 
export default function LoginPage() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const nav = useRouter();
  const supabase = createClient();

  const showToast = (message: string, type: 'success' | 'error' = 'error') => {
   
    setToast({ message, type });
  };
  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Usuário não autenticado.");


    if (!email || !password) {
      showToast("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });
      
      if (!response.ok) {
        throw new Error("Não foi possível carregar os dados do seu perfil.");
      }

      const profileData = await response.json(); 
      console.log("Dados do perfil:", profileData);
      const status  = profileData.profile.status;


      // 3. Lógica de redirecionamento
      if (status === 'onboarding_plans') {
        console.log('DECISÃO: Redirecionando para /onboarding/planos');
        nav.push('/onboarding/planos');
      } else {
        console.log('DECISÃO: Redirecionando para /dashboard');
        nav.push('/dashboard');
      }


    } catch (error) {
      // ... (tratamento de erro)
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-teal-600">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        {/* Ícone e Título */}
        <div className="text-center">
          <span className="text-2xl">🛎️</span>
          <p className="mt-2 text-gray-600">
            Entre na sua conta AutoBooks
          </p>
        </div>

        {toast && (
                    <Toast 
                      message={toast.message} 
                      type={toast.type} 
                      onClose={() => setToast(null)} 
                    />
                  )}

        {/* Formulário */}
        <form onSubmit={doLogin} className="space-y-6">
          {/* Campo de Email */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              ref={emailRef}
              name="email"
              placeholder="seu@email.com"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 text-black focus:border-teal-500"
              
            />
          </div>

          {/* Campo de Senha */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              ref={passwordRef}
              name="password"
              placeholder="********"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none text-black focus:ring-teal-500 focus:border-teal-500"
              
            />
          </div>

          {/* Link "Esqueceu a senha?" */}
          <div className="text-right">
            <Link href="/recuperar-senha" className="text-sm text-teal-600 hover:underline">
              Esqueceu a senha?
            </Link>
          </div>

          {/* Botão de Entrar */}
          <div>
            <button 
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out"
            >
              Entrar
            </button>
          </div>
        </form>

        {/* Link de Cadastro */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Não tem uma conta?{' '}
          <Link href="/register" className="font-medium text-teal-600 hover:underline">
            Cadastre-se grátis
          </Link>
        </p>
      </div>
    </main>
  );
}