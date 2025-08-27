<script setup lang="ts">
    interface Props {
        title: string
        subtitle?: string
        detail?: string
    }

    const props = defineProps<Props>()
</script>

<template>
  <div class="toast-content">
    <h4 class="toast-title">{{ title }}</h4>
    <p v-if="subtitle" class="toast-subtitle">{{ subtitle }}</p>
    <small v-if="detail" class="toast-detail">{{ detail }}</small>
  </div>
</template>

<style scoped>
.toast-content {
  display: flex;
  flex-direction: column;
}
.toast-title {
    color: var(--toastify-color-light);
    font-size: 1.125rem;
    font-weight: 500;
    margin-bottom: 4px;
}
.toast-subtitle {
  font-size: 0.9375rem;
  font-style: italic;
  margin-bottom: 2px;
}
.toast-detail {
  font-size: 0.9375rem;
}
</style>
