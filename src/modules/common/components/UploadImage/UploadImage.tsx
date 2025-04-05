import React, { useCallback, useState } from 'react'

interface UploadImageProps {
  onImageUpload: (file: File) => void
  previewUrl?: string
  error?: string
  disabled?: boolean
  accept?: string
  maxSize?: number // in MB
}

export const UploadImage: React.FC<UploadImageProps> = ({
  onImageUpload,
  previewUrl,
  error,
  disabled = false,
  accept = 'image/*',
  maxSize = 5,
}) => {
  const [localPreview, setLocalPreview] = useState<string | null>(null)

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      if (file.size > maxSize * 1024 * 1024) {
        alert(`O arquivo deve ter no máximo ${maxSize}MB`)
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setLocalPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      onImageUpload(file)
    },
    [maxSize, onImageUpload]
  )

  const imageUrl = previewUrl || localPreview

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Preview"
          className="max-w-[200px] max-h-[200px] object-contain rounded-lg border border-gray-300"
        />
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => document.getElementById('file-input')?.click()}
        className={`
          px-6 py-3 bg-blue-500 text-white rounded
          hover:bg-blue-600 transition-colors
          ${disabled ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400' : ''}
          text-sm font-medium
        `}
      >
        {imageUrl ? 'Alterar Imagem' : 'Selecionar Imagem'}
      </button>
      <input
        id="file-input"
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  )
}
