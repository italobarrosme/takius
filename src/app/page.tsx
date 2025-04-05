import { Authenticate } from '@/modules/Authentication/components/Authenticate'
import { ImageGenerator } from '@/modules/image-generation/components/ImageGenerator'

export default function Home() {
  return (
    <>
      <section className="flex max-w-5xl flex-col gap-16">
        <Authenticate />
        <ImageGenerator />
      </section>
    </>
  )
}
