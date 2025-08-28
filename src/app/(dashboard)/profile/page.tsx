"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { createClient } from "@/clients/supabaseClient";
import { User, Building, Phone, MapPin, Loader2, Pencil, Save, X } from "lucide-react";
import Link from "next/link";
import { UserProfile } from "@/types/user";

// PASSO 1: O componente ProfileField foi movido para FORA do ProfilePage.
// Agora ele é um componente independente e estável.
const ProfileField = ({ 
  label, 
  name, 
  value, 
  icon: Icon, 
  isEditing,    // <-- Adicionamos as props necessárias
  handleChange  // <--
}: { 
  label: string; 
  name: keyof UserProfile; 
  value: string; 
  icon: React.ElementType; 
  isEditing: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center">
    <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
      <Icon size={16}/> {label}
    </dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
      {isEditing ? (
        <input 
          type="text" 
          name={name} 
          value={value} 
          onChange={handleChange} 
          className="w-full input-style" // Adicione suas classes de estilo aqui
        />
      ) : (
        <span className="py-2 block">{value || "Não informado"}</span>
      )}
    </dd>
  </div>
);


export default function ProfilePage() {
  const { userData, loading: userLoading } = useUser();
  const [formData, setFormData] = useState<Partial<UserProfile> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    if (userData?.profile) {
      setFormData(userData.profile);
    }
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => (prev ? { ...prev, [name]: value } : null));
  };

  const sendResetEmail = async () => {
    if (!formData) return;

    const { email } = formData;

    if (!email) {
      alert("Por favor, forneça um endereço de email.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/send-reset-password-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao enviar email.");
      }

      alert("Email de redefinição de senha enviado com sucesso!");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Ocorreu um erro desconhecido.");
      }
    }
  }

 const handleSave = async () => {
    if (!formData) return;
    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Usuário não autenticado.");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao atualizar o perfil.");
      }
      
      alert("Perfil atualizado com sucesso!"); // Lembre-se de substituir por um Toast/Notificação se preferir
      setIsEditing(false);
      
      // Lembrete: Para uma melhor UX, o ideal é atualizar o UserContext aqui
      // em vez de recarregar a página. Ex: await refetchUserData();
      // window.location.reload();

    } catch (error) {
      // É uma boa prática usar 'error instanceof Error' para mais segurança
      if (error instanceof Error) {
        alert(error.message); // Substitua por um Toast/Notificação
      } else {
        alert("Ocorreu um erro desconhecido.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (userData?.profile) setFormData(userData.profile);
    setIsEditing(false);
  };

  if (userLoading) {
    return <div className="p-8">Carregando...</div>;
  }
  if (!formData) {
    return <div className="p-8">Perfil não encontrado. <Link href="/login">Faça o login.</Link></div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-teal-100 p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
           <div className="w-full flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                {/* Lado Esquerdo: Título e Subtítulo */}
                <div>
                    <h2 className="text-xl font-semibold leading-6 text-gray-900">Meu Perfil</h2>
                    <p className="mt-1 text-sm text-gray-500">Gerencie suas informações.</p>
                </div>

                {/* Lado Direito: Botões com Lógica Condicional */}
                <div>
                        {isEditing ? (
                            // --- Modo de Edição ---
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={handleSave} 
                                    disabled={isSaving} 
                                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? (
                                        <Loader2 className="animate-spin h-4 w-4" />
                                    ) : (
                                        <Save size={16} />
                                    )}
                                    {isSaving ? "Salvando..." : "Salvar"}
                                </button>
                                
                                <button 
                                    onClick={handleCancel} 
                                    disabled={isSaving}
                                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    <X size={16} />
                                    Cancelar
                                </button>
                            </div>

                        ) : (
                            // --- Modo de Visualização ---
                            <button 
                                onClick={() => setIsEditing(true)} 
                                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <Pencil size={16} />
                                Editar Perfil
                            </button>
                        )}
                    </div>
                </div>
          </div>

          <dl className="divide-y divide-gray-200">
            {/* PASSO 2: Agora passamos as props 'isEditing' e 'handleChange' para cada ProfileField */}
            <ProfileField label="Nome do Responsável" name="full_name" value={formData.full_name || ''} icon={User} isEditing={isEditing} handleChange={handleChange} />
            <ProfileField label="Nome do Estabelecimento" name="business_name" value={formData.business_name || ''} icon={Building} isEditing={isEditing} handleChange={handleChange} />
            <ProfileField label="WhatsApp" name="whatsapp_number" value={formData.whatsapp_number || ''} icon={Phone} isEditing={isEditing} handleChange={handleChange} />
            <ProfileField label="Endereço" name="address" value={formData.address || ''} icon={MapPin} isEditing={isEditing} handleChange={handleChange} />
            <ProfileField label="Cidade" name="city" value={formData.city || ''} icon={MapPin} isEditing={isEditing} handleChange={handleChange} />
            <ProfileField label="Estado" name="state" value={formData.state || ''} icon={MapPin} isEditing={isEditing} handleChange={handleChange} />
            <ProfileField label="CEP" name="zip_code" value={formData.zip_code || ''} icon={MapPin} isEditing={isEditing} handleChange={handleChange} />
          </dl>
        </div>
        <div className="flex justify-start items-center gap-4 pt-6 border-t mt-2">
          {/* Botão de Redefinir Senha (Ação Secundária) */}
          <button
            type="button" // Importante ser 'button' para não submeter o formulário
            onClick={sendResetEmail}
            className="flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-150 ease-in-out cursor-pointer disabled:bg-teal-400 disabled:cursor-not-allowed"
          >
            Redefinir senha
          </button>

          
        </div>

      

      </div>
    </div>
  );
}