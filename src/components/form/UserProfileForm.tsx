"use client";

import React, { useState, useEffect } from "react";

// Definição de tipo básica para os dados do formulário.
// Você pode importar seus tipos de `src/types/user` se já os tiver.
type FormDataShape = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  whatsappNumber?: string;
  businessName?: string;
  businessLocation?: {
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
};

// As props que nosso formulário vai aceitar da página "pai"
interface UserProfileFormProps {
  initialData: FormDataShape;
  onSubmit: (formData: FormDataShape) => Promise<void>;
  isSubmitting: boolean;
  submitButtonText: string;
  showPasswordFields?: boolean; // Opcional, valor padrão é `false`
}

const estadosBrasileiros = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

export default function UserProfileForm({ 
  initialData, 
  onSubmit, 
  isSubmitting, 
  submitButtonText,
  showPasswordFields = false // Se não for passado, será `false`
}: UserProfileFormProps) {

  const [formData, setFormData] = useState<FormDataShape>(initialData);
  const [passwordError, setPasswordError] = useState("");

  // Sincroniza o estado interno se os dados iniciais (vindo da página pai) mudarem.
  // Essencial para o modo de edição, que carrega os dados de uma API.
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (['address', 'city', 'state', 'zipCode'].includes(name)) {
      setFormData(prev => ({ 
        ...prev, 
        businessLocation: { 
          ...(prev.businessLocation || {}), 
          [name]: value 
        } 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
        const newFormData = { ...prev, [name]: value };
        // Validação em tempo real
        if (name === "confirmPassword" && newFormData.password !== value) {
            setPasswordError("As senhas não coincidem.");
        } else if (name === "password" && newFormData.confirmPassword && value !== newFormData.confirmPassword) {
            setPasswordError("As senhas não coincidem.");
        } else {
            setPasswordError("");
        }
        return newFormData;
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showPasswordFields && formData.password !== formData.confirmPassword) {
        setPasswordError("As senhas não coincidem.");
        return; // Impede o envio se as senhas não baterem
    }
    // Chama a função que foi passada pela página pai (seja a de cadastro ou de edição)
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome completo</label>
        <input type="text" id="name" name="name" value={formData.name || ''} onChange={handleChange} placeholder="Seu nome"  className="mt-1 block w-full input-style" required />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" id="email" name="email" value={formData.email || ''} onChange={handleChange} placeholder="seu@email.com"  className="mt-1 block w-full input-style" required />
      </div>

      {showPasswordFields && (
        <>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Crie uma senha</label>
            <input type="password" id="password" name="password" value={formData.password || ''} onChange={handlePasswordChange} placeholder="Mínimo 8 caracteres"  className="mt-1 block w-full input-style" required />
          </div>
          <div>
            <label htmlFor="confirmPassword"className="block text-sm font-medium text-gray-700">Confirme sua senha</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword || ''} onChange={handlePasswordChange} placeholder="Repita a senha"  className="mt-1 block w-full input-style" required />
            {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
          </div>
        </>
      )}

      <div>
        <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">Nome do estabelecimento</label>
        <input type="text" id="businessName" name="businessName" value={formData.businessName || ''} onChange={handleChange} placeholder="Hotel, Pousada, etc." className="mt-1 block w-full input-style" required />
      </div>
      <div>
        <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">Número do WhatsApp</label>
        <input type="tel" id="whatsappNumber" name="whatsappNumber" value={formData.whatsappNumber || ''} onChange={handleChange} placeholder="(XX) 9XXXX-XXXX"  className="mt-1 block w-full input-style" required />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Endereço</label>
        <input type="text" id="address" name="address" value={formData.businessLocation?.address || ''} onChange={handleChange} placeholder="Rua, Número, Bairro" className="mt-1 block w-full input-style" required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">Cidade</label>
          <input type="text" id="city" name="city" value={formData.businessLocation?.city || ''} onChange={handleChange} className="mt-1 block w-full input-style" required />
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">Estado</label>
          <select id="state" name="state" value={formData.businessLocation?.state || ''} onChange={handleChange} className="mt-1 block w-full input-style" required>
            <option value="" disabled>Selecione...</option>
            {estadosBrasileiros.map(uf => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">CEP</label>
          <input type="text" id="zipCode" name="zipCode" value={formData.businessLocation?.zipCode || ''} onChange={handleChange} className="mt-1 block w-full input-style" required />
        </div>
      </div>

      <div>
        <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3 px-4 mt-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-teal-400 disabled:cursor-not-allowed">
          {isSubmitting ? 'Processando...' : submitButtonText}
        </button>
      </div>
    </form>
  );
}