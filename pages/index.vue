<template>
  <div>

    <GameFilters />

    <BaseAlert
      v-if="error"
      view="error"
      :text="UI_ERROR_MESSAGES.GAMES_LOAD_FAILED"
    >
      <BaseButton
        view="primary"
        @click="retryLoad"
      >
        Try Again
      </BaseButton>
    </BaseAlert>

    <div v-else-if="loading"  class="games-grid">
      <BaseSkeletonLoader v-for="i in 6" :key="i" height="266px" />
    </div>
    <div v-else-if="games.length > 0" class="games-grid">
      <GameCard
        v-for="game in games"
        :key="game.id"
        :game="game"
      />
    </div>

    <div v-else class="text-center" style="padding-top: var(--space-12); padding-bottom: var(--space-12);">
      <div class="text-6xl" style="margin-bottom: var(--space-4);">🎮</div>
      <h3 class="text-xl font-semibold text-primary" style="margin-bottom: var(--space-2);">No games found</h3>
      <p class="text-secondary" style="margin-bottom: var(--space-4);">
        Try adjusting your filters or search terms
      </p>
      <BaseButton
        view="primary"
        @click="clearAllFilters"
      >
        Clear Filters
      </BaseButton>
    </div>

    <div v-if="games.length > 0" style="margin-top: var(--space-8);" class="text-center text-secondary">
      Showing {{ games.length }} of {{ totalGames }} games
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const gamesStore = useGamesStore()

const error = ref()
const loading = ref(false)
if (Object.keys(route.query).length > 0) {
  gamesStore.updateFiltersFromUrl(route.query as Record<string, string>)
}

if (import.meta.server) {
  const result = await useAsyncData('games', async () => {
    return await gamesStore.fetchGames()
  })
  error.value = result.error.value
} else {
  loading.value = true
  useAsyncData('games', async () => {
    return await gamesStore.fetchGames()
  }).finally(() => {
    loading.value = false
  })
}

const games = computed(() => gamesStore.filteredGames)
const totalGames = computed(() => gamesStore.games.length)

const retryLoad = async () => {
  await gamesStore.fetchGames()
}

const clearAllFilters = () => {
  gamesStore.clearFilters()
  updateUrlFromFilters()
}

const updateUrlFromFilters = () => {
  const query: Record<string, string> = {}

  if (gamesStore.filters.search) query.search = gamesStore.filters.search
  if (gamesStore.filters.genre) query.genre = gamesStore.filters.genre
  if (gamesStore.filters.platform) query.platform = gamesStore.filters.platform

  router.push({ query })
}

// Следим за изменениями фильтров для обновления URL
watch(() => gamesStore.filters, updateUrlFromFilters, { deep: true })

useHead({
  title: 'Game Catalog - Discover Amazing Games',
  meta: [
    { name: 'description', content: 'Explore our comprehensive collection of video games across different genres and platforms.' }
  ]
})
</script>

<style>
.games-grid {
  display: grid;
  gap: var(--space-6);
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  margin-top: var(--space-8);
  margin-bottom: var(--space-8);
}

@media (max-width: 768px) {
  .games-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .games-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1025px) {
  .games-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>