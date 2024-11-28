<template>
  <div class="notifications-container">
    <div class="notifications-header">
      <h2>Notifikácie</h2>
      <button @click="awesome = !awesome">adasdsa</button>
      <div class="total-badge">{{ totalNotifications }}</div>
    </div>

    <!-- Notification categories -->
    <div v-if="awesome" class="toggle-notification-category">
      <div
        v-for="(category, index) in categories"
        :key="index"
        class="notification-category"
      >
        <div class="notification-header">
          <span>{{ category.title }}</span>
          <div class="category-controls">
            <span class="badge">{{ category.count }}</span>
            <button @click="clearNotifications(index)" class="clear-btn">
              🗑️
            </button>
            <button @click="toggleCategory(index)">
              {{ category.isOpen ? '▲' : '▼' }}
            </button>
          </div>
        </div>

        <!-- Show/hide details -->
        <div v-if="category.isOpen" class="notification-details">
          <p>Details about {{ category.title }} notifications...</p>
        </div>
      </div>

      <!-- Maintenance link -->
      <a href="#" class="maintenance-link">Údržba notifikácií</a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      awesome: false,
      categories: [
        { title: 'O hodnoteniach predmetov', count: 18, isOpen: false },
        { title: 'O termínoch hodnotenia', count: 107, isOpen: false },
        { title: 'O dokumentoch', count: 69, isOpen: false },
      ],
    }
  },
  computed: {
    totalNotifications() {
      // Sum of all category counts
      return this.categories.reduce((sum, category) => sum + category.count, 0)
    },
  },
  methods: {
    toggleCategory(index) {
      // Toggle the open state of the category
      this.categories[index].isOpen = !this.categories[index].isOpen
    },
    clearNotifications(index) {
      // Clear notifications for a specific category
      this.categories[index].count = 0
    },
  },
}
</script>

<style scoped>
.notifications-container {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  max-width: 400px;
  margin: 0 auto;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  margin-bottom: 10px;
}

.total-badge {
  background-color: red;
  color: white;
  padding: 5px 10px;
  border-radius: 50%;
}

.notification-category {
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge {
  background-color: red;
  color: white;
  padding: 5;
}
</style>
