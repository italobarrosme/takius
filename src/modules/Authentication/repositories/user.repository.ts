import { prisma } from 'prisma/prisma'

export interface UserData {
  auth0Id: string
  email: string
  name?: string
  picture?: string
}

export const userRepository = {
  async findOrCreateUser(userData: UserData) {
    const existingUser = await prisma.user.findUnique({
      where: { auth0Id: userData.auth0Id },
      include: { wallet: true },
    })

    if (existingUser) {
      return existingUser
    }

    return prisma.$transaction(async (tx: any) => {
      const user = await tx.user.create({
        data: {
          auth0Id: userData.auth0Id,
          email: userData.email,
          name: userData.name,
          picture: userData.picture,
        },
      })

      await tx.wallet.create({
        data: {
          userId: user.id,
          balance: 0,
          currency: 'ORIDECON',
        },
      })

      return tx.user.findUnique({
        where: { id: user.id },
        include: { wallet: true },
      })
    })
  },

  async getUserByAuth0Id(auth0Id: string) {
    return prisma.user.findUnique({
      where: { auth0Id },
      include: { wallet: true },
    })
  },
}
