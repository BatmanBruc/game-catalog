<template>
  <div class="skeleton-loader" :style="getItemStyle()">
  </div>
</template>

<script setup lang="ts">
interface Props {
  width?: string
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '20px',
})

const getItemStyle = () => {
  const width = props.width
  const height = props.height

  return {
    width,
    height
  }
}
</script>

<style>
.skeleton-loader {
  background-color: #f3f4f6;
  animation: skeleton-pulse 2s ease-in-out infinite;
  box-sizing: border-box;
  border-radius: 6px;
}
</style>