'use server'
export interface Sprite {
  id: string
  imageUrl: string
}

export interface ImageGenerationRequest {
  sprite: Sprite
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
    console.log(request, '################')
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/generate-image-replicate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      }
    )

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
