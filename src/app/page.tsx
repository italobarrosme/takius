import { Authenticate } from '@/modules/Authentication/components/Authenticate'
import { ImageGenerator } from '@/modules/image-generation/components/ImageGenerator'
import { getSession } from '@auth0/nextjs-auth0'
import { redirect } from 'next/navigation'
export default async function Home() {
  const session = await getSession()

  if (!session) {
    redirect('/api/auth/login')
  }

  return (
    <>
      <section className="flex max-w-5xl flex-col gap-16">
        <Authenticate />
        <ImageGenerator />
      </section>
    </>
  )
}
