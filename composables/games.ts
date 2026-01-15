import { defineStore } from 'pinia'
import type { Game, GameDetail, GameFilters } from '~/types/game'
import { CONSOLE_ERROR_MESSAGES } from '~/lib/errorMessages'

interface GamesState {
  games: Game[]
  gameDetails: Record<number, GameDetail>
  loading: boolean
  error: string | null
  filters: GameFilters
}

const cleanFilters = (filters: any): GameFilters => {
  return {
    genre: filters.genre || '',
    platform: filters.platform || '',
    search: filters.search || ''
  }
}

export const useGamesStore = defineStore('games', {
  state: (): GamesState => ({
    games: [],
    gameDetails: {},
    loading: false,
    error: null,
    filters: cleanFilters({})
  }),

  getters: {
    filteredGames: (state) => {
      let filtered = [...state.games]

      if (state.filters.search) {
        const searchTerm = state.filters.search.toLowerCase()
        filtered = filtered.filter(game =>
          game.title.toLowerCase().includes(searchTerm) ||
          game.genre.toLowerCase().includes(searchTerm) ||
          game.developer.toLowerCase().includes(searchTerm) ||
          game.platform.toLowerCase().includes(searchTerm)
        )
      }

      if (state.filters.genre) {
        filtered = filtered.filter(game => game.genre === state.filters.genre)
      }

      if (state.filters.platform) {
        filtered = filtered.filter(game => game.platform === state.filters.platform)
      }

      return filtered
    },

    uniqueGenres: (state) => [...new Set(state.games.map(game => game.genre))].sort(),
    uniquePlatforms: (state) => [...new Set(state.games.map(game => game.platform))].sort(),

    getGameDetail: (state) => (id: number): GameDetail | null => {
      return state.gameDetails[id] || null
    },
    yearRange: (state) => {
      const years = state.games.map(game => game.release_year)
      return {
        min: Math.min(...years),
        max: Math.max(...years)
      }
    },
  },

  actions: {
    async fetchGames() {
      if (this.games.length > 0) return this.games

      this.loading = true
      this.error = null

      try {
        const data = await $fetch<Game[]>('/api/games')
        this.games = data
        return data
      } catch (error) {
        this.error = 'Failed to load games' // UI error message
        console.error(CONSOLE_ERROR_MESSAGES.GAMES_LOAD_FAILED + ':', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchGameDetail(id: number) {

      if (this.gameDetails[id]) {
        return this.gameDetails[id]
      }

      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const apiKey = config.public.rawgApiKey
        const baseUrl = config.public.rawUrl

        if (!apiKey) {
          throw new Error('RAWG API key not configured')
        }

        if (!baseUrl) {
          throw new Error('RAW URL not configured')
        }

        const rawgUrl = `${baseUrl}/games/${id}?key=${apiKey}`
        const rawgData = await $fetch<any>(rawgUrl)

        const screenshotsUrl = `${baseUrl}/games/${id}/screenshots?key=${apiKey}`
        const screenshotsData = await $fetch<any>(screenshotsUrl)

        const gameDetail: GameDetail = {
          id: rawgData.id,
          title: rawgData.name,
          genre: rawgData.genres?.[0]?.name || 'Unknown',
          release_year: rawgData.released ? new Date(rawgData.released).getFullYear() : 0,
          developer: rawgData.developers?.[0]?.name || 'Unknown',
          platform: rawgData.platforms?.[0]?.platform?.name || 'Unknown',
          rating: rawgData.rating || 0,
          isFullData: true,
          description: rawgData.description_raw || '',
          background_image: rawgData.background_image || null,
          screenshots: screenshotsData.results?.map((shot: any) => shot.image) || [],
          metacritic_score: rawgData.metacritic || null,
          esrb_rating: rawgData.esrb_rating?.name || null,
          publishers: rawgData.publishers?.map((p: any) => p.name) || [],
          tags: rawgData.tags?.map((t: any) => t.name) || []
        }

        this.gameDetails[id] = gameDetail

        return gameDetail
      } catch (error) {
        this.error = 'Failed to load game details' // UI error message
        console.error(CONSOLE_ERROR_MESSAGES.GAME_LOAD_FAILED + ':', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    setFilters(filters: Partial<GameFilters>) {
      this.filters = cleanFilters({ ...this.filters, ...filters })
    },

    clearFilters() {
      this.filters = cleanFilters({})
    },

    updateFiltersFromUrl(query: Record<string, string>) {
      const filters: GameFilters = {}

      if (query.search) filters.search = query.search
      if (query.genre) filters.genre = query.genre
      if (query.platform) filters.platform = query.platform

      this.filters = cleanFilters(filters)
    }
  },

  persist: {
    pick: ['games', 'gameDetails', 'filters']
  }
})