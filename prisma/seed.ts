import { PrismaClient } from '@prisma/client'

const prismaForSeed = new PrismaClient()

async function main() {
  console.log('Inicializando banco de dados...')

  // Aqui você pode adicionar dados iniciais se necessário
  // Exemplo:
  // const user = await prismaForSeed.user.create({
  //   data: {
  //     auth0Id: 'test-user',
  //     email: 'test@example.com',
  //     name: 'Test User',
  //     wallet: {
  //       create: {
  //         balance: 1000,
  //         currency: 'ORIDECON'
  //       }
  //     }
  //   },
  // })

  console.log('Banco de dados inicializado com sucesso!')
}

main()
  .catch((e) => {
    console.error('Erro ao inicializar banco de dados:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prismaForSeed.$disconnect()
  })
