import { NextResponse } from 'next/server'
import { Result } from './result'

/**
 * Adapta um Result<NextResponse> para Response compatível com Next.js
 * @param resultPromise Promise<Result> retornado pelo toResult
 * @returns Promise<Response>
 */
export async function toNextResponse<T>(
  resultPromise: Promise<Result<NextResponse<T>, unknown>>
): Promise<Response> {
  const result = await resultPromise

  if (result.isOk) {
    return result.data
  }

  // Se houver erro, retorna uma resposta de erro 500
  return NextResponse.json(
    { error: 'Erro interno do servidor' },
    { status: 500 }
  )
}
