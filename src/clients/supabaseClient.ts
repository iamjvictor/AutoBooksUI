"use client"

import { createBrowserClient } from '@supabase/ssr'

// Exporte uma função para criar o cliente
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}