'use client'

import { useState } from 'react'
import { useImageGeneration } from '../../hooks/useImageGeneration'
import { ImageGenerationRequest } from '../../services/getImageGeneration'
import Image from 'next/image'
import {
  InputTextarea,
  Button,
  InputText,
  InputSelect,
} from '@/modules/common/components'

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
            <InputText
              label="URL da Imagem"
              placeholder="Digite a URL da imagem..."
              value={sprite.imageUrl}
              onChange={(value) =>
                handleSpriteChange(sprite.id, 'imageUrl', value)
              }
              required
            />
            <InputTextarea
              label="Descrição"
              placeholder="Digite a descrição do sprite..."
              value={sprite.description}
              onChange={(value) =>
                handleSpriteChange(sprite.id, 'description', value)
              }
              rows={6}
              maxLength={500}
              required
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
      >
        {isLoading ? 'Gerando...' : 'Gerar Imagem'}
      </Button>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {result && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Imagem Gerada:</h3>
          <Image
            src={result.imageUrl}
            alt="Imagem gerada"
            width={1024}
            height={1024}
            className="max-w-full rounded shadow"
          />
          <p className="text-sm text-gray-600">
            <strong>Prompt revisado:</strong> {result.revisedPrompt}
          </p>
        </div>
      )}
    </div>
  )
}
