export interface Sprite {
  id: string
  imageUrl: string
}

export interface ImageGenerationRequest {
  sprites: Sprite[]
  style?: 'attack on titan' | 'studio ghibli'
  sex?: 'male' | 'female'
}

export interface ImageGenerationResponse {
  imageUrl: string
  revisedPrompt: string
}

export const generateImage = async (
  request: ImageGenerationRequest
): Promise<ImageGenerationResponse> => {
  try {
    const response = await fetch('/api/generate-image-replicate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Falha ao gerar imagem')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erro ao gerar imagem:', error)
    throw new Error('Falha ao gerar imagem')
  }
}
