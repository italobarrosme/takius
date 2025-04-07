import { NextResponse } from 'next/server'
import { openai } from '@/modules/image-generation/lib/openai'
import { ImageGenerationRequest } from '@/modules/image-generation/services/getImageGeneration'

export async function POST(request: Request) {
  try {
    const body: ImageGenerationRequest = await request.json()
    const style =
      body.style ||
      'Ragnarok Online character art, faithful to pixel sprite proportions and color palette, with a semi-stylized RPG fantasy style'
    const sex = body.sex || 'male'

    if (!body.sprite || !body.sprite.imageUrl) {
      return NextResponse.json(
        { error: 'Nenhum sprite com URL válida foi enviado.' },
        { status: 400 }
      )
    }

    const spriteImageUrl = body.sprite.imageUrl

    // GPT-4 Vision: Gerar descrição do sprite e inferir o arquétipo
    const visionResponse = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional RPG concept artist. You analyze pixel art sprites to infer their class archetype (like rogue, mage, warrior, etc) and visual description. Be concise and detailed, and preserve visual fidelity to the sprite.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Look at this pixel art sprite from a Ragnarok Online-style RPG and describe in detail the character: include outfit, pose, colors, accessories, headgear, weapons, and the likely RPG class archetype based on visual clues. Be extremely specific and avoid inventing details not shown in the sprite.',
            },
            { type: 'image_url', image_url: { url: spriteImageUrl } },
          ],
        },
      ],
      max_tokens: 400,
    })

    console.log('Resposta GPT Vision:', JSON.stringify(visionResponse, null, 2))

    const spriteDescription =
      visionResponse?.choices?.[0]?.message?.content?.trim()
    if (!spriteDescription) {
      return NextResponse.json(
        { error: 'Não foi possível descrever o sprite.' },
        { status: 500 }
      )
    }

    // Criar prompt final com riqueza de detalhes e palavras-chave visuais
    const finalPrompt = `
      Create a splash art illustration based on the following pixel sprite description with the style ${style}.
      The art style should follow the look and feel of Ragnarok Online: stylized proportions, faithful color palette, and clearly defined character silhouettes.
      The character must include all key features from the sprite: outfit design, color scheme, iconic weapons, headgear, and any distinguishing marks.
      The image should reflect the character class as inferred from the sprite (e.g., rogue, assassin), and the character's gender is ${sex}.
      Avoid overly realistic interpretations or changes in costume, and prioritize sprite fidelity over general fantasy tropes.
      The goal is to turn the sprite into a professional, fantasy splash art that still looks unmistakably like the original character.

      Sprite Description: ${spriteDescription}
    `.trim()

    console.log('Prompt gerado:', finalPrompt)

    // Gerar imagem com DALL·E 3 em alta qualidade
    const dalleResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: finalPrompt,
      n: 1,
      size: '1024x1024',
      quality: 'hd',
      style: 'vivid',
    })

    console.log('Resposta DALL·E:', JSON.stringify(dalleResponse, null, 2))

    const imageUrl = dalleResponse.data?.[0]?.url
    const revisedPrompt = dalleResponse.data?.[0]?.revised_prompt || finalPrompt

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'URL da imagem não encontrada na resposta da OpenAI.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      imageUrl,
      revisedPrompt,
    })
  } catch (error: any) {
    console.error('Erro ao gerar imagem:', error)
    console.error('Detalhes:', error?.response?.data || error?.message || error)

    if (error?.code === 'billing_hard_limit_reached') {
      return NextResponse.json(
        {
          error:
            'Limite de uso da API atingido. Verifique seu faturamento na conta OpenAI.',
        },
        { status: 402 }
      )
    }

    return NextResponse.json(
      {
        error:
          'Falha ao gerar imagem. Tente novamente mais tarde ou revise sua entrada.',
      },
      { status: 500 }
    )
  }
}
