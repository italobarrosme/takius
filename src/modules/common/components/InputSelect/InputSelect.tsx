import React from 'react'

interface Option {
  value: string
  label: string
}

interface InputSelectProps {
  label?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  options: Option[]
  error?: string
  disabled?: boolean
  required?: boolean
}

export const InputSelect: React.FC<InputSelectProps> = ({
  label,
  placeholder,
  value,
  onChange,
  options,
  error,
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
      <select
        value={value}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          onChange(e.target.value)
        }
        disabled={disabled}
        className={`
          w-full px-3 py-2 rounded border
          ${error ? 'border-red-500' : 'border-gray-300'}
          focus:outline-none focus:ring-2
          ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          text-sm appearance-none
          bg-white bg-[url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")]
          bg-[length:1.5em_1.5em] bg-[center_right_1rem] bg-no-repeat
        `}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  )
}
