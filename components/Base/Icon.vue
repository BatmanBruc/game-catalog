<template>
  <div class="icon" :class="classes" :style="style">
    <slot />
  </div>
</template>
<script setup lang="ts">
type Props = {
  color: string;
  size: number;
  rotate?: number;
};
const props = defineProps<Props>();

const classes = computed(() => {
  return 'icon--size-' + (props.size || 1);
});

const style = computed(() => {
  return {
    rotate: (props.rotate || 0) + 'deg',
    fill: `var(--color-${props.color})`,
  };
});
</script>
<style>
.icon {
  display: flex;
  &--size-1 {
    width: 18px;
    height: 18px;
  }
  &--size-2 {
    width: 20px;
    height: 20px;
  }
  &--size-3 {
    width: 24px;
    height: 24px;
  }
  svg {
    width: 100%;
    height: 100%;
    fill: inherit;
  }
}
</style>
