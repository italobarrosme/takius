export interface Wallet {
  id: string
  userId: string
  balance: number
  currency: 'ORIDECON'
  createdAt: Date
  updatedAt: Date
}

export interface WalletTransaction {
  id: string
  walletId: string
  amount: number
  type: 'CREDIT' | 'DEBIT'
  description: string
  createdAt: Date
}

export interface WalletRepository {
  getBalance(userId: string): Promise<number>
  addFunds(userId: string, amount: number): Promise<void>
  deductFunds(userId: string, amount: number): Promise<void>
  getTransactions(userId: string): Promise<WalletTransaction[]>
}
