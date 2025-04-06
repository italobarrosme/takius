import { PrismaClient } from '@prisma/client'
import { Wallet, WalletTransaction } from '@/modules/wallet/types/WalletTypes'

const prisma = new PrismaClient()

export const walletPrismaService = {
  async findWalletByUserId(userId: string): Promise<Wallet | null> {
    return prisma.wallet.findUnique({
      where: { userId },
    })
  },

  async createWallet(userId: string): Promise<Wallet> {
    return prisma.wallet.create({
      data: {
        userId,
        balance: 0,
        currency: 'ORIDECON',
      },
    })
  },

  async updateWalletBalance(userId: string, balance: number): Promise<Wallet> {
    return prisma.wallet.update({
      where: { userId },
      data: { balance },
    })
  },

  async createTransaction(data: {
    walletId: string
    amount: number
    type: 'CREDIT' | 'DEBIT'
    description: string
  }): Promise<WalletTransaction> {
    return prisma.walletTransaction.create({
      data,
    })
  },

  async findTransactionsByWalletId(
    walletId: string
  ): Promise<WalletTransaction[]> {
    return prisma.walletTransaction.findMany({
      where: { walletId },
      orderBy: { createdAt: 'desc' },
    })
  },
}
