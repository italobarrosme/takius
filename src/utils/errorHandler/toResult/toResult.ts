// utils/errorHandler/toResult.ts

import { Result, ok, err } from './result'

/**
 * Converte uma Promise em um Result, tratando tanto o sucesso quanto o erro
 * @template T - Tipo do valor de sucesso da Promise
 * @template E - Tipo do erro (padrão: unknown)
 * @param fn - Função que retorna uma Promise
 * @returns Promise<Result<T, E>> - Result contendo o valor de sucesso ou o erro
 * @example
 * ```typescript
 * const result = await toResult(() => fetchData())
 * if (result.isOk) {
 *   // usar result.data
 * } else {
 *   // tratar result.error
 * }
 * ```
 */
export const toResult = async <T, E = unknown>(
  fn: () => Promise<T>
): Promise<Result<T, E>> => {
  try {
    const data = await fn()
    return ok<T, E>(data)
  } catch (error) {
    return err<T, E>(error as E)
  }
}
