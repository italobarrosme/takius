// utils/errorHandler/result.ts

/**
 * Representa um resultado bem-sucedido de uma operação
 * @template TOk - Tipo do valor de sucesso
 */
export type Ok<TOk> = {
  readonly isOk: true
  readonly isError: false
  readonly data: TOk
}

/**
 * Representa um resultado de erro de uma operação
 * @template TError - Tipo do erro
 */
export type Err<TError> = {
  readonly isOk: false
  readonly isError: true
  readonly error: TError
}

/**
 * Tipo union que representa um resultado que pode ser Ok ou Err
 * @template TOk - Tipo do valor de sucesso
 * @template TError - Tipo do erro
 */
export type Result<TOk, TError> = Ok<TOk> | Err<TError>

/**
 * Cria um Result de sucesso
 * @template TOk - Tipo do valor de sucesso
 * @template TError - Tipo do erro (opcional)
 * @param data - Valor de sucesso
 * @returns Result<TOk, TError>
 */
export const ok = <TOk, TError = never>(data: TOk): Result<TOk, TError> => ({
  isOk: true,
  isError: false,
  data,
})

/**
 * Cria um Result de erro
 * @template TOk - Tipo do valor de sucesso (opcional)
 * @template TError - Tipo do erro
 * @param error - Valor do erro
 * @returns Result<TOk, TError>
 */
export const err = <TOk = never, TError = unknown>(
  error: TError
): Result<TOk, TError> => ({
  isOk: false,
  isError: true,
  error,
})

/**
 * Extrai o valor de um Result ou retorna um valor padrão em caso de erro
 * @template TOk - Tipo do valor de sucesso
 * @template TError - Tipo do erro
 * @param result - Result a ser processado
 * @param fallback - Valor padrão em caso de erro
 * @returns TOk
 */
export const unwrapOr = <TOk, TError>(
  result: Result<TOk, TError>,
  fallback: TOk
): TOk => (result.isOk ? result.data : fallback)

/**
 * Transforma o valor de sucesso de um Result usando uma função
 * @template TOk - Tipo do valor de sucesso original
 * @template TNew - Tipo do novo valor de sucesso
 * @template TError - Tipo do erro
 * @param result - Result a ser transformado
 * @param fn - Função de transformação
 * @returns Result<TNew, TError>
 */
export const map = <TOk, TNew, TError>(
  result: Result<TOk, TError>,
  fn: (value: TOk) => TNew
): Result<TNew, TError> =>
  result.isOk ? ok(fn(result.data)) : err(result.error)

/**
 * Encadeia operações que retornam Result
 * @template TOk - Tipo do valor de sucesso original
 * @template TNew - Tipo do novo valor de sucesso
 * @template TError - Tipo do erro
 * @param result - Result inicial
 * @param fn - Função que retorna um novo Result
 * @returns Result<TNew, TError>
 */
export const andThen = <TOk, TNew, TError>(
  result: Result<TOk, TError>,
  fn: (value: TOk) => Result<TNew, TError>
): Result<TNew, TError> => (result.isOk ? fn(result.data) : err(result.error))
