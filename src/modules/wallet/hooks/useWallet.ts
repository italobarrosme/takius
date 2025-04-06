import { useCallback, useState } from 'react'
import { walletRepository } from '@/modules/wallet/repositories/wallet.repository'
import { WalletTransaction } from '@/modules/wallet/types/WalletTypes'

export function useWallet() {
  const [balance, setBalance] = useState<number>(0)
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBalance = useCallback(async (userId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const currentBalance = await walletRepository.getBalance(userId)
      setBalance(currentBalance)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balance')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchTransactions = useCallback(async (userId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const walletTransactions = await walletRepository.getTransactions(userId)
      setTransactions(walletTransactions)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch transactions'
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addFunds = useCallback(
    async (userId: string, amount: number) => {
      try {
        setIsLoading(true)
        setError(null)
        await walletRepository.addFunds(userId, amount)
        await fetchBalance(userId)
        await fetchTransactions(userId)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add funds')
      } finally {
        setIsLoading(false)
      }
    },
    [fetchBalance, fetchTransactions]
  )

  const deductFunds = useCallback(
    async (userId: string, amount: number) => {
      try {
        setIsLoading(true)
        setError(null)
        await walletRepository.deductFunds(userId, amount)
        await fetchBalance(userId)
        await fetchTransactions(userId)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to deduct funds')
      } finally {
        setIsLoading(false)
      }
    },
    [fetchBalance, fetchTransactions]
  )

  return {
    balance,
    transactions,
    isLoading,
    error,
    fetchBalance,
    fetchTransactions,
    addFunds,
    deductFunds,
  }
}
