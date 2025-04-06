<template>
    <TheHeader />
    <div class="calendar-container p-4">
        <h1 class="text-2xl font-bold mb-4">Training Calendar</h1>
        <ScheduleXCalendar :calendar-app="calendarApp" />
    </div>
</template>

<script setup>
import { shallowRef, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ScheduleXCalendar } from '@schedule-x/vue'
import { createCalendar, createViewMonthGrid } from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import '@schedule-x/theme-default/dist/calendar.css'
import TheHeader from '@/components/TheHeader.vue'
import axiosInstance from '@/services/axiosInstance'
import { API_URL } from "@/const";
const router = useRouter();
const eventsServicePlugin = createEventsServicePlugin();

function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
}

const calendarApp = shallowRef(createCalendar({
    views: [
        createViewMonthGrid(),
    ],
    callbacks: {
        onEventUpdate() {
            fetchAllActivities();
        },
        onEventClick(calendarEvent) {
            console.log('onEventClick', calendarEvent);
            viewActivity(calendarEvent.id);
        }
    },
    selectedDate: getCurrentDate(),
}, [eventsServicePlugin]));

function viewActivity(activityId) {
    router.push({ name: 'ActivityView', params: { ActivityID: activityId } });
}

function formatDate(dateTime) {
    return dateTime.split('T')[0];
}

function formatElapsedTime(timeString) {
    if (!timeString) return "N/A";
    const [hours, minutes] = timeString.split(":").map(Number);
    return `${hours}h ${minutes}min`;
}

async function fetchAllActivities(page = 1, allActivities = []) {
    try {
        const response = await axiosInstance.get(
            `${API_URL}/api/activities/?page=${page}&limit=50`
        );

        const activities = response.data.results;
        allActivities.push(...activities);

        if (response.data.next) {
            return fetchAllActivities(page + 1, allActivities);
        }

        const events = allActivities.map(activity => ({
            id: activity.ActivityID,
            title: `${activity.distance} km`,
            start: formatDate(activity.time_started),
            end: formatDate(activity.time_started),
            _customContent: {
                monthGrid: `<div><strong>${activity.distance} km</strong></div>
                    <div>Time: ${formatElapsedTime(activity.elapsed_time)}</div>`,
            },
        }));

        eventsServicePlugin.set(events);
    } catch (error) {
        console.error("Error fetching activities:", error);
    }
}

onMounted(() => {
    fetchAllActivities();
});

</script>

<style scoped>
.calendar-container {
    max-width: 1200px;
    margin: auto;
}

:deep(.sx__event) {
    min-height: 40px;
    padding: 4px;
    font-size: 14px;
    line-height: 1.5;
}

:deep(.sx__event) {
    background-color: #121828 !important;
    color: white !important;
    --sx-color-primary: #000000;
    /* --sx-color-on-primary: #fd0303; */
}

.sx-vue-calendar-wrapper {
    width: 1200px;
    max-width: 100vw;
    height: 800px;
    max-height: 90vh;
}

.sx__month-grid-day__header-date.sx__is-today {
    background-color: #000000;
    color: var(--sx-color-on-primary);
}
</style>
