<template>
    <section class="flex flex-col items-center justify-center min-h-screen pt-10">
        <header>
            <h2 class="text-lg font-bold mb-4">Activities</h2>
        </header>

        <div v-if="activities.length > 0" class="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
            <ul>
                <li v-for="activity in activities.slice().reverse()" :key="activity.ActivityID"
                    class="border-b last:border-none py-4 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg shadow-md transition duration-200 cursor-pointer"
                    @click="viewActivity(activity.ActivityID)">
                    <!-- Activity Header -->
                    <div class="flex items-center justify-between mb-2">
                        <p class="text-lg font-semibold"><strong>{{ formatDate(activity.time_started)
                                }}</strong></p>
                    </div>

                    <!-- Activity Metrics -->
                    <div class="grid grid-cols-2 gap-4 text-gray-800">
                        <p class="text-lg font-semibold"><strong>Distance:</strong> {{ activity.distance }} km</p>
                        <p class="text-lg font-semibold"><strong>Elapsed Time:</strong> {{ activity.elapsed_time }}</p>
                        <p>Avg Power: <strong> {{ roundNumber(activity.avg_power) }} W</strong></p>
                        <p>Total Work:<strong> {{ activity.total_work_kJ }} kJ</strong></p>
                        <p>Avg Speed:<strong> {{ activity.avg_speed }} km/h</strong></p>
                        <p>Temperature:<strong> {{ activity.avg_temperature }} C</strong></p>

                    </div>

                    <!-- Remove Button -->
                    <div class="text-left mt-4">
                        <button @click.stop="openDeletePopup(activity.ActivityID)"
                            class="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-200">
                            Remove
                        </button>
                    </div>
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
        roundNumber(value) {
            return Math.round(value);
        },
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
