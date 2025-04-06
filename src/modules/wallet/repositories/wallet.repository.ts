import {
  WalletTransaction,
  WalletRepository,
} from '@/modules/wallet/types/WalletTypes'
import { walletPrismaService } from '../prisma/prisma.repository'

export const walletRepository: WalletRepository = {
  async getBalance(userId: string): Promise<number> {
    const wallet = await walletPrismaService.findWalletByUserId(userId)

    if (!wallet) {
      throw new Error('Wallet not found')
    }

    return wallet.balance
  },

  async addFunds(userId: string, amount: number): Promise<void> {
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0')
    }

    const wallet = await walletPrismaService.findWalletByUserId(userId)

    if (!wallet) {
      throw new Error('Wallet not found')
    }

    await walletPrismaService.updateWalletBalance(
      userId,
      wallet.balance + amount
    )
    await walletPrismaService.createTransaction({
      walletId: wallet.id,
      amount,
      type: 'CREDIT',
      description: 'Funds added to wallet',
    })
  },

  async deductFunds(userId: string, amount: number): Promise<void> {
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0')
    }

    const wallet = await walletPrismaService.findWalletByUserId(userId)

    if (!wallet) {
      throw new Error('Wallet not found')
    }

    if (wallet.balance < amount) {
      throw new Error('Insufficient funds')
    }

    await walletPrismaService.updateWalletBalance(
      userId,
      wallet.balance - amount
    )
    await walletPrismaService.createTransaction({
      walletId: wallet.id,
      amount,
      type: 'DEBIT',
      description: 'Funds deducted from wallet',
    })
  },

  async getTransactions(userId: string): Promise<WalletTransaction[]> {
    const wallet = await walletPrismaService.findWalletByUserId(userId)

    if (!wallet) {
      throw new Error('Wallet not found')
    }

    return walletPrismaService.findTransactionsByWalletId(wallet.id)
  },
}
