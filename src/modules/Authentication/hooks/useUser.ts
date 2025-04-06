import { useUser as useAuth0User } from '@auth0/nextjs-auth0/client'
import { useEffect, useState } from 'react'
import { userRepository } from '@/modules/Authentication/repositories/user.repository'

export function useUser() {
  const { user: auth0User, isLoading: isAuth0Loading } = useAuth0User()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadUser() {
      if (!auth0User?.sub) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const userData = await userRepository.getUserByAuth0Id(auth0User.sub)
        setUser(userData)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load user data'
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [auth0User])

  return {
    user,
    isLoading: isAuth0Loading || isLoading,
    error,
  }
}
