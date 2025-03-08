<template>
    <section class="flex flex-col items-center justify-center min-h-screen pt-10">
        <header>
            <h2 class="text-lg font-bold mb-4">Activities</h2>
        </header>

        <div v-if="activities.length > 0" class="w-full max-w-md bg-white shadow rounded p-4">
            <ul>
                <li v-for="activity in activities.slice().reverse()" :key="activity.ActivityID"
                    class="border-b last:border-none py-2 cursor-pointer hover:bg-gray-100"
                    @click="viewActivity(activity.ActivityID)">

                    <!-- Display Time Created -->
                    <div class="flex items-center justify-between">
                        <div class="flex-1">
                            <p>
                                <strong>Time Started:</strong> {{ formatDate(activity.time_started) }}
                            </p>
                        </div>
                    </div>

                    <!-- Activity Metrics -->
                    <p><strong>Distance:</strong> {{ getMetrics(activity.ActivityID).distance }} km</p>
                    <p><strong>Elapsed Time:</strong> {{ getMetrics(activity.ActivityID).elapsedTime }}</p>

                    <button @click.stop="openDeletePopup(activity.ActivityID)"
                        class="bg-red-500 text-white px-2 py-1 rounded">
                        Remove
                    </button>
                </li>
            </ul>
        </div>

        <div v-else class="text-center">
            <p>No activities available.</p>
        </div>

        <!-- Delete Confirmation -->
        <div v-if="showDeletePopup" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white p-6 rounded shadow-lg w-80">
                <h3 class="text-lg font-bold mb-4">Confirm Deletion</h3>
                <p>Are you sure you want to delete this activity?</p>
                <div class="flex justify-end gap-2 mt-4">
                    <button @click="closeDeletePopup" class="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                    <button @click="removeActivity" class="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import axiosInstance from "@/services/axiosInstance";
import { useMetricsStore } from '@/stores/MetricsStore.js';

export default {
    name: "ActivitiesList",
    data() {
        return {
            activities: [],
            showDeletePopup: false,
            activityToDelete: null,
        };
    },
    methods: {
        async fetchActivities() {
            try {
                const response = await axiosInstance.get("http://localhost:8000/api/activities/");
                console.log("Fetched activities:", response.data);

                this.activities = response.data.results.map(activity => ({
                    ...activity,
                    time_started: activity.time_started || null,
                }));
            } catch (error) {
                console.error("Error fetching activities:", error);
            }
        },
        openDeletePopup(activityId) {
            this.activityToDelete = activityId;
            this.showDeletePopup = true;
        },
        closeDeletePopup() {
            this.showDeletePopup = false;
            this.activityToDelete = null;
        },
        async removeActivity() {
            if (!this.activityToDelete) return;

            try {
                await axiosInstance.delete(`http://localhost:8000/api/activities/${this.activityToDelete}/`);
                this.activities = this.activities.filter(activity => activity.ActivityID !== this.activityToDelete);
            } catch (error) {
                console.error("Error deleting activity:", error);
            }

            this.closeDeletePopup();
        },
        formatDate(timestamp) {
            if (!timestamp) return "N/A";
            const date = new Date(timestamp);
            return date.toLocaleString();
        },
        getMetrics(activityId) {
            const metricsStore = useMetricsStore();
            return metricsStore.getMetrics(activityId) || {};
        },
        viewActivity(activityId) {
            this.$router.push({ name: 'ActivityView', params: { ActivityID: activityId } });
        }
    },

    mounted() {
        this.fetchActivities();
    },
};
</script>

<style scoped></style>
