export function createProgressBar(
  progress: number,
  total: number = 100
): string {
  const barWidth = 30
  const filledWidth = Math.round((progress / total) * barWidth)
  const emptyWidth = barWidth - filledWidth
  const progressBar = '█'.repeat(filledWidth) + '░'.repeat(emptyWidth)
  const percentage = Math.round((progress / total) * 100)
  return `[${progressBar}] ${percentage}% Gerando imagem...`
}

export const logProgressBar = (progress: number, total: number = 100) => {
  return setInterval(() => {
    progress = (progress + 1) % 101
    console.clear()
    console.log(createProgressBar(progress, total))
  }, 500)
}
