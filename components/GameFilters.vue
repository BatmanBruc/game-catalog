<template>
  <div class="game-filters block section" style="padding: 24px; margin-bottom: 24px;">
    <div class="game-filters__container">
      <div class="game-filters__item">
        <label class="game-filters__label text-sm font-medium text-gray-700">Genre</label>
        <BaseSelect
          v-model="localFilters.genre"
          placeholder="All Genres"
          @change="updateFilters"
        >
          <option value="">All Genres</option>
          <option
            v-for="genre in uniqueGenres"
            :key="genre"
            :value="genre"
          >
            {{ genre }}
          </option>
        </BaseSelect>
      </div>

      <div class="game-filters__item">
        <label class="game-filters__label text-sm font-medium text-gray-700">Platform</label>
        <BaseSelect
          v-model="localFilters.platform"
          placeholder="All Platforms"
          @change="updateFilters"
        >
          <option value="">All Platforms</option>
          <option
            v-for="platform in uniquePlatforms"
            :key="platform"
            :value="platform"
          >
            {{ platform }}
          </option>
        </BaseSelect>
      </div>

      <div class="game-filters__clear-wrapper">
        <BaseButton
          view="secondary"
          @click="clearFilters"
        >
          Clear
        </BaseButton>
      </div>
    </div>

    <div v-if="hasActiveFilters" class="game-filters__active">
      <div class="game-filters__active-container">
        <span class="game-filters__active-label text-sm text-gray-500">Active filters:</span>
        <span
          v-if="localFilters.search"
          class="game-filters__tag game-filters__tag--search text-xs font-medium text-blue-800"
        >
          Search: "{{ localFilters.search }}"
        </span>
        <span
          v-if="localFilters.genre"
          class="game-filters__tag game-filters__tag--genre text-xs font-medium text-green-800"
        >
          Genre: {{ localFilters.genre }}
        </span>
        <span
          v-if="localFilters.platform"
          class="game-filters__tag game-filters__tag--platform text-xs font-medium text-purple-800"
        >
          Platform: {{ localFilters.platform }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const gamesStore = useGamesStore() as any
const router = useRouter()

const localFilters = ref<GameFilters>({
  search: gamesStore.filters.search || '',
  genre: gamesStore.filters.genre || '',
  platform: gamesStore.filters.platform || ''
})

const uniqueGenres = computed(() => gamesStore.uniqueGenres)
const uniquePlatforms = computed(() => gamesStore.uniquePlatforms)

const hasActiveFilters = computed(() => {
  return Object.values(localFilters.value).some(value =>
    value !== undefined && value !== null && value !== ''
  )
})

const updateFilters = () => {
  gamesStore.setFilters(localFilters.value)
  const query: Record<string, string> = {}
  if (gamesStore.filters.search) query.search = gamesStore.filters.search
  if (gamesStore.filters.genre) query.genre = gamesStore.filters.genre
  if (gamesStore.filters.platform) query.platform = gamesStore.filters.platform
  router.push({ query })
}

const clearFilters = () => {
  localFilters.value = { genre: '', platform: '', search: '' }
  gamesStore.clearFilters()
  router.push({ query: {} })
}

watch(() => gamesStore.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })
</script>

<style scoped>
.game-filters__container {
  display: flex;
  gap: 16px;
  align-items: flex-end;
}

.game-filters__item {
  flex: 1;
}

.game-filters__label {
  display: block;
  margin-bottom: 8px;
}

.game-filters__clear-wrapper {
  display: flex;
  align-items: flex-end;
}

.game-filters__active {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.game-filters__active-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.game-filters__active-label {
  margin-right: 8px;
}

.game-filters__tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 9999px;
}

.game-filters__tag--search {
  background-color: #dbeafe;
  color: #1e40af;
}

.game-filters__tag--genre {
  background-color: #dcfce7;
  color: #166534;
}

.game-filters__tag--platform {
  background-color: #ede9fe;
  color: #5b21b6;
}

@media (max-width: 768px) {
  .game-filters__container {
    flex-direction: column;
    align-items: stretch;
  }

  .game-filters__clear-wrapper {
    margin-top: 16px;
  }
}
</style>