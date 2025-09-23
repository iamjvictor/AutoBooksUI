"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2, Edit, Loader2 } from "lucide-react";
import { type RoomType } from "@/data/rooms";

import RoomDetailsForm from "./roomDetailsForm"; // Corrigido para PascalCase, o padrão para componentes

import {createClient} from "@/clients/supabaseClient"; // Ajuste o caminho

// Valor inicial para um novo quarto
const initialRoomDetails: Omit<RoomType, 'id' | 'name'> = {
  description: "", capacity: 2, privacy: 'privativo', bathroom: 'privativo', beds: [],
  amenities: {
    kitchen_chaleiraCafeteira: false,
    kitchen_microondas: false,
    kitchen_geladeira: false,
    kitchen_fogao: false,
    kitchen_utensilios: false,
    kitchen_cozinhaCompleta: false,
    bathroom_produtosDeHigiene: false,
    bathroom_secadorDeCabelo: false,
    bathroom_toalhas: false,
    tech_tv: false,
    tech_wifi: false,
    tech_streaming: false,
    comfort_arCondicionado: false,
    comfort_aquecimento: false,
    comfort_roupaDeCama: false,
    comfort_ferroDePassar: false,
    comfort_secadoraDeRoupas: false,
    comfort_maquinaDeLavar: false,
    workspace_mesaDeTrabalho: false,
    outdoor_varanda: false,
    outdoor_vistaMar: false,
    outdoor_vistaJardim: false,
    extra_acessibilidade: false,
    extra_petFriendly: false,
    extra_fumantesPermitido: false
  },
  daily_rate: 0, photos: [], total_quantity: 1
};

interface RoomTypeManagerProps {
  onComplete: () => void;
}

export default function RoomTypeManager({ onComplete }: RoomTypeManagerProps) {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [editingRoom, setEditingRoom] = useState<Partial<RoomType> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient(); 

  // Busca os quartos já existentes quando o componente carrega
  useEffect(() => {
    async function fetchRoomTypes() {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("Usuário não autenticado.");

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/getrooms`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` },
        });

        if (!response.ok) throw new Error("Falha ao buscar os quartos cadastrados.");
        
        const result = await response.json();
        setRoomTypes(result.data || []);
      } catch (error) {
        console.error("Erro ao carregar quartos:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRoomTypes();
  }, [supabase]); 

  const handleAddNew = () => {
    setEditingRoom({ id: Date.now(), name: "", ...initialRoomDetails });
  };

  const handleSaveDetails = async (roomData: RoomType) => {
    const isNewRoom = roomData.id > 1000000;
    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Não autenticado.");
      
      let response;
      let url = `${process.env.NEXT_PUBLIC_API_URL}/rooms`;
      let method = 'POST';

      if (!isNewRoom) {
        url += `/${roomData.id}`;
        method = 'PUT';
      }

      console.log('Dados do quarto a serem salvos:', roomData);
      
      const body = isNewRoom ? [roomData] : roomData;

      console.log('Enviando para a API:', { body });

      response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Falha na operação.`);
      }
      
      const result = await response.json();
      const savedRoom = Array.isArray(result.data) ? result.data[0] : result.data;
      
      if (isNewRoom) {
        setRoomTypes(prev => [...prev.filter(r => r.id !== roomData.id), savedRoom]);
      } else {
        setRoomTypes(prev => prev.map(rt => (rt.id === savedRoom.id ? savedRoom : rt)));
      }
      
      alert("Operação bem-sucedida!");
      setEditingRoom(null);
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFinalSubmit = () => {
    onComplete();
  };

  const handleRemoveRoomType = (roomId: number) => {
    // Lógica para remover o tipo de quarto
    const confirm = window.confirm("Tem certeza que deseja remover este tipo de quarto?");
    if (!confirm) return;

    setIsSubmitting(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) throw new Error("Não autenticado.");

      return fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });
    }).then(response => {
      if (!response.ok) throw new Error("Falha ao remover o tipo de quarto.");

      setRoomTypes(prev => prev.filter(rt => rt.id !== roomId));
      alert("Tipo de quarto removido com sucesso!");
    }).catch(error => {
      alert((error as Error).message);
    }).finally(() => {
      setIsSubmitting(false);
    });
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="animate-spin h-8 w-8 text-teal-600" />
        <span className="ml-4">Carregando seus quartos...</span>
      </div>
    );
  }

  if (editingRoom) {
    return <RoomDetailsForm 
              initialData={editingRoom} 
              onSave={handleSaveDetails}
              onCancel={() => setEditingRoom(null)}
            />
  }

  return (
    <div className="text-left bg-white p-6 rounded-lg shadow-sm">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Acomodações</h1>
        <p className="mt-1 text-gray-600">
          Adicione e configure todas as acomodações que você oferece.
        </p>
      </div>

      <div className="mb-6">
        <button
          type="button"
          onClick={handleAddNew}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white bg-teal-600 rounded-md hover:bg-teal-700 shadow-sm"
        >
          <PlusCircle className="h-5 w-5" />
          Adicionar Novo Tipo de Quarto
        </button>
      </div>

      <div className="mt-6 border-t pt-4">
        <h2 className="text-lg font-semibold text-gray-800">
            Tipos Adicionados ({roomTypes.length})
        </h2>
        {roomTypes.length === 0 ? (
            <p className="text-sm text-gray-500 mt-2">Nenhum tipo de quarto adicionado ainda.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {roomTypes.map((roomType) => (
              <li key={roomType.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border hover:shadow-md transition-shadow">
                <span className="text-gray-900 font-medium">{roomType.name}</span>
                <div className="flex items-center gap-3">
                   <button onClick={() => setEditingRoom(roomType)} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium">
                        <Edit className="h-4 w-4" /> Editar
                   </button>
                   <button 
                    onClick={() => handleRemoveRoomType(roomType.id)} // Adicionar lógica de remoção na API
                    className="text-red-500 hover:text-red-700"
                   >
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
        className="w-full flex justify-center py-3 px-4 mt-8 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-300"
      >
        Finalizar Onboarding e ir para o Dashboard
      </button>
    </div>
  );
}