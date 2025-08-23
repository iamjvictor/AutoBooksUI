// middleware.ts (na raiz do seu projeto)
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  // Crie o cliente Supabase para o middleware.
  // A estrutura de cookies abaixo é a oficial e garante que a sessão seja atualizada.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Verifique se o nome bate com seu .env.local
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // A CHAMADA ABAIXO ATUALIZA A SESSÃO DO USUÁRIO
  const { data: { session } } = await supabase.auth.getSession()

  // --- NOSSA LÓGICA DE PROTEÇÃO DE ROTA ENTRA AQUI ---
  
  // 1. Se o usuário não está logado E está tentando acessar uma rota protegida...
  if (!session) {
    // ...redirecione para a página de login.
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Se o usuário estiver logado, a requisição continua normalmente.
  // No futuro, podemos adicionar a lógica de redirecionamento de status aqui.
  
  return response
}

// O config para definir quais rotas serão protegidas
export const config = {
  matcher: [
    // Continue usando o nosso matcher mais específico por enquanto
    '/dashboard/:path*',
    '/onboarding/:path*',
  ],
}