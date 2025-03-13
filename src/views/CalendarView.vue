<template>
    <TheHeader />
    <div class="calendar-container p-4">
        <h1 class="text-2xl font-bold mb-4">Schedule</h1>
        <ScheduleXCalendar :calendar-app="calendarApp" />
    </div>
</template>

<script setup>
import { shallowRef, onMounted } from 'vue'
import { ScheduleXCalendar } from '@schedule-x/vue'
import { createCalendar, createViewMonthGrid, createViewWeek, createViewDay } from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/calendar.css'
import axios from 'axios'
import TheHeader from '@/components/TheHeader.vue'

const calendarApp = shallowRef(createCalendar({
    views: [
        createViewWeek(),
        createViewMonthGrid(),
        createViewDay(),
    ],
    selectedDate: "2025-01-11",
    events: [] // This will hold the events for the calendar
}))

// Fetch activities from API and format them for the calendar
async function fetchActivities(page = 1) {
    try {
        // Replace 'YOUR_API_TOKEN' with the actual token
        const response = await axios.get(
            `http://localhost:8000/api/activities/?page=${page}&limit=5`, {
            headers: {
                Authorization: `Token 42c85e2a09ad06c49e843b41a5e7e2f799500f0f` // Bearer token for authentication
            }
        }
        )

        const activities = response.data.results
        const events = activities.map(activity => {
            return {
                id: activity.ActivityID,
                title: `Activity ${activity.ActivityID} - ${activity.distance} km`,
                start: activity.time_started,
                end: activity.time_started,
                description: `Avg Speed: ${activity.avg_speed} km/h, Max Speed: ${activity.max_speed} km/h`,
                location: `${activity.position_lat}, ${activity.position_long}`
            }
        })

        calendarApp.value.events = events

    } catch (error) {
        console.error("Error fetching activities:", error)
    }
}

onMounted(() => {
    fetchActivities() // Fetch the activities when the component is mounted
})
</script>

<style scoped>
.calendar-container {
    max-width: 1200px;
    margin: auto;
}
</style>