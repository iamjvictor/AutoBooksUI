// src/app/register/page.tsx

"use client";

import { Bell } from "lucide-react";
import Link from "next/link";

import React, { useState } from "react";
import Navigation from "next/navigation";

export default function RegisterPage() {
  // Estado para gerenciar os dados do formulário
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    whatsappNumber: "",
    businessName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nav = Navigation.useRouter();

  // Estado para gerenciar o erro de senha
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("As senhas não coincidem.");
      return;
    }
    
    setIsSubmitting(true);

    try {
      // 2. Chamar sua API para criar o usuário (o lead)
      // Exemplo:
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      // if (!response.ok) {
      //   // Tratar erros da API aqui (ex: email já existe)
      //   throw new Error('Falha ao criar a conta.');
      // }
      
      console.log("Lead capturado com sucesso! Redirecionando...", formData);

      
      nav.push('/onboarding/planos');

    } catch (error) {
      console.error(error);
      // Exibir uma mensagem de erro para o usuário
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

        <form onSubmit={handleSubmit} className="space-y-4">
          
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome completo</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Seu nome" required className="mt-1 block w-full input-style" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="seu@email.com" required className="mt-1 block w-full input-style" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Crie uma senha</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handlePasswordChange} placeholder="Mínimo 8 caracteres" required className="mt-1 block w-full input-style" />
          </div>
          <div>
            <label htmlFor="confirmPassword"className="block text-sm font-medium text-gray-700">Confirme sua senha</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handlePasswordChange} placeholder="Repita a senha" required className="mt-1 block w-full input-style" />
            {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
          </div>
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">Nome do estabelecimento</label>
            <input type="text" id="businessName" name="businessName" value={formData.businessName} onChange={handleChange} placeholder="Hotel, Pousada, etc." className="mt-1 block w-full input-style" />
          </div>
          <div>
            <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">Número do WhatsApp</label>
            <input type="tel" id="whatsappNumber" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} placeholder="(XX) 9XXXX-XXXX" required className="mt-1 block w-full input-style" />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Endereço</label>
            <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Rua, Número, Bairro" className="mt-1 block w-full input-style" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">Cidade</label>
              <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} className="mt-1 block w-full input-style" />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">Estado</label>
              <input type="text" id="state" name="state" value={formData.state} className="mt-1 block w-full input-style" />
            </div>
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">CEP</label>
              <input type="text" id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} className="mt-1 block w-full input-style" />
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