'use client'

import { useUser } from '@auth0/nextjs-auth0/client'

export function useLogout() {
  const { user } = useUser()

  const handleLogout = () => {
    if (user) {
      window.location.href = '/api/auth/logout'
    }
  }

  return { handleLogout }
}
