import { defineStore } from 'pinia'

export const useMetricsStore = defineStore('metrics', {
  state: () => ({
    metricsByActivity: JSON.parse(localStorage.getItem('metricsStore')) || {}, // Load from localStorage
  }),
  actions: {
    setMetrics(activityId, metrics) {
      this.metricsByActivity[activityId] = metrics
      localStorage.setItem(
        'metricsStore',
        JSON.stringify(this.metricsByActivity),
      ) // Save to localStorage
    },
    getMetrics(activityId) {
      return this.metricsByActivity[activityId] || {}
    },
    preloadMetrics() {
      const storedMetrics = localStorage.getItem('metricsStore')
      if (storedMetrics) {
        this.metricsByActivity = JSON.parse(storedMetrics)
        console.log(
          'Metrics preloaded from localStorage:',
          this.metricsByActivity,
        )
      }
    },
  },
})
