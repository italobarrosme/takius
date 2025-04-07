function createProgressBar(progress: number, total: number = 100): string {
  const barWidth = 30
  const filledWidth = Math.round((progress / total) * barWidth)
  const emptyWidth = barWidth - filledWidth
  const progressBar = '█'.repeat(filledWidth) + '░'.repeat(emptyWidth)
  const percentage = Math.round((progress / total) * 100)
  return `[${progressBar}] ${percentage}% Gerando imagem...`
}

let intervalId: NodeJS.Timeout | null = null

export const clearProgressBar = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
    console.clear()
  }
}

export const logProgressBar = async (progress: number, total: number = 100) => {
  clearProgressBar()

  intervalId = setInterval(() => {
    progress = (progress + 1) % 101
    console.clear()
    console.log(createProgressBar(progress, total))

    if (progress === total) {
      clearProgressBar()
    }
  }, 500)
}
