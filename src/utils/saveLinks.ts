import fs from 'fs'
import path from 'path'

interface Link {
  url: string
  title: string
  createdAt: string
  spriteDescription?: string
}

// Helper function to format date in Brazilian format
const formatBrazilianDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  })
}

export const saveLinks = (links: Link[]) => {
  try {
    const publicPath = path.join(process.cwd(), 'public')
    const filePath = path.join(publicPath, 'links.json')

    // Update each link title with formatted date
    const formattedLinks = links.map((link) => ({
      ...link,
      title: link.title.includes('Imagem gerada')
        ? `Imagem gerada (Replicate) - ${formatBrazilianDate(new Date(link.createdAt))}`
        : link.title,
    }))

    // Ensure directory exists
    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath, { recursive: true })
    }

    // Save links to file
    fs.writeFileSync(filePath, JSON.stringify(formattedLinks, null, 2))

    console.log('Links saved successfully at:', filePath)
    return true
  } catch (error) {
    console.error('Error saving links:', error)
    return false
  }
}

export const loadLinks = (): Link[] => {
  try {
    const filePath = path.join(process.cwd(), 'public', 'links.json')

    if (!fs.existsSync(filePath)) {
      return []
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error('Error loading links:', error)
    return []
  }
}
