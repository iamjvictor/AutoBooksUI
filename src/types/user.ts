import { type RoomType } from "@/data/rooms"; // Importa a tipagem de quartos

// Tipagem para os documentos
export interface UserDocument {
  id: string;
  file_name: string;
  storage_path: string;

  content: string | null;
  created_at: string;
}

export interface UserProfile {
  id: string;
  updated_at: string | null;
  full_name: string;
  business_name: string;
  whatsapp_number: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  status: 'active' | 'onboarding_plans' | 'onboarding_pdf' | 'onboarding_rooms'| 'activeAndConnected'| 'readyToUse';
  stripe_id: string | null;
  email?: string;

}

// A estrutura completa que o nosso Contexto vai fornecer
export interface UserData {
  profile: UserProfile;
  rooms: RoomType[];
  documents: UserDocument[];
  hasGoogleIntegration: boolean;
}