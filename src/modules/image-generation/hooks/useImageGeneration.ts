import { useState } from 'react'
import {
  generateImage,
  ImageGenerationRequest,
  ImageGenerationResponse,
} from '../services/getImageGeneration'

export const useImageGeneration = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ImageGenerationResponse | null>(null)

  const handleGenerateImage = async (request: ImageGenerationRequest) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await generateImage(request)
      setResult(response)
      return response
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro desconhecido ao gerar imagem'
      )
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    generateImage: handleGenerateImage,
    isLoading,
    error,
    result,
  }
}
