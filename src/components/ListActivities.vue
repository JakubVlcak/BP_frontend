<template>
    <section class="flex flex-col items-center justify-center min-h-screen pt-10">
        <header>
            <h2 class="text-lg font-bold mb-4">Activities</h2>
        </header>

        <div v-if="activities.length > 0" class="w-full max-w-md bg-white shadow rounded p-4">
            <ul>
                <li v-for="activity in activities" :key="activity.id" class="border-b last:border-none py-2">
                    <p><strong>Time Created:</strong> {{ formatDate(activity.timeCreated) }}</p>
                </li>
            </ul>
        </div>

        <div v-else class="text-center">
            <p>No activities available.</p>
        </div>
    </section>
</template>

<script>
import axiosInstance from "@/services/AxiosInstance";

export default {
    name: "ActivitiesList",
    data() {
        return {
            activities: [],
        };
    },
    methods: {
        async fetchActivities() {
            try {
                const response = await axiosInstance.get("http://localhost:8000/api/activities/");
                this.activities = response.data.results;
            } catch (error) {
                console.error("Error fetching activities:", error);
            }
        },
        formatDate(timestamp) {
            const date = new Date(timestamp);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();


            return `${year} ${month}.${day} ${hours}:${minutes.toString().padStart(2, '0')}`;
        },
    },
    mounted() {
        this.fetchActivities();
    },
};
</script>

<style scoped></style>