"use client";

import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useMemo, 
  useCallback 
} from "react";
import { createClient } from "@/clients/supabaseClient";
import { type UserData } from '@/types/user'; 

// 1. Define o "formato" do contexto, incluindo a função para recarregar os dados.
const UserContext = createContext<{ 
  userData: UserData | null; 
  loading: boolean;
  refetchUserData: () => Promise<void>; 
}>({ 
  userData: null,
  loading: true,
  refetchUserData: async () => {} // Função vazia como valor padrão
});

// 2. Cria o Provedor que vai "abraçar" a aplicação.
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // 3. Centraliza toda a lógica de busca de dados em uma única função memorizada.
  // `useCallback` garante que esta função não seja recriada a cada renderização.
  const getFullUserData = useCallback(async () => {
    // Ativa o 'loading' apenas se não for a busca inicial
    if (!loading) setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setUserData(null);
        return; // Encerra a função se não houver usuário logado.
      }

      // Dispara todas as chamadas de API em paralelo para mais performance.
      const [profileRes, roomsRes, documentsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/getrooms`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads/getdocuments`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` },
        })
      ]);

      // Verifica se todas as respostas foram bem-sucedidas.
      if (!profileRes.ok || !roomsRes.ok || !documentsRes.ok) {
        throw new Error(`Falha ao buscar um dos recursos da API.`);
      }
      
      // Extrai o JSON de todas as respostas.
      const [profileResponse, roomsResponse, documentsResponse] = await Promise.all([
        profileRes.json(),
        roomsRes.json(),
        documentsRes.json()
      ]);

      // Combina o perfil vindo da sua API com o e-mail vindo da sessão do Supabase.
      const combinedProfile = {
        ...profileResponse.profile,
        email: session.user.email 
      };

      // Atualiza o estado com todos os dados consolidados.
      setUserData({
        profile: combinedProfile,
        rooms: roomsResponse.data || [],
        documents: documentsResponse.data || [],
      });
      
    } catch (error) {
      console.error("UserProvider: Erro ao buscar dados do usuário:", error);
      setUserData(null); // Limpa os dados em caso de erro.
    } finally {
      setLoading(false); // Garante que o 'loading' seja desativado no final.
    }
  }, [supabase]); // A função só será recriada se a instância do supabase mudar (o que não acontece).

  // 4. `useEffect` agora tem uma única responsabilidade: chamar a função de busca quando o componente montar.
  useEffect(() => {
    getFullUserData();
  }, [getFullUserData]);

  // 5. O valor fornecido pelo contexto é memorizado com `useMemo`.
  // Ele inclui os dados, o estado de loading e a função para recarregar os dados.
  const value = useMemo(() => ({ 
    userData, 
    loading,
    refetchUserData: getFullUserData 
  }), [userData, loading, getFullUserData]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// 6. O hook customizado para consumir o contexto em qualquer lugar da aplicação.
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }
  return context;
};