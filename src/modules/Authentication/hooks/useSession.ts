'use client'

import { useUser } from '@auth0/nextjs-auth0/client'

export function useSession() {
  const { user, error, isLoading } = useUser()
  return { user, error, isLoading }
}
