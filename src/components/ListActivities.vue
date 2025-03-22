<template>
    <section class="flex flex-col items-center justify-center min-h-screen pt-10">
        <header>
            <h2 class="text-lg font-bold mb-4">Activities</h2>
        </header>

        <div v-if="activities.length > 0" class="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
            <ul>
                <li v-for="activity in activities" :key="activity.ActivityID"
                    class="border-b last:border-none py-3 px-3 bg-gray-50 hover:bg-gray-100 rounded-lg shadow-md transition duration-200 cursor-pointer"
                    @click="viewActivity(activity.ActivityID)">


                    <div class="flex items-center justify-between mb-2 bg-black text-white px-4 py-2 rounded-md">
                        <p class="text-lg">
                            <strong>{{ activity.state }}, {{ formatDate(activity.time_started)
                                }}</strong>
                        </p>
                    </div>


                    <div class="grid grid-cols-2 gap-1 text-gray-800">
                        <p><strong>Distance:</strong> {{ activity.distance }} km</p>
                        <p><strong>Elapsed Time:</strong> {{ formatElapsedTime(activity.elapsed_time) }}</p>
                        <p><strong>Avg Power:</strong> {{ roundNumber(activity.avg_power) }} W</p>
                        <p><strong>Total Work:</strong> {{ activity.total_work_kJ }} kJ</p>
                        <p><strong>Avg Speed:</strong> {{ activity.avg_speed }} km/h</p>
                        <p><strong>Temperature:</strong> {{ activity.avg_temperature }} °C</p>
                    </div>


                    <div class="text-left mt-4">
                        <button @click.stop="openDeletePopup(activity.ActivityID)"
                            class="bg-red-950 text-red-400 border border-red-400 border-b-1 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
                            <span
                                class="bg-red-400 shadow-red-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                            Remove
                        </button>

                    </div>
                </li>
            </ul>
        </div>

        <div v-else class="text-center">
            <div class="flex flex-row gap-2">
                <div class="w-4 h-4 rounded-full bg-black animate-bounce [animation-delay:.7s]"></div>
                <div class="w-4 h-4 rounded-full bg-black animate-bounce [animation-delay:.3s]"></div>
                <div class="w-4 h-4 rounded-full bg-black animate-bounce [animation-delay:.7s]"></div>
            </div>
        </div>


        <div v-if="showDeletePopup" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white p-6 rounded shadow-lg w-80">
                <h3 class="text-lg font-bold mb-4">Confirm Deletion</h3>
                <p>Are you sure you want to delete this activity?</p>
                <div class="flex justify-end gap-2 mt-4">
                    <button @click="closeDeletePopup"
                        class="bg-gray-800 text-gray-300 border border-gray-400 border-b-1 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
                        <span
                            class="bg-gray-400 shadow-gray-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                        Cancel
                    </button>

                    <button @click="removeActivity"
                        class="bg-red-950 text-red-400 border border-red-400 border-b-1 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
                        <span
                            class="bg-red-400 shadow-red-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </section>
    <div class="flex justify-center mt-4 space-x-2">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
            class="bg-gray-800 text-gray-300 border border-gray-400 border-b-1 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
            <span
                class="bg-gray-400 shadow-gray-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
            Prev
        </button>


        <span v-for="page in totalPages" :key="page">
            <button @click="changePage(page)" :class="['px-4 py-2 rounded',
                currentPage === page
                    ? 'bg-blue-600 text-white border border-blue-700 border-b-1 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group'
                    : 'bg-blue-300 text-blue-900']">
                {{ page }}
            </button>
        </span>


        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
            class="bg-gray-800 text-gray-300 border border-gray-400 border-b-1 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
            <span
                class="bg-gray-400 shadow-gray-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
            Next
        </button>
    </div>
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
            currentPage: 1,
            totalPages: 1,
            nextPage: null,
            prevPage: null,
            itemsPerPage: 7,
        };
    },
    methods: {
        roundNumber(value) {
            return Math.round(value);
        },
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.fetchActivities(page);
            }
        },
        formatElapsedTime(timeString) {
            if (!timeString) return "N/A";
            const [hours, minutes] = timeString.split(":").map(Number);
            return `${hours}h ${minutes}min`;
        },
        async fetchActivities(page = 1) {
            try {
                const response = await axiosInstance.get(
                    `http://localhost:8000/api/activities/?page=${page}&limit=${this.itemsPerPage}`
                );

                this.activities = response.data.results;

                this.activities.sort((a, b) => {
                    const timeA = new Date(a.time_started);
                    const timeB = new Date(b.time_started);


                    return timeB - timeA;
                });

                for (const activity of this.activities) {
                    activity.state = await this.getNearestState(activity.position_lat, activity.position_long);
                }

                this.totalPages = Math.ceil(response.data.count / this.itemsPerPage);
                this.nextPage = response.data.next;
                this.prevPage = response.data.previous;
                this.currentPage = page;
            } catch (error) {
                console.error("Error fetching activities:", error);
            }
        },
        async getNearestState(lat, lon) {
            if (!lat || !lon) return "Unknown";

            const cacheKey = `state_${lat}_${lon}`;
            const cachedState = localStorage.getItem(cacheKey);

            if (cachedState) {
                return cachedState;
            }

            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
            try {
                const response = await fetch(url);
                const data = await response.json();

                if (!data.address) {
                    console.warn("Address data is missing from response:", data);
                    return "Unknown";
                }

                const state = data.address.state || data.address.town || data.address.village || "Unknown";

                localStorage.setItem(cacheKey, state);

                return state;
            } catch (error) {
                console.error("Error fetching city data:", error);
                return "Unknown";
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
            return date.toLocaleString(undefined, {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
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
