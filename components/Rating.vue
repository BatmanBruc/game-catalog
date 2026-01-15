<template>
  <div :class="ratingClasses">
    <div class="rating__stars">
      <div
        v-for="i in 5"
        :key="i"
        class="rating__star"
        :style="{ '--fill-percent': getStarFillPercent(i) + '%' }"
      >
        <div class="rating__star__empty">
          <BaseIcon color="star-empty" :size="1">
            <IconStar />
          </BaseIcon>
        </div>
        <div class="rating__star__filled">
          <BaseIcon color="star-filled" :size="1">
            <IconStar />
          </BaseIcon>
        </div>
      </div>
    </div>
    <span :class="textClasses">{{ rating }}/5</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  rating: number
  view: 'card' | 'page'
  metacriticScore?: number
}

const props = withDefaults(defineProps<Props>(), {
  metacriticScore: undefined
})

const ratingClasses = computed(() => {
  return ['rating', `rating--view-${props.view}`]
})

const textClasses = computed(() => {
  return props.view === 'card'
    ? 'rating__text text-sm font-medium text-gray-700'
    : 'rating__text text-md font-semibold text-gray-900'
})

const getStarFillPercent = (starIndex: number) => {
  const starValue = starIndex
  const ratingValue = props.rating

  if (ratingValue >= starValue) {
    return 100
  } else if (ratingValue > starValue - 1) {
    return ((ratingValue - (starValue - 1)) / 1) * 100
  } else {
    return 0
  }
}
</script>

<style scoped>
.rating {
  display: flex;
  align-items: center;
}

.rating__stars {
  display: flex;
}

.rating__star {
  position: relative;
  display: inline-block;
}

.rating__star__empty {
  color: var(--color-star-empty);
}

.rating__star__filled {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  color: var(--color-star-filled);
  clip-path: inset(0 calc(100% - var(--fill-percent)) 0 0);
  transition: clip-path 0.2s ease;
}

.rating__text {
  margin-left: 8px;
}

.rating--view-card .rating__stars {
  margin-right: 8px;
}

.rating--view-card .rating__star {
  width: 16px;
  height: 16px;
}

.rating--view-page .rating__stars {
  margin-right: 12px;
}

.rating--view-page .rating__star {
  width: 24px;
  height: 24px;
}

.rating--view-page .rating__metacritic {
  margin-left: 16px;
}
</style>