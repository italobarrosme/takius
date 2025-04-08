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
  isLoading?: boolean
  placeholder?: string
}

export const UploadImage: React.FC<UploadImageProps> = ({
  onImageUpload,
  previewUrls = [],
  error = '',
  disabled = false,
  accept = 'image/*',
  maxSize = 5,
  maxImages = 5,
  multiple = true,
  isLoading = false,
  placeholder = 'Selecione uma imagem',
}) => {
  const [localPreviews, setLocalPreviews] = useState<string[]>([])
  const [errorText, setErrorText] = useState<string | null>(error)

  const isMaxImagesReached = (currentPreviews: string[]) => {
    return multiple && currentPreviews.length >= maxImages
  }

  const isComponentDisabled = (currentPreviews: string[]) => {
    if (disabled) return true
    if (multiple) return isMaxImagesReached(currentPreviews)
    return false
  }

  const getButtonText = (currentPreviews: string[]) => {
    if (currentPreviews.length === 0) return placeholder
    return multiple ? 'Adicionar mais imagens' : 'Trocar imagem'
  }

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || [])
      if (files.length === 0) return

      if (multiple && files.length + previewUrls.length > maxImages) {
        setErrorText(`Você pode enviar no máximo ${maxImages} imagens`)
        return
      }

      const filesToProcess = multiple ? files : [files[0]]

      const oversizedFiles = filesToProcess.filter(
        (file) => file.size > maxSize * 1024 * 1024
      )
      if (oversizedFiles.length > 0) {
        setErrorText(`Cada arquivo deve ter no máximo ${maxSize}MB`)
        return
      }

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
  const buttonText = getButtonText(previewsToShow)
  const isDisabled = isComponentDisabled(previewsToShow)

  return (
    <div className="flex flex-col items-center gap-4 min-w-96 min-h-96 relative border border-dashed border-gray-300 rounded-lg">
      {previewsToShow.length > 0 && (
        <div className="flex flex-wrap gap-4 justify-center min-h-96 rounded-lg">
          {previewsToShow.map((url, index) => (
            <Image
              key={`${url}-${index}`}
              src={url}
              alt={`Preview ${index + 1}`}
              className="max-w-96 max-h-96 object-contain"
              width={384}
              height={384}
            />
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center gap-2 absolute bottom-5">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      ) : (
        <button
          type="button"
          disabled={isDisabled}
          onClick={() => document.getElementById('file-input')?.click()}
          className={`
            px-6 py-3 bg-blue-500 text-white rounded
            hover:bg-blue-600 transition-colors
            ${isDisabled ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400' : ''}
            text-sm font-medium absolute bottom-5
          `}
        >
          {buttonText}
        </button>
      )}

      <input
        id="file-input"
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={isDisabled}
        multiple={multiple}
      />
      {errorText && (
        <span className="text-red-500 text-xs mt-1">{errorText}</span>
      )}
      {multiple && previewsToShow.length > 0 && (
        <span className="text-gray-500 text-xs">
          {previewsToShow.length} de {maxImages} imagens
        </span>
      )}
    </div>
  )
}
