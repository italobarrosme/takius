import React from 'react'

interface InputTextareaProps {
  label?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
  required?: boolean
  rows?: number
  maxLength?: number
}

export const InputTextarea: React.FC<InputTextareaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  rows = 4,
  maxLength,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-sm text-gray-700 font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`
          w-full px-3 py-2 rounded border
          ${error ? 'border-red-500' : 'border-gray-300'}
          focus:outline-none focus:ring-2
          ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          text-sm resize-none
        `}
      />
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
      {maxLength && (
        <span className="text-xs text-gray-500 self-end">
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  )
}
