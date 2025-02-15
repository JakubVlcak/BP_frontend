import { createApp } from 'vue' // Create the Vue instance
import App from './App.vue' // Your root component
import { createPinia } from 'pinia' // Pinia store
import router from './router' // (Optional) Vue Router if you're using it
import './index.css'
import { useMetricsStore } from '@/stores/MetricsStore.js'

const app = createApp(App) // Create Vue app

app.use(createPinia())
const metricsStore = useMetricsStore()
metricsStore.preloadMetrics()

// Add Pinia store plugin
app.use(router) // (Optional) Add Vue Router plugin

app.mount('#app') // Mount the app to an element with id 'app'
