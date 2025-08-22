// src/types/rooms.ts

/**
 * Define a configuração de uma ou mais camas de um tipo específico.
 * Ex: { id: 1, type: 'casal', quantity: 1 }
 */
export interface BedConfiguration {
  id: number;
  type: 'solteiro' | 'casal' | 'beliche' | 'king';
  quantity: number;
}

/**
 * Estrutura detalhada e categorizada de todas as comodidades possíveis.
 * O prefixo (ex: 'kitchen_') ajuda a organizar e evitar conflitos de nomes.
 */
export interface Amenities {
  // Cozinha
  kitchen_chaleiraCafeteira: boolean;
  kitchen_microondas: boolean;
  kitchen_geladeira: boolean;
  kitchen_fogao: boolean;
  kitchen_utensilios: boolean;
  kitchen_cozinhaCompleta: boolean;
  
  // Banheiro
  bathroom_produtosDeHigiene: boolean;
  bathroom_secadorDeCabelo: boolean;
  bathroom_toalhas: boolean;

  // Tecnologia e Entretenimento
  tech_tv: boolean;
  tech_wifi: boolean;
  tech_streaming: boolean; // Ex: Netflix
  
  // Conforto e Utilidades
  comfort_arCondicionado: boolean;
  comfort_aquecimento: boolean;
  comfort_roupaDeCama: boolean;
  comfort_ferroDePassar: boolean;
  comfort_secadoraDeRoupas: boolean;
  comfort_maquinaDeLavar: boolean;

  // Espaço de Trabalho
  workspace_mesaDeTrabalho: boolean;

  // Exterior e Vista
  outdoor_varanda: boolean;
  outdoor_vistaMar: boolean;
  outdoor_vistaJardim: boolean;

  // Políticas e Extras
  extra_acessibilidade: boolean; // Adaptado para cadeira de rodas, etc.
  extra_petFriendly: boolean;
  extra_fumantesPermitido: boolean;
}

/**
 * A estrutura principal que define um "Tipo de Quarto".
 * Agrega todas as outras informações.
 */
export interface RoomType {
  id: number;
  name: string;
  description: string;
  capacity: number; // Número máximo de hóspedes
  privacy: 'privativo' | 'compartilhado';
  bathroom: 'privativo' | 'compartilhado';
  beds: BedConfiguration[];
  amenities: Amenities;
  dailyRate: number; // Preço da diária em R$
  photos: File[]; // Usado para gerenciar uploads no lado do cliente
}