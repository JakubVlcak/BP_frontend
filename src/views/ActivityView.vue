<template>
    <div>
        <TheHeader />
        <section class="flex flex-col items-center justify-center min-h-screen pt-10 px-4">
            <header>
                <h2 class="text-lg font-bold mb-4">Activity Details</h2>
            </header>

            <!-- Display Activity ID -->
            <div v-if="activity" class="w-full max-w-full bg-white shadow rounded p-4">
                <p><strong>Activity ID:</strong> {{ activity.ActivityID }}</p>
                <p><strong>Time Created:</strong> {{ formatDate(activity.timeCreated) }}</p>

                <!-- Display Metrics -->
                <div v-if="metrics" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 my-6">
                    <div class="text-center">
                        <p class="text-2xl font-bold">{{ metrics.distance }} km</p>
                        <p class="text-sm text-gray-600">Distance</p>
                    </div>
                    <div class="text-center">
                        <p class="text-2xl font-bold">{{ metrics.movingTime }}</p>
                        <p class="text-sm text-gray-600">Moving Time</p>
                    </div>
                    <div class="text-center">
                        <p class="text-2xl font-bold">{{ metrics.elevation }} m</p>
                        <p class="text-sm text-gray-600">Elevation</p>
                    </div>
                    <div class="text-center">
                        <p class="text-2xl font-bold">{{ metrics.avgPower }} w</p>
                        <p class="text-sm text-gray-600">Weighted Avg Power</p>
                    </div>
                    <div class="text-center">
                        <p class="text-2xl font-bold">{{ metrics.totalWork }} kJ</p>
                        <p class="text-sm text-gray-600">Total Work</p>
                    </div>
                </div>

                <!-- Display Cadence Data -->
                <div v-if="records && records.length > 0">
                    <h3 class="text-md font-semibold mt-4 mb-2">Cadence Records</h3>
                    <LineChart :data="records" :yKey="'cadence'" :lineColor="'steelblue'" />
                </div>
                <div v-else>
                    <p>No cadence data available.</p>
                </div>

                <!-- Display Power Data -->
                <div v-if="records && records.length > 0">
                    <h3 class="text-md font-semibold mt-4 mb-2">Power Records</h3>
                    <LineChart :data="records" :yKey="'power'" :lineColor="'orange'" />
                </div>
                <div v-else>
                    <p>No power data available.</p>
                </div>

                <!-- Display Heart Rate Data -->
                <div v-if="records && records.length > 0">
                    <h3 class="text-md font-semibold mt-4 mb-2">Heart Rate Records</h3>
                    <LineChart :data="records" :yKey="'heartRate'" :lineColor="'red'" />
                </div>
                <div v-else>
                    <p>No heart rate data available.</p>
                </div>

                <!-- Display Altitude Data -->
                <div v-if="records && records.length > 0">
                    <h3 class="text-md font-semibold mt-4 mb-2">Altitude Records</h3>
                    <LineChart :data="records" :yKey="'altitude'" :lineColor="'green'" />
                </div>
                <div v-else>
                    <p>No altitude data available.</p>
                </div>

                <!-- Display Temperature Data -->
                <div v-if="records && records.length > 0">
                    <h3 class="text-md font-semibold mt-4 mb-2">Temperature Records</h3>
                    <LineChart :data="records" :yKey="'temperature'" :lineColor="'purple'" />
                </div>
                <div v-else>
                    <p>No temperature data available.</p>
                </div>
            </div>

            <!-- Loading State -->
            <div v-else-if="loading" class="text-center">
                <p>Loading activity details...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="text-center text-red-500">
                <p>Error loading activity details: {{ error }}</p>
            </div>

            <!-- No Activity Found -->
            <div v-else class="text-center">
                <p>No activity found.</p>
            </div>
        </section>
    </div>
</template>

<script>
import axiosInstance from "@/services/axiosInstance";
import TheHeader from '@/components/TheHeader.vue';
import LineChart from '@/components/LineChart.vue'; // Import the LineChart component

export default {
    components: {
        TheHeader,
        LineChart, // Register the LineChart component
    },
    data() {
        return {
            activity: null, // Store the fetched activity details
            records: [], // Store the fetched records
            metrics: null, // Store calculated metrics
            loading: true, // Track loading state
            error: null, // Track error state
        };
    },
    methods: {
        async fetchActivity() {
            try {
                const activityId = this.$route.params.ActivityID; // Get ActivityID from route params
                const response = await axiosInstance.get(`/api/activities/${activityId}/`);
                const response2 = await axiosInstance.get(`/api/activities/${activityId}/records/`);

                console.log("Activity Response:", response.data); // Log activity response
                console.log("Records Response:", response2.data); // Log records response

                this.activity = response.data;
                this.records = response2.data; // Store the fetched records

                // Calculate metrics
                this.calculateMetrics(response2.data);
            } catch (error) {
                console.error("Error fetching activity details:", error);
                this.error = "Failed to load activity details. Please try again later.";
            } finally {
                this.loading = false; // Set loading to false after the request completes
            }
        },
        calculateMetrics(records) {
            if (!records || records.length === 0) return;

            // Calculate Distance (in km)
            const distance = records[records.length - 1].distance; // Last record's distance
            const distanceKm = (distance / 1000).toFixed(2); // Convert to km

            // Calculate Moving Time (in hh:mm:ss format)
            const startTime = new Date(records[0].timestamp);
            const endTime = new Date(records[records.length - 1].timestamp);
            const movingTimeMs = endTime - startTime;
            const movingTime = new Date(movingTimeMs).toISOString().substr(11, 8); // Format as hh:mm:ss

            // Calculate Elevation (in meters)
            const elevation = records.reduce((acc, record) => {
                const altitude = parseFloat(record.altitude);
                return acc + (isNaN(altitude) ? 0 : altitude); // Handle non-numeric altitude values
            }, 0);

            // Calculate Weighted Average Power (in watts)
            const totalPower = records.reduce((acc, record) => {
                const power = parseFloat(record.power);
                return acc + (isNaN(power) ? 0 : power); // Handle non-numeric power values
            }, 0);
            const avgPower = (totalPower / records.length).toFixed(0);

            // Calculate Total Work (in kJ)
            const totalWork = (totalPower * (movingTimeMs / 1000) / 1000).toFixed(0); // Work = Power * Time

            this.metrics = {
                distance: distanceKm,
                movingTime,
                elevation: elevation.toFixed(0), // Now elevation is guaranteed to be a number
                avgPower,
                totalWork,
            };
        },
        formatDate(timestamp) {
            const date = new Date(timestamp);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();

            return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        },
    },
    mounted() {
        this.fetchActivity(); // Fetch activity details when the component is mounted
    },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>