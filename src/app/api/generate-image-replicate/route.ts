import { NextResponse } from 'next/server'
import Replicate from 'replicate'
import { ImageGenerationRequest } from '@/modules/image-generation/services/getImageGeneration'
import { saveLinks, loadLinks } from '@/utils/saveLinks'
import { logProgressBar } from '@/utils/logProgressBar/logProgressBar'
import { openai } from '@/modules/image-generation/lib'
import { getSession } from '@auth0/nextjs-auth0'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const body: ImageGenerationRequest = await request.json()

    console.log(body, 'here ######################')
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

    // Verificar se a URL é válida
    try {
      new URL(spriteImageUrl)
    } catch (error) {
      console.error('URL inválida:', error)
      return NextResponse.json(
        { error: 'URL do sprite é inválida.' },
        { status: 400 }
      )
    }

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

    // Primeira etapa: Salvar link com a descrição do sprite
    const existingLinks = await loadLinks()
    const newLink = {
      url: '',
      title: `Imagem gerada (Replicate)`,
      createdAt: new Date().toISOString(),
      spriteDescription,
    }

    await saveLinks([...existingLinks, newLink])

    // Usar o modelo Stable Diffusion 3.5 Medium do Replicate
    const prediction = await replicate.predictions.create({
      model: 'stability-ai/stable-diffusion-3.5-medium',
      input: {
        prompt: `Create a detailed anime-style illustration based on this description: ${spriteDescription}. The character must be ${sex}. Style: ${style}. Maintain the character's essence and design elements from the Ragnarok Online aesthetic.`,
        cfg_scale: 7,
        num_inference_steps: 40,
        width: 1024,
        height: 1024,
        scheduler: 'K_EULER',
        refine: 'expert_ensemble_refiner',
        high_noise_frac: 0.8,
        negative_prompt:
          'blurry, low quality, distorted, unrealistic, deformed',
      },
    })

    console.log('Prediction criada:', prediction)

    // Aguardar a conclusão da geração da imagem
    let output = await replicate.predictions.get(prediction.id)

    console.log('Status inicial:', output.status)

    // iniciar a barra de progresso

    let progress = 0

    while (output.status === 'starting' || output.status === 'processing') {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      output = await replicate.predictions.get(prediction.id)
      console.log('Status atual:', output.status)

      progress += 10
      await logProgressBar(progress)
    }

    console.clear()
    console.log('Geração concluída!')

    console.log('Output final:', JSON.stringify(output, null, 2))

    if (output.status === 'failed' || output.error) {
      return NextResponse.json(
        { error: output.error || 'Falha ao gerar a imagem.' },
        { status: 500 }
      )
    }

    if (
      !output.output ||
      !Array.isArray(output.output) ||
      output.output.length === 0
    ) {
      return NextResponse.json(
        { error: 'URL da imagem não encontrada na resposta do Replicate.' },
        { status: 500 }
      )
    }

    const imageUrl = output.output[0]

    // Segunda etapa: Atualizar o link com a URL da imagem
    const linkIndex = existingLinks.findIndex(
      (link) => link.spriteDescription === spriteDescription
    )
    existingLinks[linkIndex] = {
      ...existingLinks[linkIndex],
      url: imageUrl,
    }

    return NextResponse.json({
      imageUrl,
      spriteDescription,
    })
  } catch (error: any) {
    console.error('Erro ao gerar imagem:', error)
    console.error('Detalhes:', error?.response?.data || error?.message || error)

    return NextResponse.json(
      {
        error:
          'Falha ao gerar imagem. Tente novamente mais tarde ou revise sua entrada.',
      },
      { status: 500 }
    )
  }
}
