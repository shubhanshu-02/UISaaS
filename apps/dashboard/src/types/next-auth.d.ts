import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"
import type { User as CustomUser } from '@ui-saas/types'

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      tier: CustomUser['tier']
      isDemo: boolean
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    tier: CustomUser['tier']
    isDemo: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    tier: CustomUser['tier']
    isDemo: boolean
  }
}
