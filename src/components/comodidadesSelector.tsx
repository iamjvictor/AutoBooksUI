// src/components/onboarding/AmenitiesSelector.tsx
"use client";

import {Amenities} from "@/data/rooms";
import React from "react";

// Definindo as propriedades
interface AmenitiesSelectorProps {
  amenities: Partial<Amenities>; // Usamos Partial para permitir que nem todos os campos estejam definidos
  onAmenityChange: (amenity: keyof Amenities) => void;
}

// Mapeamento das comodidades para exibição na UI
const amenitiesMap = [
  {
    category: "Cozinha Privativa",
    items: [
      { key: 'kitchen_cozinhaCompleta', label: 'Cozinha' },
      { key: 'kitchen_geladeira', label: 'Geladeira' },
      { key: 'kitchen_microondas', label: 'Micro-ondas' },
      { key: 'kitchen_fogao', label: 'Fogão' },
      { key: 'kitchen_chaleiraCafeteira', label: 'Chaleira/Cafeteira' },
      { key: 'kitchen_utensilios', label: 'Utensílios de cozinha' },
    ]
  },
  {
    category: "Banheiro Privativo",
    items: [
      { key: 'bathroom_produtosDeHigiene', label: 'Produtos de higiene' },
      { key: 'bathroom_secadorDeCabelo', label: 'Secador de cabelo' },
      { key: 'bathroom_toalhas', label: 'Toalhas' },
    ]
  },
  {
    category: "Tecnologia",
    items: [
      { key: 'tech_tv', label: 'TV' },
      { key: 'tech_wifi', label: 'Internet (Wi-Fi)' },
      { key: 'tech_streaming', label: 'Streaming (Netflix, etc)' },
    ]
  },
  {
      category: "Conforto",
      items: [
        { key: 'comfort_arCondicionado', label: 'Ar Condicionado' },
        { key: 'comfort_aquecimento', label: 'Aquecimento' },
        { key: 'comfort_roupaDeCama', label: 'Roupa de cama' },
        { key: 'comfort_ferroDePassar', label: 'Ferro de passar' },
        { key: 'comfort_maquinaDeLavar', label: 'Máquina de lavar' },
        { key: 'comfort_secadoraDeRoupas', label: 'Secadora de roupas' },
      ]
  },
  {
      category: "Outros",
      items: [
        { key: 'workspace_mesaDeTrabalho', label: 'Mesa de trabalho' },
        { key: 'outdoor_varanda', label: 'Varanda/Sacada' },
        { key: 'extra_petFriendly', label: 'Aceita pets' },
        { key: 'extra_fumantesPermitido', label: 'Permitido fumar' },
      ]
  }
] as const; // 'as const' para tipagem mais estrita

export default function AmenitiesSelector({ amenities, onAmenityChange }: AmenitiesSelectorProps) {
  return (
    <div className="space-y-6">
      {amenitiesMap.map(group => (
        <div key={group.category}>
          <h3 className="text-md font-semibold text-gray-800 border-b pb-2 mb-3">{group.category}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
            {group.items.map(amenity => (
              <label key={amenity.key} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  checked={!!amenities[amenity.key]}
                  onChange={() => onAmenityChange(amenity.key as keyof Amenities)}
                />
                {amenity.label}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}