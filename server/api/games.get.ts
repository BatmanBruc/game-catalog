import gamesData from '@/public/games.json'

export default defineEventHandler(async (_event) => {
  await new Promise(resolve => setTimeout(resolve, 100))
  return gamesData
})