import Image from 'next/image'
import React, { useCallback, useState } from 'react'

interface UploadImageProps {
  onImageUpload: (files: File[]) => void
  previewUrls?: string[]
  error?: string
  disabled?: boolean
  accept?: string
  maxSize?: number // in MB
  maxImages?: number
  multiple?: boolean
}

export const UploadImage: React.FC<UploadImageProps> = ({
  onImageUpload,
  previewUrls = [],
  error,
  disabled = false,
  accept = 'image/*',
  maxSize = 5,
  maxImages = 5,
  multiple = true,
}) => {
  const [localPreviews, setLocalPreviews] = useState<string[]>([])

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || [])
      if (files.length === 0) return

      // Verificar se não excede o número máximo de imagens
      if (multiple && files.length + previewUrls.length > maxImages) {
        alert(`Você pode enviar no máximo ${maxImages} imagens`)
        return
      }

      // Se não for múltiplo, pegar apenas o primeiro arquivo
      const filesToProcess = multiple ? files : [files[0]]

      // Verificar tamanho de cada arquivo
      const oversizedFiles = filesToProcess.filter(
        (file) => file.size > maxSize * 1024 * 1024
      )
      if (oversizedFiles.length > 0) {
        alert(`Cada arquivo deve ter no máximo ${maxSize}MB`)
        return
      }

      // Criar previews para os novos arquivos
      filesToProcess.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setLocalPreviews((prev) => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })

      onImageUpload(filesToProcess)
    },
    [maxSize, maxImages, onImageUpload, previewUrls.length, multiple]
  )

  const previewsToShow = previewUrls.length > 0 ? previewUrls : localPreviews

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {previewsToShow.length > 0 && (
        <div className="flex flex-wrap gap-4 justify-center">
          {previewsToShow.map((url, index) => (
            <Image
              key={`${url}-${index}`}
              src={url}
              alt={`Preview ${index + 1}`}
              className="max-w-[200px] max-h-[200px] object-contain rounded-lg border border-gray-300"
              width={200}
              height={200}
            />
          ))}
        </div>
      )}
      <button
        type="button"
        disabled={
          disabled ||
          (!multiple && previewsToShow.length > 0) ||
          (multiple && previewsToShow.length >= maxImages)
        }
        onClick={() => document.getElementById('file-input')?.click()}
        className={`
          px-6 py-3 bg-blue-500 text-white rounded
          hover:bg-blue-600 transition-colors
          ${disabled || (!multiple && previewsToShow.length > 0) || (multiple && previewsToShow.length >= maxImages) ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400' : ''}
          text-sm font-medium
        `}
      >
        {previewsToShow.length > 0
          ? multiple
            ? 'Adicionar mais imagens'
            : 'Trocar imagem'
          : 'Selecionar Imagem'}
      </button>
      <input
        id="file-input"
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={
          disabled ||
          (!multiple && previewsToShow.length > 0) ||
          (multiple && previewsToShow.length >= maxImages)
        }
        multiple={multiple}
      />
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
      {multiple && previewsToShow.length > 0 && (
        <span className="text-gray-500 text-xs">
          {previewsToShow.length} de {maxImages} imagens
        </span>
      )}
    </div>
  )
}
