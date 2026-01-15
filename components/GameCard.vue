<template>
  <NuxtLink :to="`/games/${game.id}`" class="game-card__link-wrapper">
    <div class="game-card block">
      <div class="game-card__content">
        <h3 class="game-card__title">
          {{ game.title }}
        </h3>

        <div class="game-card__meta-group">
          <div class="game-card__meta text-sm text-gray-500">
            <span class="game-card__meta-label">Genre:</span>
            <span class="game-card__badge text-blue-800 text-xs font-medium">
              {{ game.genre }}
            </span>
          </div>

          <div class="game-card__meta text-sm text-gray-500">
            <span class="game-card__meta-label">Year:</span>
            <span class="game-card__meta-value">{{ game.release_year }}</span>
          </div>

          <div class="game-card__meta text-sm text-gray-500">
            <span class="game-card__meta-label">Platform:</span>
            <span class="game-card__meta-value">{{ game.platform }}</span>
          </div>

          <div class="game-card__meta text-sm text-gray-500">
            <span class="game-card__meta-label">Developer:</span>
            <span class="game-card__meta-value">{{ game.developer }}</span>
          </div>
        </div>
      </div>
      <Rating :rating="game.rating" view="card" />
      <div class="game-card__link text-sm font-medium link-primary">
        View Details
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Game } from '~/types/game'

defineProps<{
  game: Game
}>()
</script>

<style scoped>
.game-card__link-wrapper {
  display: block;
  text-decoration: none;
  color: inherit;
  height: 100%;
}

.game-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  position: relative;
}

.game-card__content {
  flex: 1;
}


.game-card__meta-group {
  margin-bottom: 16px;
}

.game-card__meta {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.game-card__meta-label {
  min-width: 70px;
  flex-shrink: 0;
  color: #6b7280;
}

.game-card__meta-value {
  margin-left: 8px;
  color: #374151;
}

.game-card__badge {
  padding: 4px 10px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-radius: 16px;
  margin-left: 8px;
  border: 1px solid #93c5fd;
  white-space: nowrap;
}

.game-card__footer {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}


.game-card__link {
  position: absolute;
  bottom: 24px;
  right: 24px;
}

.game-card__link::after {
  content: "→";
  margin-left: 4px;
  transition: transform 0.2s ease;
}

.game-card__link:hover::after {
  transform: translateX(2px);
}

.game-card__title {
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}
</style>
