// src/app/login/page.tsx"
"use client";
import { Bell } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/clients/supabaseClient";
import { useRef } from "react";
import { useState } from "react";
import Toast from "@/components/common/Toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import PhoneInput from 'react-phone-number-input';
import { E164Number } from "libphonenumber-js/core";
 
export default function LoginPage() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputType, setInputType] = useState<'email' | 'phone'>('email');
  const [phoneNumber, setPhoneNumber] = useState<E164Number | undefined>();
  const nav = useRouter();
  const supabase = createClient();

  const showToast = (message: string, type: 'success' | 'error' = 'error') => {   
    setToast({ message, type });
  };
  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); 
    setToast(null);

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    // Validação baseada no tipo de entrada
    if (inputType === 'phone') {
      if (!phoneNumber || !password) {
        showToast("Por favor, preencha todos os campos.");
        setIsLoading(false);
        return;
      }
    } else {
      if (!email || !password) {
        showToast("Por favor, preencha todos os campos.");
        setIsLoading(false);
        return;
      }
    }

    try {
      let loginCredentials;
      
      if (inputType === 'phone' && phoneNumber) {
        // Remove o + do número para enviar ao Supabase
        const phoneWithoutPlus = phoneNumber.replace('+', '');
        loginCredentials = {
          phone: phoneWithoutPlus,
          password
        };
      } else if (email) {
        loginCredentials = {
          email,
          password
        };
      } else {
        throw new Error("Dados de login inválidos.");
      }

      console.log("loginCredentials", loginCredentials);
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword(loginCredentials);

      console.log("signInError", signInError);
      if (signInError) {
        throw new Error("Email ou senha inválidos.");
      }
      
      // 3. Se não houve erro, a sessão no 'signInData' é a correta e nova
      const session = signInData.session;
      if (!session) {
          throw new Error("Não foi possível estabelecer uma sessão.");
      }

      console.log("TOKEN DE ACESSO PARA O POSTMAN:", session.access_token);
      
      // 4. Continua o fluxo com a sessão garantida
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });
      
      if (!response.ok) {
        throw new Error("Não foi possível carregar os dados do seu perfil.");
      }

      const profileData = await response.json(); 
      const { status } = profileData.profile;

      // 5. Lógica de redirecionamento
      if (status === 'onboarding_plans') {
        nav.push('/onboarding/planos');
      } else {
        nav.refresh();
        nav.push('/dashboard');
         // Atualiza os dados do dashboard
      }

    } catch (error) {
      console.error("Erro no login:", error);
      showToast((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-teal-600">
      <style jsx global>{`
        .PhoneInput {
          display: flex;
          width: 100%;
        }
        .PhoneInputCountrySelect {
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem 0 0 0.375rem;
          padding: 0.5rem 0.75rem;
          color: #111827;
          font-size: 1rem;
          outline: none;
        }
        .PhoneInputCountrySelect:focus {
          border-color: #0d9488;
          box-shadow: 0 0 0 1px #0d9488;
        }
        .PhoneInputInput {
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 0 0.375rem 0.375rem 0;
          border-left: none;
          padding: 0.5rem 0.75rem;
          color: #111827;
          font-size: 1rem;
          outline: none;
          width: 100%;
        }
        .PhoneInputInput:focus {
          border-color: #0d9488;
          box-shadow: 0 0 0 1px #0d9488;
        }
        .PhoneInputInput::placeholder {
          color: #9ca3af;
        }
      `}</style>
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
          {/* Campo de Email/Telefone */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700"
              >
                {inputType === 'email' ? 'Email' : 'Telefone'}
              </label>
              <button
                type="button"
                onClick={() => {
                  setInputType(inputType === 'email' ? 'phone' : 'email');
                  setPhoneNumber(undefined);
                  if (emailRef.current) {
                    emailRef.current.value = '';
                  }
                }}
                className="text-xs text-teal-600 hover:text-teal-700 underline"
              >
                {inputType === 'email' ? 'Usar telefone' : 'Usar email'}
              </button>
            </div>
            
            {inputType === 'phone' ? (
              <PhoneInput
                international
                defaultCountry="BR"
                value={phoneNumber}
                onChange={setPhoneNumber}
                className="mt-1"
                placeholder="Digite seu número"
              />
            ) : (
              <input
                type="email"
                id="email"
                ref={emailRef}
                name="email"
                placeholder="seu@email.com"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 text-black focus:border-teal-500"
              />
            )}
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
            <Link href="/forgot-password" className="text-sm text-teal-600 hover:underline">
              Esqueceu a senha?
            </Link>
          </div>

          {/* Botão de Entrar */}
          <div>
            <button
              type="submit"
              disabled={isLoading} // Desabilita o botão durante o carregamento
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-150 ease-in-out cursor-pointer disabled:bg-teal-400 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 className="animate-spin h-5 w-5" />}
              {isLoading ? 'Entrando...' : 'Entrar'}
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