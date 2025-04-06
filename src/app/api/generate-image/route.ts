import { NextResponse } from 'next/server'
import { openai } from '@/modules/image-generation/lib/openai'
import { ImageGenerationRequest } from '@/modules/image-generation/services/getImageGeneration'
import { saveLinks, loadLinks } from '@/utils/saveLinks'

export async function POST(request: Request) {
  try {
    const body: ImageGenerationRequest = await request.json()

    const DEFAULT_PROMPT = `Analyze the visual characteristics of the pixel art sprite provided. 
    Based on its design — including outfit, colors, accessories, posture, and overall vibe 
    — create a full-body, semi-realistic anime-style illustration in the visual style of ${body.style}. 
    Keep the fantasy RPG aesthetics, dramatic lighting, magical atmosphere, and high detail. 
    Preserve the essence of the original sprite’s silhouette and identity, while reimagining it with realistic textures, shadows, and dynamic lighting.`

    const spriteDescriptions = body.sprites
      .map((sprite) => `Sprite ${sprite.id}: ${sprite.description}`)
      .join('\n')

    const fullPrompt = `
      ${spriteDescriptions}
      
      ${DEFAULT_PROMPT}
    `.trim()

    console.log('Gerando imagem com prompt:', fullPrompt)

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: fullPrompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      style: 'vivid',
    })

    if (!response.data?.[0]?.url) {
      return NextResponse.json(
        { error: 'URL da imagem não encontrada na resposta' },
        { status: 500 }
      )
    }

    const imageUrl = response.data[0].url
    const revisedPrompt = response.data[0].revised_prompt || fullPrompt

    // Carrega os links existentes
    const existingLinks = loadLinks()

    // Adiciona o novo link
    const newLink = {
      url: imageUrl,
      title: `Imagem gerada - ${new Date().toLocaleDateString()}`,
      createdAt: new Date().toISOString(),
    }

    // Salva os links atualizados
    saveLinks([...existingLinks, newLink])

    return NextResponse.json({
      imageUrl,
      revisedPrompt,
    })
  } catch (error: any) {
    console.error('Erro ao gerar imagem:', error)

    // Verifica se é um erro de limite de faturamento
    if (error?.code === 'billing_hard_limit_reached') {
      return NextResponse.json(
        {
          error:
            'Limite de uso da API atingido. Por favor, verifique a configuração de faturamento da sua conta OpenAI.',
        },
        { status: 402 }
      )
    }

    return NextResponse.json(
      {
        error: 'Falha ao gerar imagem. Por favor, tente novamente mais tarde.',
      },
      { status: 500 }
    )
  }
}
