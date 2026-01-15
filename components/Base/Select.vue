<template>
  <div class="select-wrapper">
    <select
      :value="modelValue"
      :disabled="disabled"
      :class="selectClasses"
      class="select text-gray-700"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    >
      <option v-if="placeholder" value="" disabled>
        {{ placeholder }}
      </option>
      <slot />
    </select>

    <div class="select__arrow">
      <BaseIcon color="gray-400" :size="2">
        <IconChevronDown />
      </BaseIcon>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number
  placeholder?: string
  disabled?: boolean
  size?: string
  view?: string
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  view: 'default'
})

const validSizes = ['sm', 'md', 'lg']
const validViews = ['default']

if (!validSizes.includes(props.size)) {
  console.warn(`BaseSelect: Invalid size "${props.size}". Valid values: ${validSizes.join(', ')}`)
}

if (!validViews.includes(props.view)) {
  console.warn(`BaseSelect: Invalid view "${props.view}". Valid values: ${validViews.join(', ')}`)
}

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const selectClasses = computed(() => {
  const classes = ['select--size-' + props.size, 'text-' + props.size]

  if (props.error) {
    classes.push('select--error')
  }

  if (props.disabled) {
    classes.push('select--disabled')
  }

  return classes
})
</script>

<style>
.select-wrapper {
  position: relative;
  width: 100%;
}

.select {
  width: 100%;
  padding: 8px 16px;
  padding-right: 40px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;
  font-family: inherit;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: none;
  box-sizing: border-box;
}

.select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.select--size-sm {
  padding: 6px 12px;
  padding-right: 36px;
}

.select--size-lg {
  padding: 12px 16px;
  padding-right: 44px;
}

.select--error {
  border-color: #ef4444;
}

.select--error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.select--disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
  opacity: 0.7;
}

.select__arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  pointer-events: none;
  transition: color 0.2s ease;
}

.select-wrapper:hover .select__arrow {
  color: #374151;
}

.select:focus + .select__arrow {
  color: #3b82f6;
}

.select--error + .select__arrow {
  color: #ef4444;
}
</style>