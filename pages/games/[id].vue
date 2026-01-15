<template>
  <div>
    <div class="game-detail-back">
      <NuxtLink to="/" class="game-detail-back-link text-md font-medium link-primary">
        ← Back to Games
      </NuxtLink>
    </div>

    <BaseAlert
      v-if="error"
      view="error"
      :text="UI_ERROR_MESSAGES.GAME_LOAD_FAILED"
    >
      <div class="game-detail-error-actions">
        <BaseButton
          view="primary"
          @click="retryLoad"
        >
          Try Again
        </BaseButton>
        <BaseButton
          view="secondary"
          href="/"
        >
          Back to Games
        </BaseButton>
      </div>
    </BaseAlert>

    <div v-else class="game-detail-content">
      <div class="game-detail-main">
        <div class="game-detail-block">
          <div class="game-detail-info block section">
            <div v-if="gameDetail || !loading">
              <div style="margin-bottom: 20px;">
                <h1 class="page-title">{{ gameDetail!.title }}</h1>
                <Rating :rating="gameDetail!.rating" view="page" />
              </div>

              <div class="game-detail-info__list">
                <div class="game-detail-info__list-row">
                  <span class="text-lgfont-semibold text-gray-700">Genre:</span>
                  <span class="text-lgtext-gray-500">{{ gameDetail!.genre }}</span>
                </div>
                <div class="game-detail-info__list-row">
                  <span class="text-lgfont-semibold text-gray-700">Release Year:</span>
                  <span class="text-lgtext-gray-500">{{ gameDetail!.release_year }}</span>
                </div>
                <div class="game-detail-info__list-row">
                  <span class="text-lgfont-semibold text-gray-700">Platform:</span>
                  <span class="text-lgtext-gray-500">{{ gameDetail!.platform }}</span>
                </div>
                <div class="game-detail-info__list-row">
                  <span class="text-lgfont-semibold text-gray-700">Developer:</span>
                  <span class="text-lgtext-gray-500">{{ gameDetail!.developer }}</span>
                </div>
              </div>
            </div>
            <div v-else>
              <div style="margin-bottom: 16px;">
                <BaseSkeletonLoader height="40px" width="85%" />
              </div>
              <div style="margin-bottom: 20px;">
                <BaseSkeletonLoader height="24px" width="164px" />
              </div>
              <div class="skeleton-meta">
                <div class="skeleton-meta-row" v-for="i in 4" :key="i">
                  <BaseSkeletonLoader height="24px" width="100px" />
                  <BaseSkeletonLoader height="24px" width="140px" />
                </div>
              </div>
            </div>
          </div>
          <div class="section block">
            <div v-if="!loading">
              <h2>About</h2>
              <div
                class="text-md text-gray-700"
                v-html="formatDescription(gameDetail?.description || '')"
              />
            </div>
            <div v-else>
              <div style="margin-bottom: 16px;">
                <BaseSkeletonLoader width="200px" height="32px" />
              </div>
              <div>
                <div v-for="i in 6" :key="i" style="padding-top: 2px; padding-bottom: 1px;">
                  <BaseSkeletonLoader :width="i % 3 ? '100%' : '80%'" height="21px"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="game-detail-block">
          <div class="game-detail-image">
            <div v-if="gameDetail" style="height: 100%;">
              <div v-if="!gameDetail.background_image && gameDetail.isFullData" class="game-detail-image__placeholder">
                  <div class="text-5xl">🎮</div>
                  <p class="text-sm text-gray-500">No cover image available</p>
                  <p class=" text-xs text-gray-400">Game ID: {{ gameDetail.id }}</p>
              </div>
              <img
                v-else-if="gameDetail.isFullData"
                :src="gameDetail.background_image"
                :alt="`${gameDetail.title} cover image`"
                @error="handleImageError"
                @load="handleImageLoad"
              />
            </div>
          </div>
          <div v-if="(gameDetail?.screenshots && gameDetail.screenshots.length > 0) || loading" class="section block">
            <div v-if="!loading && gameDetail?.screenshots">
              <h2>Screenshots</h2>
              <div class="game-detail-screenshots">
                <div
                  v-for="(screenshot, index) in gameDetail.screenshots.slice(0, 6)"
                  :key="index"
                  class="game-detail-screenshot"
                >
                  <img
                    :src="screenshot"
                    :alt="`Screenshot ${index + 1}`"
                    class="game-detail-screenshot__image"
                    loading="lazy"
                  >
                </div>
              </div>
            </div>
            <div v-else>
              <div style="margin-bottom: 16px;">
                <BaseSkeletonLoader width="200px" height="32px" />
              </div>
              <div class="game-detail-screenshots">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="game-detail-screenshot"
                >
                  <BaseSkeletonLoader width="100%" height="100%" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const gamesStore = useGamesStore()

const gameDetail = ref<GameDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const gameId = parseInt(route.params.id as string)

const retryLoad = async () => {
  await loadGameDetail()
}

const formatDescription = (description: string) => {
  if (!description) return 'No description available.'
  return description.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  console.error('Failed to load image:', img.src)
  img.style.display = 'none'
  const container = img.parentElement
  if (container) {
    const fallback = container.querySelector('.fallback') as HTMLElement
    if (fallback) {
      fallback.style.display = 'flex'
    }
  }
}

const handleImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement
  console.log('Image loaded successfully:', img.src)
}

const loadGameDetail = async () => {
  loading.value = true
  error.value = null
  
  const game = gamesStore.games.find(item => item.id === gameId)
  if (game)
    gameDetail.value = game
  
  try {
    gameDetail.value = await gamesStore.fetchGameDetail(gameId)
  } catch (err) {
    error.value = 'Failed to load game details' // UI error message
    console.error(CONSOLE_ERROR_MESSAGES.GAME_LOAD_FAILED + ':', err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadGameDetail()
})

const gameTitle = gameDetail.value?.title || 'Game Details'
useHead({
  title: `${gameTitle} - Game Catalog`,
  meta: [
    { name: 'description', content: `Learn more about ${gameTitle} - genre, rating, and detailed information.` }
  ]
})
</script>

<style>
.game-detail-block {
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.game-detail-info {
  min-height: 250px;
}

.game-detail-info__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.game-detail-info__list-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.game-detail-info__list-row:last-child {
  border-bottom: none;
}

.game-detail-info__list div:first-child {
  min-width: 100px;
}

.game-detail-info__list div:last-child {
  text-align: right;
}

.skeleton-stars {
  display: flex;
  gap: 4px;
}

.skeleton-meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.skeleton-meta-row:last-child {
  border-bottom: none;
}

.skeleton-description {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.game-detail-screenshots-skeleton {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

@media (max-width: 1024px) {
  .game-detail-main {
    flex-direction: column;
    align-items: stretch;
  }

  .game-detail-main > * {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .game-detail-screenshots-skeleton {
    grid-template-columns: 1fr;
  }
}
/* Game Detail Page Styles */
.game-detail-back {
  margin-bottom: 24px;
}

.game-detail-back-link {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  transition: color 0.2s ease;
}

.game-detail-back-link:hover {
  color: #1d4ed8;
}

.game-detail-loading {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.game-detail-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.game-detail-main {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

@media (max-width: 1024px) {
  .game-detail-main {
    flex-direction: column;
  }
}

.game-detail-info-skeleton {
  flex: 1;
  min-width: 0;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 100%;
}


.game-detail-image {
  aspect-ratio: 16 / 9;
  background-color: #f3f4f6;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.game-detail-image-skeleton {
  flex: 1;
  min-width: 0;
  aspect-ratio: 16 / 9;
  background-color: #f3f4f6;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.game-detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.game-detail-image img:hover {
  transform: scale(1.05);
}


.game-detail-image__placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;
}

.game-detail-description {
  padding: 24px;
  min-height: 250px;
}

.game-detail-description p {
  margin-bottom: 16px;
}

.game-detail-description p:last-child {
  margin-bottom: 0;
}

.game-detail-screenshots {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

@media (max-width: 768px) {
  .game-detail-screenshots {
    grid-template-columns: 1fr;
  }
}

.game-detail-screenshot {
  aspect-ratio: 16 / 9;
  background-color: #f3f4f6;
  border-radius: 8px;
  overflow: hidden;
}

.game-detail-screenshot__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.game-detail-screenshot__image:hover {
  transform: scale(1.05);
}

.game-detail-error-actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  flex-wrap: wrap;
}

</style>