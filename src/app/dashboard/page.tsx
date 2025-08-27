// VERSÃO CORRETA DE /app/dashboard/page.tsx

import DashboardClient from './DashboardClient';
import { UserProvider } from '@/context/UserContext';

export default function DashboardPage() {
  // Sem hooks aqui! Apenas retornando a estrutura.
  return (
    <UserProvider>
      <DashboardClient />
    </UserProvider>
  );
}