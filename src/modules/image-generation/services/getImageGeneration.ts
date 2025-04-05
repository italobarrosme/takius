import {
  openai,
  IMAGE_GENERATION_MODEL,
  IMAGE_QUALITY,
  IMAGE_SIZE,
} from '../lib'

export interface Sprite {
  id: string
  imageUrl: string
  description: string
}

export interface ImageGenerationRequest {
  sprites: Sprite[]
  style?: 'solo leveling' | 'studio ghibli'
}

export interface ImageGenerationResponse {
  imageUrl: string
  revisedPrompt: string
}

export const generateImage = async (
  request: ImageGenerationRequest
): Promise<ImageGenerationResponse> => {
  const DEFAULT_PROMPT = `
  Com base nas descrições dos sprites, gere uma imagem semi realista do personagem 
  no estilo ${request.style} se atente aos detalhes das sprites.
`

  try {
    const spriteDescriptions = request.sprites
      .map((sprite) => `Sprite ${sprite.id}: ${sprite.description}`)
      .join('\n')

    const fullPrompt = `
      ${spriteDescriptions}
      
      ${DEFAULT_PROMPT}
    `

    const response = await openai.images.generate({
      model: IMAGE_GENERATION_MODEL,
      prompt: fullPrompt,
      n: 1,
      quality: IMAGE_QUALITY,
      size: IMAGE_SIZE,
    })

    return {
      imageUrl: response.data[0].url || '',
      revisedPrompt: response.data[0].revised_prompt || fullPrompt,
    }
  } catch (error) {
    console.error('Erro ao gerar imagem:', error)
    throw new Error('Falha ao gerar imagem')
  }
}
