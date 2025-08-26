// src/components/onboarding/RoomTypeManager.tsx
"use client";

import React, { useState } from "react";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import { type RoomType } from "@/data/rooms";
import RoomDetailsForm from "./roomDetailsForm"; // Corrigido para PascalCase, o padrão para componentes
import {createClient} from "@/clients/supabaseClient";

// Valor inicial para um novo quarto, para não começar com campos undefined
const initialRoomDetails: Omit<RoomType, 'id' | 'name'> = {
  description: "",
  capacity: 2,
  privacy: 'privativo',
  bathroom: 'privativo',
  beds: [],
  amenities: {
    kitchen_chaleiraCafeteira: false, kitchen_microondas: false, kitchen_geladeira: false, kitchen_fogao: false, kitchen_utensilios: false, kitchen_cozinhaCompleta: false, bathroom_produtosDeHigiene: false, bathroom_secadorDeCabelo: false, bathroom_toalhas: false, tech_tv: false, tech_wifi: false, tech_streaming: false, comfort_arCondicionado: false, comfort_aquecimento: false, comfort_roupaDeCama: false, comfort_ferroDePassar: false, comfort_secadoraDeRoupas: false, comfort_maquinaDeLavar: false, workspace_mesaDeTrabalho: false, outdoor_varanda: false, outdoor_vistaMar: false, outdoor_vistaJardim: false, extra_acessibilidade: false, extra_petFriendly: false, extra_fumantesPermitido: false
  },
  dailyRate: 0,
  photos: []
};

interface RoomTypeManagerProps {
  onComplete: (roomTypes: RoomType[]) => void;
}

export default function RoomTypeManager({ onComplete }: RoomTypeManagerProps) {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [editingRoom, setEditingRoom] = useState<Partial<RoomType> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createClient(); 

  // Função para ABRIR O FORMULÁRIO para um novo quarto em branco
  const handleAddNew = () => {
    setEditingRoom({
      id: Date.now(), // ID temporário para o novo item
      name: "", // Nome em branco a ser preenchido no formulário
      ...initialRoomDetails
    });
  };

  // Função que SALVA (cria um novo ou atualiza um existente)
  const handleSaveDetails = (roomData: RoomType) => {
    const exists = roomTypes.some(rt => rt.id === roomData.id);

    if (exists) {
      // Se já existe, é uma ATUALIZAÇÃO
      setRoomTypes(prev => prev.map(rt => rt.id === roomData.id ? roomData : rt));
    } else {
      // Se não existe, é um NOVO quarto
      setRoomTypes(prev => [...prev, roomData]);
    }
    setEditingRoom(null); // Fecha o formulário e volta para a lista
  };
  
  const handleRemoveRoomType = (idToRemove: number) => {
    setRoomTypes(prev => prev.filter(roomType => roomType.id !== idToRemove));
  };
  
  const handleFinalSubmit = async () => {
    if (roomTypes.length === 0) {
      alert("Adicione pelo menos um tipo de quarto para continuar.");
      return;
    }
    setIsSubmitting(true);

    try {
      // 1. Pegar a sessão do usuário logado para autenticação
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Usuário não autenticado.");

      // 2. Enviar os dados para a nossa API Express
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(roomTypes),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao salvar os quartos.");
      }

      const result = await response.json();
      console.log("Quartos salvos com sucesso!", result.data);

      // 3. APENAS APÓS O SUCESSO, avisa o componente pai que terminou.
      onComplete(roomTypes);

    } catch (error) {
      console.error("Erro ao finalizar o cadastro de quartos:", error);
      alert((error as Error).message); // Use seu Toast aqui
    } finally {
      setIsSubmitting(false);
    }
  };

  // Se 'editingRoom' tiver dados, mostre o formulário de detalhes
  if (editingRoom) {
    return <RoomDetailsForm 
              initialData={editingRoom} 
              onSave={handleSaveDetails}
              onCancel={() => setEditingRoom(null)}
            />
  }

  // Senão, mostre a lista e o botão para adicionar novos tipos
  return (
    <div className="text-left">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Cadastre seus Tipos de Quarto</h1>
        <p className="mt-1 text-gray-600">
          Adicione e configure todas as acomodações que você oferece.
        </p>
      </div>

      {/* Botão principal para adicionar um novo tipo */}
      <div className="mb-6">
        <button
          type="button"
          onClick={handleAddNew}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white bg-teal-600 rounded-md hover:bg-teal-700"
        >
          <PlusCircle className="h-5 w-5" />
          Adicionar Novo Tipo de Quarto
        </button>
      </div>

      {/* Lista de tipos já adicionados */}
      <div className="mt-6 border-t pt-4">
        <h2 className="text-lg font-semibold text-gray-800">
            Tipos Adicionados ({roomTypes.length})
        </h2>
        {roomTypes.length === 0 ? (
            <p className="text-sm text-gray-500 mt-2">Nenhum tipo de quarto adicionado ainda.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {roomTypes.map((roomType) => (
              <li key={roomType.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                <span className="text-gray-900 font-medium">{roomType.name}</span>
                <div className="flex items-center gap-3">
                   <button onClick={() => setEditingRoom(roomType)} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm">
                        <Edit className="h-4 w-4" /> Editar Detalhes
                   </button>
                   <button onClick={() => handleRemoveRoomType(roomType.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-5 w-5" />
                   </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleFinalSubmit}
        className="w-full flex justify-center py-3 px-4 mt-8 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300"
        disabled={roomTypes.length === 0}
      >
        Finalizar e ir para o Dashboard
      </button>
    </div>
  );
}