<template>
  <div class="search-bar">
    <div class="search-bar__container">
      <BaseInput
        v-model="searchQuery"
        type="text"
        view="search"
        placeholder="Search games..."
        icon="magnifying-glass"
        @keyup.enter="performSearch"
      >
        <template #icon>
          <BaseIcon :size="1" color="gray-500">
            <IconSearch/>
          </BaseIcon>
        </template>
      </BaseInput>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  initialValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  initialValue: ''
})

const searchQuery = ref(props.initialValue)
const router = useRouter()
const route = useRoute()
const gamesStore = useGamesStore() as any

watch(() => gamesStore.filters.search, (newSearch) => {
  searchQuery.value = newSearch || ''
}, { immediate: true })

watch(() => route.query.search, (newSearch) => {
  if (newSearch !== gamesStore.filters.search) {
    searchQuery.value = (newSearch as string) || ''
    gamesStore.setFilters({
      ...gamesStore.filters,
      search: (newSearch as string) || ''
    })
  }
}, { immediate: true })

const performSearch = () => {
  const searchTerm = searchQuery.value.trim()
  gamesStore.setFilters({
    ...gamesStore.filters,
    search: searchTerm
  })

  const currentQuery = { ...router.currentRoute.value.query }
  if (searchTerm) {
    currentQuery.search = searchTerm
  } else {
    delete currentQuery.search
  }
  router.push({
    path: '/',
    query: currentQuery
  })
}

defineExpose({
  searchQuery
})
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  width: 100%;
}

.search-bar__container {
  width: 500px;
}

@media (min-width: 769px) {
  .search-bar {
    margin-left: 64px;
  }
}

@media (max-width: 768px) {
  .search-bar {
    margin-left: 0;
    margin-top: 0;
  }
}
</style>