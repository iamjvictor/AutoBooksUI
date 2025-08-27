"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/clients/supabaseClient";

import Toast from "@/components/common/Toast";



export default function RegisterPage() {
  
const estadosBrasileiros = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    whatsappNumber: "",
    businessName: "",
    // O objeto de localização já existe desde o início
    businessLocation: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const nav = useRouter();
  const supabase = createClient();

  const showToast = (message: string, type: 'success' | 'error' = 'error') => {
    console.log('--- CHAMANDO showToast ---');
    console.log('Mensagem:', message);
    setToast({ message, type });
  };

  // Estado para gerenciar o erro de senha
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement  | HTMLSelectElement> ) => {
    const { name, value } = e.target;
    
    // Verifica se o campo que mudou pertence à localização
    if (['address', 'city', 'state', 'zipCode'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        businessLocation: {
          ...prev.businessLocation, // Mantém os outros campos de localização
          [name]: value, // Atualiza apenas o que foi alterado
        }
      }));
    } else {
      // Se não for um campo de localização, atualiza o nível principal
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    // Validação em tempo real
    if (name === "confirmPassword" && newFormData.password !== value) {
      setPasswordError("As senhas não coincidem.");
    } else if (name === "password" && newFormData.confirmPassword && value !== newFormData.confirmPassword) {
      setPasswordError("As senhas não coincidem.");
    }
    else {
      setPasswordError("");
    }
  };

// Dentro do seu componente RegisterPage

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);
    
    

    setIsSubmitting(true);   

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const responseData = await response.json();
        if (!response.ok) {
          
          if (responseData.errors) {
            // Se o backend enviou os erros detalhados do Zod...
            // Pega a primeira mensagem de erro do primeiro campo que falhou.
            const firstErrorField = Object.keys(responseData.errors)[0];
            const firstErrorMessage = responseData.errors[firstErrorField][0];
            showToast(firstErrorMessage); // ...e exibe no toast!
          } else {
            // Se foi outro tipo de erro do backend, mostra a mensagem principal.
            showToast(responseData.message || "Ocorreu um erro ao processar sua solicitação.");
          }
          
          setIsSubmitting(false); // Para o loading
          return; // PARA a execução aqui.
        }
      
      console.log("Conta criada com sucesso no backend!", responseData.user);  
      
      const { error: signInError } = await supabase.auth.signInWithPassword({ 
        email: formData.email, 
        password: formData.password 
      });

      if (signInError) throw signInError;
     
      nav.refresh();
      nav.push('/onboarding/planos');

    } catch (error) {
      console.error("Erro na requisição ou login:", error);
      showToast((error as Error).message); // Use o toast para exibir o erro da API também
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <main className="flex items-center justify-center min-h-screen bg-teal-600 py-4">
      <div className="w-full max-w-lg p-4 space-y-6 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
         <span className="text-2xl">🛎️</span>
          <h1 className=" text-2xl font-bold text-gray-900">Crie sua conta</h1>

        </div>
        {toast && (
            <Toast 
              message={toast.message} 
              type={toast.type} 
              onClose={() => setToast(null)} 
            />
          )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome completo</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Seu nome"  className="mt-1 block w-full input-style" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="seu@email.com"  className="mt-1 block w-full input-style" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Crie uma senha</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handlePasswordChange} placeholder="Mínimo 8 caracteres"  className="mt-1 block w-full input-style" />
          </div>
          <div>
            <label htmlFor="confirmPassword"className="block text-sm font-medium text-gray-700">Confirme sua senha</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handlePasswordChange} placeholder="Repita a senha"  className="mt-1 block w-full input-style" />
            {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
          </div>
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">Nome do estabelecimento</label>
            <input type="text" id="businessName" name="businessName" value={formData.businessName} onChange={handleChange} placeholder="Hotel, Pousada, etc." className="mt-1 block w-full input-style" />
          </div>
          <div>
            <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">Número do WhatsApp</label>
            <input type="tel" id="whatsappNumber" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} placeholder="(XX) 9XXXX-XXXX"  className="mt-1 block w-full input-style" />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Endereço</label>
            <input type="text" id="address" name="address" value={formData.businessLocation.address} onChange={handleChange} placeholder="Rua, Número, Bairro" className="mt-1 block w-full input-style" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">Cidade</label>
              <input type="text" id="city" name="city" value={formData.businessLocation.city} onChange={handleChange} className="mt-1 block w-full input-style" />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">Estado</label>
              <select 
                id="state" 
                name="state" 
                value={formData.businessLocation.state} 
                onChange={handleChange} 
                className="mt-1 block w-full input-style"
              >
                <option value="" disabled>Selecione...</option>
                {estadosBrasileiros.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">CEP</label>
              <input type="text" id="zipCode" name="zipCode" value={formData.businessLocation.zipCode} onChange={handleChange} className="mt-1 block w-full input-style" />
            </div>
          </div>

          <div>
            <button type="submit" className="w-full flex justify-center py-3 px-4 mt-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
              Criar conta e avançar
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Já tem uma conta?{" "}
          <Link href="/login" className="font-medium text-teal-600 hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </main>
  );
}