"use client"; // Marca este arquivo como um Componente de Cliente, pois ele usa hooks (useState, useEffect).

// Importações necessárias do React e de outros arquivos.
import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/clients/supabaseClient";
import { type UserData, type UserProfile, type UserDocument} from '@/types/user'; 
import { RoomType } from "@/data/rooms";

// 1. CRIAÇÃO DO CONTEXTO (O "SINAL DE WI-FI")
// createContext cria o "sinal". Definimos a "forma" dos dados que ele vai transmitir:
// um objeto com 'userData' (que pode ser UserData ou nulo) e 'loading' (booleano).
// Os valores iniciais são 'null' e 'true'.
const UserContext = createContext<{ userData: UserData | null; loading: boolean }>({ 
  userData: null,
  loading: true 
});

// 2. O PROVEDOR (O "ROTEADOR WI-FI")
// Esta é a função principal. Ela vai "abraçar" sua aplicação e fornecer os dados.
export function UserProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient(); // Cria a instância do cliente Supabase para o navegador.
  
  // Cria uma "memória" (estado) interna para guardar os dados do usuário.
  const [userData, setUserData] = useState<UserData | null>(null);
  
  // Cria uma "memória" (estado) para sabermos se os dados ainda estão sendo buscados.
  const [loading, setLoading] = useState(true);

  // 3. O useEffect (A BUSCA DE DADOS)
  // Este hook executa a função dentro dele UMA ÚNICA VEZ, assim que o componente é montado.
  useEffect(() => {
    // Função interna 'async' para podermos usar 'await'.
    async function getFullUserData() {
        console.log("UserProvider: Iniciando busca dos dados do usuário...");
      // Pergunta ao Supabase no navegador: "Existe uma sessão de login ativa?".
      const { data: { session } } = await supabase.auth.getSession();
      
      // Se não houver sessão, não há o que buscar.
      if (!session) {
        setLoading(false); // Para o carregamento.
        return; // Encerra a função.
      }

      try {
        // 1. Dispara todas as requisições em paralelo
        const responses = await Promise.all([
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

        console.log("UserProvider: Respostas recebidas da API.");

        // 2. Verifica se TODAS as respostas foram bem-sucedidas
        for (const res of responses) {
          if (!res.ok) {
            console.error(`UserProvider: Uma das requisições falhou com status ${res.status}.`, res);
            // Lança um erro que será pego pelo 'catch' abaixo
            throw new Error(`Falha ao buscar dados: ${res.statusText}`);
          }
        }
        
        console.log("UserProvider: Todas as respostas da API foram bem-sucedidas (status 2xx).");

        // 3. Extrai o JSON de todas as respostas (também em paralelo)
        const [profileData, roomsResponse, documentsResponse] = await Promise.all(
          responses.map(res => res.json())
        );

        console.log("UserProvider: Dados JSON extraídos:", { profileData, roomsResponse, documentsResponse });

        // Monta o objeto final
        setUserData({
          profile: profileData.profile, // Assumindo que /profile retorna o objeto direto
          rooms: roomsResponse.data || [], // Assumindo que /rooms retorna { data: [...] }
          documents: documentsResponse.data || [], // Assumindo que /documents retorna { data: [...] }
        });
        
        console.log("UserProvider: Estado 'userData' atualizado com sucesso.");

      } catch (error) {
        console.error("UserProvider: Erro capturado no bloco try/catch:", error);
        setUserData(null);
      } finally {
        console.log("UserProvider: Finalizando o carregamento (setLoading para false).");
        setLoading(false);
      }
    }

    getFullUserData();
  }, []); // O array vazio [] no final diz ao useEffect para rodar apenas uma vez.

  // O valor que será "transmitido" pelo nosso "sinal de Wi-Fi".
  const value = { userData, loading };

  // O componente Provider "abraça" os componentes filhos (sua aplicação) e
  // fornece o 'value' para todos eles.
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// 5. O HOOK CUSTOMIZADO (O "CONECTOR WI-FI")
// Esta é a forma elegante de usar o contexto.
export const useUser = () => {
    
    console.log("useUser: Tentando acessar o UserContext...");
  // useContext é o hook do React que "escuta" o sinal do Provider.
  const context = useContext(UserContext);
  
  // Uma verificação de segurança para garantir que o hook não seja usado fora do Provedor.
  if (context === undefined) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }
  
  // Retorna os dados que o Provedor está fornecendo.
  return context;
};