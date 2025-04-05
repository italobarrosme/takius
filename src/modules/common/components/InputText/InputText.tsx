import React from 'react'

interface InputTextProps {
  label?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
  type?: 'text' | 'password' | 'email' | 'number'
  disabled?: boolean
  required?: boolean
}

export const InputText: React.FC<InputTextProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  type = 'text',
  disabled = false,
  required = false,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-sm text-gray-700 font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-3 py-2 rounded border
          ${error ? 'border-red-500' : 'border-gray-300'}
          focus:outline-none focus:ring-2
          ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          text-sm
        `}
      />
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  )
}
