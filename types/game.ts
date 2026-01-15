export interface Game {
  id: number
  title: string
  genre: string
  release_year: number
  developer: string
  platform: string
  rating: number
  isFullData: boolean
}

export interface GameDetail extends Game {
  description?: string
  background_image?: string
  screenshots?: string[]
  metacritic_score?: number
  esrb_rating?: string
  publishers?: string[]
  tags?: string[]
}

export interface GameFilters {
  genre?: string
  platform?: string
  search?: string
}

export interface ApiResponse<T> {
  data: T
  error?: string
  loading: boolean
}