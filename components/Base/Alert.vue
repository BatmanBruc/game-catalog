<template>
  <div :class="[`alert--view-${props.view}`]" class="alert">
    <div class="alert__content">
      <div v-if="showIcon" class="alert__icon">
        <BaseIcon v-if="view === 'error'" color="error-text" :size="2">
          <IconX />
        </BaseIcon>
        <BaseIcon v-else-if="view === 'warning'" color="warning-text" :size="2">
          <IconAlertTriangle />
        </BaseIcon>
        <BaseIcon v-else-if="view === 'success'" color="success-text" :size="2">
          <IconCheck />
        </BaseIcon>
        <BaseIcon v-else-if="view === 'info'" color="info-text" :size="2">
          <IconInfo />
        </BaseIcon>
      </div>
      <div class="alert__body">
        <div v-if="text" class="alert__title">{{ text }}</div>
        <div v-if="$slots.default" class="alert__description">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  view?: string
  text?: string
  showIcon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  view: 'info',
  showIcon: true
})

const validViews = ['error', 'warning', 'success', 'info']

if (!validViews.includes(props.view)) {
  console.warn(`BaseAlert: Invalid view "${props.view}". Valid values: ${validViews.join(', ')}`)
}

</script>

<style scoped>
.alert {
  border-radius: 8px;
  padding: 16px;
  border: 1px solid;
}

.alert__content {
  display: flex;
}

.alert__icon {
  flex-shrink: 0;
  margin-right: 12px;
}

.alert__body {
  flex: 1;
}

.alert__title {
  font-weight: 500;
}

.alert__description {
  margin-top: 8px;
}

.alert--view-error {
  background-color: var(--color-error-light);
  border-color: var(--color-error-border);
  color: var(--color-error);
}

.alert--view-warning {
  background-color: var(--color-warning-light);
  border-color: var(--color-warning-border);
  color: var(--color-warning);
}

.alert--view-success {
  background-color: var(--color-success-light);
  border-color: var(--color-success-border);
  color: var(--color-success);
}

.alert--view-info {
  background-color: var(--color-info-light);
  border-color: var(--color-info-border);
  color: var(--color-info);
}
</style>