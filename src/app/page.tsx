import { api } from '@/modules/common/http/apiKy'
import { cn } from '@/utils'

interface User {
  id: number
  name: string
  email: string
  username: string
}

export default async function Home() {
  async function exampleFetchData() {
    const delay = 2000 // 2 seconds
    await new Promise((resolve) => setTimeout(resolve, delay))

    const response = await api.get('https://jsonplaceholder.typicode.com/users')
    const data: User[] = await response.json()

    return data
  }

  const data = await exampleFetchData()

  return (
    <>
      <section className="flex max-w-5xl flex-col gap-16">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <div>
          <h2 className="text-2xl font-bold">Example Data from API</h2>
          <ul>
            {data.map((user, index) => (
              <li key={user.id} className={cn('text-primary-regular')}>
                {index} - {user.name} ({user.email})
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
