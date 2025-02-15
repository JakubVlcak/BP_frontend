<script setup>
import { onMounted } from 'vue'
import { useMetricsStore } from '@/stores/MetricsStore.js'

const metricsStore = useMetricsStore()

onMounted(() => {
  metricsStore.preloadMetrics() // Load stored metrics
})
</script>
<template>
  <router-view></router-view>
</template>

<style scoped></style>