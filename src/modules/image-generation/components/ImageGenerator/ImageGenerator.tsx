'use client'

import { useState } from 'react'
import { useImageGeneration } from '../../hooks/useImageGeneration'
import { ImageGenerationRequest } from '../../services/getImageGeneration'
import Image from 'next/image'
import { Button, InputSelect, UploadImage } from '@/modules/common/components'

export const ImageGenerator = () => {
  const { generateImage, isLoading, error, result } = useImageGeneration()
  const [sprites, setSprites] = useState<ImageGenerationRequest['sprites']>([])
  const [style, setStyle] = useState<'solo leveling' | 'studio ghibli'>(
    'solo leveling'
  )

  const handleAddSprite = () => {
    const newSprite = {
      id: Date.now().toString(),
      imageUrl: '',
      description: '',
    }
    setSprites([...sprites, newSprite])
  }

  const handleSpriteChange = (
    id: string,
    field: 'imageUrl' | 'description',
    value: string
  ) => {
    setSprites(
      sprites.map((sprite) =>
        sprite.id === id ? { ...sprite, [field]: value } : sprite
      )
    )
  }

  const handleImageUpload = async (id: string, file: File) => {
    try {
      const imageUrl = URL.createObjectURL(file)
      handleSpriteChange(id, 'imageUrl', imageUrl)
    } catch (err) {
      console.error('Erro ao fazer upload da imagem:', err)
    }
  }

  const handleGenerate = async () => {
    if (sprites.length === 0) return

    const request: ImageGenerationRequest = {
      sprites,
      style,
    }

    try {
      await generateImage(request)
    } catch (err) {
      console.error('Erro ao gerar imagem:', err)
    }
  }

  const handleDownloadImage = async () => {
    if (result?.imageUrl) {
      try {
        const response = await fetch(result.imageUrl)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'imagem-gerada.png'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } catch (err) {
        console.error('Erro ao baixar imagem:', err)
      }
    }
  }

  return (
    <div className="p-4 space-y-4 bg-neutral-white rounded-md shadow-md min-w-96">
      <h2 className="text-2xl font-bold">Gerador de Imagens</h2>

      <div className="space-y-4">
        <InputSelect
          label="Estilo"
          value={style}
          onChange={(value) =>
            setStyle(value as 'solo leveling' | 'studio ghibli')
          }
          options={[
            { value: 'solo leveling', label: 'Solo leveling' },
            { value: 'studio ghibli', label: 'Studio ghibli' },
          ]}
          required
        />
      </div>

      <div className="space-y-4">
        <Button variant="primary" size="md" onClick={handleAddSprite}>
          Adicionar Sprite
        </Button>

        {sprites.map((sprite) => (
          <div key={sprite.id} className="p-4 border rounded space-y-4">
            <UploadImage
              onImageUpload={(file) => handleImageUpload(sprite.id, file)}
              previewUrl={sprite.imageUrl}
              maxSize={5}
              accept="image/*"
            />
          </div>
        ))}
      </div>

      <Button
        variant="primary"
        size="md"
        onClick={handleGenerate}
        loading={isLoading}
        fullWidth
        disabled={isLoading || sprites.length === 0}
      >
        {isLoading ? 'Gerando...' : 'Gerar Imagem'}
      </Button>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Gerando sua imagem...</p>
          <p className="text-sm text-gray-500">
            Isso pode levar alguns segundos
          </p>
        </div>
      )}

      {!isLoading && result && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Imagem Gerada:</h3>
          <div className="flex items-center gap-2 relative">
            <Image
              src={result.imageUrl}
              alt="Imagem gerada"
              width={1024}
              height={1024}
              className="max-w-full rounded shadow"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownloadImage}
              className="whitespace-nowrap absolute top-0 right-0"
            >
              Baixar Imagem
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
