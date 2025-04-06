import { useState } from 'react'

interface UploadResult {
  secure_url: string
  original_filename: string
}

export function useCloudinaryUpload() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = async (file: File): Promise<UploadResult | null> => {
    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'unsigned_sprite_upload') // <-- nome do preset
    // substitua com seu cloud_name
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

    console.log('cloudName', cloudName)

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error?.message || 'Erro ao fazer upload')
      }

      return {
        secure_url: data.secure_url,
        original_filename: data.original_filename,
      }
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido')
      return null
    } finally {
      setUploading(false)
    }
  }

  return {
    upload,
    uploading,
    error,
  }
}
