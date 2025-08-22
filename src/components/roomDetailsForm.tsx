// src/components/onboarding/RoomDetailsForm.tsx
"use client";

import { type RoomType, type Amenities, BedConfiguration } from "@/data/rooms"; 
import { ArrowLeft, BedDouble, Plus, Trash2, UploadCloud, X } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import AmenitiesSelector from "./comodidadesSelector"; 
interface RoomDetailsFormProps {
  initialData: Partial<RoomType>;
  onSave: (data: RoomType) => void;
  onCancel: () => void;
}

export default function RoomDetailsForm({ initialData, onSave, onCancel }: RoomDetailsFormProps) {
    const [details, setDetails] = useState<Partial<RoomType>>(initialData);
    const [newBed, setNewBed] = useState<BedConfiguration>({
        id: 0, 
        type: 'casal',
        quantity: 1,
    });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: string | number = value;
    if (type === 'number') {
      processedValue = value === '' ? 0 : parseFloat(value);
    }
    
    setDetails(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleAmenityChange = (amenityKey: keyof Amenities) => {
    setDetails(prev => {
      // 1. Pega o objeto de comodidades atual. Se não existir, usa um objeto vazio como base.
       const currentAmenities: Partial<Amenities> = prev.amenities || {};

      // 2. Pega o valor atual da comodidade específica. Se não estiver definido, considera como 'false'.
      const currentValue = currentAmenities[amenityKey] || false;

      // 3. Cria o novo objeto de comodidades, atualizando apenas a chave que foi alterada.
      const newAmenities = {
        ...currentAmenities,
        [amenityKey]: !currentValue,
      };

      // 4. Retorna o estado completo do formulário com as comodidades atualizadas.
      return {
        ...prev,
        amenities: newAmenities as Amenities,
      };
    });
};

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setDetails(prev => ({ ...prev, photos: [...(prev.photos || []), ...newPhotos] }));
    }
  };

  const removePhoto = (indexToRemove: number) => {
    setDetails(prev => ({
      ...prev,
      photos: prev.photos?.filter((_, i) => i !== indexToRemove),
    }));
  };
 const handleNewBedChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewBed(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) : value,
    }));
  };

    const handleAddBed = () => {
        if (newBed.quantity <= 0) {
        alert("A quantidade deve ser pelo menos 1.");
        return;
        }
            
        const existingBed = details.beds?.find(bed => bed.type === newBed.type);

        if (existingBed) {
        
        setDetails(prev => ({
            ...prev,
            beds: prev.beds?.map(bed => 
            bed.type === newBed.type
                ? { ...bed, quantity: bed.quantity + newBed.quantity } // Soma a quantidade
                : bed // Mantém as outras camas como estão
            )
        }));
        } else {
            const bedToAdd: BedConfiguration = {
                id: Date.now(), // ID único para a nova ENTRADA
                type: newBed.type,
                quantity: newBed.quantity
            };
            setDetails(prev => ({
                ...prev,
                beds: [...(prev.beds || []), bedToAdd]
            }));
        }

    };

  const handleRemoveBed = (idToRemove: number) => {
    setDetails(prev => ({
      ...prev,
      beds: prev.beds?.filter(bed => bed.id !== idToRemove)
    }));
  };
  
  const handleSave = () => {
    if (!details.name || details.name.trim() === "") {
        alert("Por favor, preencha o Nome do Tipo de Quarto.");
        return;
    }
    onSave(details as RoomType);
  }

  return (
    <div>
      <button onClick={onCancel} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-4 w-4" />
        Voltar para a lista
      </button>

      {/* TÍTULO DINÂMICO */}
      <h2 className="text-2xl font-bold text-gray-900">
        {initialData.name ? `Editar Detalhes` : "Adicionar Novo Tipo de Quarto"}
      </h2>
      <p className="text-gray-500 mb-6">Preencha as informações da acomodação.</p>

      <div className="space-y-6">
        {/* CAMPO DE NOME (ADICIONADO) */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Tipo de Quarto</label>
          <input 
            type="text"
            id="name"
            name="name"
            placeholder="Ex: Suíte Master com Varanda" 
            className="mt-1 block w-full input-style"
            value={details.name || ''}
            onChange={handleInputChange}
          />
        </div>

        {/* Descrição */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
          <textarea id="description" name="description" placeholder="Descreva o quarto, seus diferenciais, a vista, etc." className="mt-1 block w-full input-style min-h-[100px]" value={details.description || ''} onChange={handleInputChange} />
        </div>

        {/* ... (O resto do formulário continua igual) ... */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacidade (Hóspedes)</label>
            <input type="number" id="capacity" name="capacity" placeholder="Ex: 2" className="mt-1 block w-full input-style" value={details.capacity || ''} onChange={handleInputChange} />
          </div>
          <div>
            <label htmlFor="dailyRate" className="block text-sm font-medium text-gray-700">Valor da Diária (R$)</label>
            <input type="number" id="dailyRate" name="dailyRate" placeholder="Ex: 250.00" className="mt-1 block w-full input-style" value={details.dailyRate || ''} onChange={handleInputChange} />
          </div>
        </div>
                {/* --- SEÇÃO DE CONFIGURAÇÃO DE CAMAS --- */}
        <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Configuração de Camas</label>
  
                {/* 1. Lista de camas que já foram adicionadas */}
                <div className="space-y-2 mb-4">
                    {details.beds && details.beds.length > 0 ? (
                    details.beds.map(bed => (
                        <div key={bed.id} className="flex items-center justify-between p-2 bg-gray-50 text-black rounded-md border">
                        <div className="flex items-center gap-2">
                            <BedDouble className="h-5 w-5 text-gray-600" />
                            <span className="font-medium">{bed.quantity}x</span>
                            <span className="capitalize">{bed.type}</span>
                        </div>
                        <button 
                            type="button" 
                            onClick={() => handleRemoveBed(bed.id)} 
                            className="text-red-500 hover:text-red-700"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                        </div>
                    ))
                    ) : (
                    <p className="text-sm text-gray-500 px-2">Nenhuma cama adicionada.</p>
                    )}
                </div>
                
                {/* 2. Formulário para adicionar uma nova cama à lista */}
                <div className="flex items-end gap-2 p-3 bg-gray-50 border rounded-md">
                    <div className="flex-grow">
                    <label htmlFor="bedType" className="block text-xs font-medium text-gray-600">Tipo de Cama</label>
                    <select 
                        id="bedType"
                        name="type" // <-- Nome do campo no objeto de estado
                        value={newBed.type} 
                        onChange={handleNewBedChange} 
                        className="mt-1 block w-full input-style py-1"
                    >
                        <option value="solteiro">Solteiro</option>
                        <option value="casal">Casal</option>
                        <option value="king">King</option>
                        <option value="beliche">Beliche</option>
                    </select>
                    </div>
                    <div className="w-20">
                    <label htmlFor="bedQuantity" className="block text-xs font-medium text-gray-600">Qtde.</label>
                    <input 
                       type="number" 
                        id="bedQuantity"
                        name="quantity" // <-- Nome do campo no objeto de estado
                        value={newBed.quantity} 
                        onChange={handleNewBedChange} 
                        min="1" 
                        className="mt-1 block w-full input-style py-1" 
                    />
                    </div>
                    <button 
                    type="button" 
                    onClick={handleAddBed} 
                    className="px-3 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                    >
                    <Plus className="h-5 w-5" />
                    </button>
                </div>
        </div>
         

        

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="privacy" className="block text-sm font-medium text-gray-700">Tipo de Quarto</label>
                <select id="privacy" name="privacy" className="mt-1 block w-full input-style" value={details.privacy || 'privativo'} onChange={handleInputChange}>
                    <option value="privativo">Privativo</option>
                    <option value="compartilhado">Compartilhado</option>
                </select>
            </div>
            <div>
                <label htmlFor="bathroom" className="block text-sm font-medium text-gray-700">Tipo de Banheiro</label>
                <select id="bathroom" name="bathroom" className="mt-1 block w-full input-style" value={details.bathroom || 'privativo'} onChange={handleInputChange}>
                    <option value="privativo">Privativo</option>
                    <option value="compartilhado">Compartilhado</option>
                </select>
            </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Comodidades</label>
          <AmenitiesSelector amenities={details.amenities || {}} onAmenityChange={handleAmenityChange} />
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-700">Fotos do Quarto</label>
           <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <div className="text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-300"/>
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label htmlFor="photo-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-teal-600 hover:text-teal-500">
                          <span>Selecione as fotos</span>
                          <input id="photo-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handlePhotoUpload}/>
                      </label>
                  </div>
              </div>
           </div>
           {details.photos && details.photos.length > 0 && (
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-4">
                  {details.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                          <Image src={URL.createObjectURL(photo)} alt={`preview ${index}`} width={150} height={150} className="rounded-md object-cover h-24 w-full" />
                          <button onClick={() => removePhoto(index)} className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-3 w-3"/></button>
                      </div>
                  ))}
              </div>
           )}
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button onClick={onCancel} className="w-full py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50">Cancelar</button>
        <button onClick={handleSave} className="w-full py-2 px-4 rounded-md text-white bg-teal-600 hover:bg-teal-700">Salvar Detalhes</button>
      </div>
    </div>
  );
}