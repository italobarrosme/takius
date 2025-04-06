import fs from 'fs'
import path from 'path'

interface Link {
  url: string
  title: string
  createdAt: string
}

export const saveLinks = (links: Link[]) => {
  try {
    const publicPath = path.join(process.cwd(), 'public')
    const filePath = path.join(publicPath, 'links.json')

    // Garante que o diretório existe
    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath, { recursive: true })
    }

    // Salva os links no arquivo
    fs.writeFileSync(filePath, JSON.stringify(links, null, 2))

    console.log('Links salvos com sucesso em:', filePath)
    return true
  } catch (error) {
    console.error('Erro ao salvar links:', error)
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
    console.error('Erro ao carregar links:', error)
    return []
  }
}
