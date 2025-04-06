'use client'

import { useSession } from '@/modules/Authentication/hooks/useSession'
import { useLogout } from '@/modules/Authentication/hooks/useLogout'
import Image from 'next/image'
import { useState, KeyboardEvent } from 'react'

export const Authenticate = () => {
  const { user, isLoading } = useSession()
  const { handleLogout } = useLogout()
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => {
    setIsOpen(!isOpen)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleOpen()
    }
  }

  if (isLoading) return <span>Carregando...</span>

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-row justify-end items-center gap-8 absolute top-0 right-0 w-screen p-4 backdrop-blur-md">
      <div
        role="button"
        tabIndex={0}
        className="flex flex-row items-center gap-2 cursor-pointer relative"
        onClick={handleOpen}
        onKeyDown={handleKeyDown}
      >
        <span>{user?.name}</span>
        {user && (
          <Image
            src={user.picture!}
            alt={user.name!}
            className="w-8 h-8 rounded-full"
            width={32}
            height={32}
          />
        )}
        {isOpen && (
          <div className="flex flex-col gap-2 absolute top-12 bg-neutral-white right-0 w-40 rounded-md p-2 shadow-lg hover:bg-neutral-dark/10">
            <button
              onClick={handleLogout}
              className="text-left px-3 py-2 hover:bg-neutral-white/10 rounded transition-colors cursor-pointer"
            >
              Sair da conta
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
