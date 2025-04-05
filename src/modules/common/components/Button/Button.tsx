import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  className?: string
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500 hover:bg-blue-600 text-white'
      case 'secondary':
        return 'bg-gray-500 hover:bg-gray-600 text-white'
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white'
      case 'success':
        return 'bg-green-500 hover:bg-green-600 text-white'
      case 'outline':
        return 'bg-transparent border border-gray-300 hover:bg-gray-100 text-gray-700'
      default:
        return 'bg-blue-500 hover:bg-blue-600 text-white'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs'
      case 'md':
        return 'px-4 py-2 text-sm'
      case 'lg':
        return 'px-6 py-3 text-base'
      default:
        return 'px-4 py-2 text-sm'
    }
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        rounded font-medium transition-colors
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Carregando...</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
}
