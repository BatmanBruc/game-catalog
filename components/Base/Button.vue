<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    :type="href ? undefined : type"
    :disabled="disabled"
    :class="buttonClasses"
    class="button font-medium"
    @click="handleClick"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { useSlots } from 'vue'

interface Props {
  view?: string
  size?: string
  disabled?: boolean
  href?: string
  type?: 'button' | 'submit' | 'reset'
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  view: 'primary',
  size: 'md',
  type: 'button'
})

const validSizes = ['sm', 'md', 'lg']
const validViews = ['primary', 'secondary', 'outline', 'ghost']

if (!validSizes.includes(props.size)) {
  console.warn(`BaseButton: Invalid size "${props.size}". Valid values: ${validSizes.join(', ')}`)
}

if (!validViews.includes(props.view)) {
  console.warn(`BaseButton: Invalid view "${props.view}". Valid values: ${validViews.join(', ')}`)
}

const emit = defineEmits<{
  click: [event: Event]
}>()

const slots = useSlots()

const handleClick = (event: Event) => {
  if (props.disabled) {
    event.preventDefault()
    return
  }
  emit('click', event)
}

const buttonClasses = computed(() => {
  const classes = [
    `button--view-${props.view}`,
    `button--size-${props.size}`,
    'text-' + props.size
  ]

  if (props.block) {
    classes.push('button--block')
  }

  if (props.disabled) {
    classes.push('button--disabled')
  }

  return classes
})
</script>

<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid transparent;
  outline: none;
}

.button--view-primary {
  background-color: var(--color-blue-500);
  border-color: var(--color-blue-500);
  color: white;
}

.button--view-primary:hover:not(:disabled) {
  background-color: var(--color-blue-600);
  border-color: var(--color-blue-600);
}

.button--view-secondary {
  background-color: white;
  border-color: var(--color-gray-300);
  color: var(--color-gray-700);
}

.button--view-secondary:hover:not(:disabled) {
  background-color: var(--color-gray-50);
  border-color: var(--color-gray-400);
}

.button--view-outline {
  background-color: transparent;
  border-color: var(--color-blue-500);
  color: var(--color-blue-500);
}

.button--view-outline:hover:not(:disabled) {
  background-color: var(--color-blue-50);
}

.button--view-ghost {
  background-color: transparent;
  border-color: transparent;
  color: var(--color-gray-600);
}

.button--view-ghost:hover:not(:disabled) {
  background-color: var(--color-gray-100);
  color: var(--color-gray-900);
}

.button--size-sm {
  padding: 6px var(--space-3);
}

.button--size-md {
  padding: var(--space-2) var(--space-4);
}

.button--size-lg {
  padding: var(--space-3) var(--space-6);
}

.button--block {
  width: 100%;
}

.button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>