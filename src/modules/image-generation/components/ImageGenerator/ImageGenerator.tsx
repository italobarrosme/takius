'use client'

import { useState } from 'react'
import { ImageGenerationRequest } from '../../services/getImageGeneration'
import Image from 'next/image'
import { Button, InputSelect, UploadImage } from '@/modules/common/components'
import {
  useCloudinaryUpload,
  useImageGeneration,
} from '@/modules/image-generation/hooks'

export const ImageGenerator = () => {
  const { generateImage, isLoading, error, result } = useImageGeneration()
  const { upload, uploading, error: uploadError } = useCloudinaryUpload()

  const [sprite, setSprite] = useState<{ id: string; url: string }>()
  const [style, setStyle] = useState<'attack on titan' | 'studio ghibli'>(
    'attack on titan'
  )
  const [sex, setSex] = useState<'male' | 'female'>('male')

  const handleImageUpload = async (files: File[]) => {
    try {
      const result = await upload(files[0])
      if (!result) return

      setSprite({
        id: Date.now().toString(),
        url: result.secure_url,
      })
    } catch (err) {
      console.error('Erro ao fazer upload das imagens:', err)
    }
  }

  const handleGenerate = async () => {
    if (!sprite) return

    const request: ImageGenerationRequest = {
      sprite: {
        id: sprite.id,
        imageUrl: sprite.url,
      },
      style,
      sex,
    }

    console.log(request, 'here')

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
    <section className="flex flex-col justify-center items-center gap-4">
      <h2 className="text-2xl font-bold">Gerador de Imagens por sprite</h2>
      <div className="p-4 space-y-4 bg-neutral-white rounded-md shadow-md min-w-96 flex justify-center items-center gap-4">
        <div className="space-y-4">
          <div className="space-y-4">
            <InputSelect
              label="Estilo"
              value={style}
              onChange={(value) =>
                setStyle(value as 'attack on titan' | 'studio ghibli')
              }
              options={[
                { value: 'attack on titan', label: 'Attack on titan' },
                { value: 'studio ghibli', label: 'Studio ghibli' },
              ]}
              required
            />
          </div>
          <div className="space-y-4">
            <InputSelect
              label="Sexo do personagem"
              value={sex}
              onChange={(value) => setSex(value as 'male' | 'female')}
              options={[
                { value: 'male', label: 'Masculino' },
                { value: 'female', label: 'Feminino' },
              ]}
              required
            />
          </div>

          <div className="p-4 border rounded space-y-4">
            <UploadImage
              onImageUpload={handleImageUpload}
              previewUrls={sprite?.url ? [sprite.url] : []}
              maxSize={5}
              accept="image/png, image/jpeg"
              maxImages={1}
              multiple={false}
            />
            {uploadError && (
              <p className="text-sm text-red-500">
                Erro ao enviar imagem: {uploadError}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 min-w-96">
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
                  variant="danger"
                  size="sm"
                  onClick={handleDownloadImage}
                  className="whitespace-nowrap absolute top-0 right-0"
                >
                  Baixar Imagem
                </Button>
              </div>
            </div>
          )}
          <Button
            variant="primary"
            size="md"
            onClick={handleGenerate}
            loading={isLoading || uploading}
            fullWidth
            disabled={isLoading || uploading || !sprite}
          >
            {isLoading || uploading ? 'Processando...' : 'Gerar Imagem'}
          </Button>
        </div>
      </div>
    </section>
  )
}
