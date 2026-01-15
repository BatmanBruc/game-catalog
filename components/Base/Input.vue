<template>
  <div class="input-wrapper">
    <div v-if="$slots.icon" class="input__icon">
      <slot name="icon" />
    </div>

    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="inputClasses"
      class="input text-gray-700"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
      @keyup.enter="$emit('enter', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { useSlots } from 'vue'

interface Props {
  modelValue?: string | number
  type?: string
  placeholder?: string
  disabled?: boolean
  size?: string
  view?: string
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  view: 'default'
})

const validSizes = ['sm', 'md', 'lg']
const validViews = ['default', 'search']

if (!validSizes.includes(props.size)) {
  console.warn(`BaseInput: Invalid size "${props.size}". Valid values: ${validSizes.join(', ')}`)
}

if (!validViews.includes(props.view)) {
  console.warn(`BaseInput: Invalid view "${props.view}". Valid values: ${validViews.join(', ')}`)
}

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
  enter: [event: KeyboardEvent]
}>()

const slots = useSlots()

const inputClasses = computed(() => {
  const classes = [
    'input--size' + props.size,
    'input--view-' + props.view,
    'text-' + props.size,
    
  ]
  if (slots.icon) {
    classes.push('input--with-icon')
  }

  if (props.error) {
    classes.push('input--error')
  }

  if (props.disabled) {
    classes.push('input--disabled')
  }

  return classes
})
</script>

<style>
.input-wrapper {
  position: relative;
}

.input {
  width: 100%;
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;
  font-family: inherit;
  background-color: white;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input--size-sm {
  padding: 6px 12px;
}

.input--size-lg {
  padding: 12px 16px;
}

.input--with-icon {
  padding-left: 48px;
}

.input--error {
  border-color: #ef4444;
}

.input--error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.input--disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
  opacity: 0.7;
}

.input__icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 16px;
}
</style>