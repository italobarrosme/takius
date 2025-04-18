declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AUTH0_SECRET: string
      AUTH0_BASE_URL: string
      AUTH0_ISSUER_BASE_URL: string
      AUTH0_CLIENT_ID: string
      AUTH0_CLIENT_SECRET: string
      NEXT_PUBLIC_DOMAIN: string
      OPENAI_API_KEY: string
    }
  }
}

export {}
