<template>
  <div>
    <header class="layout-header">
      <nav class="layout-nav">
        <NuxtLink to="/" class="layout-link">
          🎮 GameCatalog
        </NuxtLink>
        <div class="search-container">
          <SearchBar />
        </div>
      </nav>
    </header>

    <main class="layout-main">
      <slot />
    </main>

    <footer class="layout-footer">
      Game Catalog - Mini project with Nuxt 4 & Vue 3
    </footer>
  </div>
</template>

<script setup lang="ts">
</script>