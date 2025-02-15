<template>
    <div>
        <TheHeader />
        <section class="flex flex-col items-center justify-center min-h-screen pt-10 px-4">
            <header>
                <h2 class="text-lg font-bold mb-4">Activity Details</h2>
            </header>
            <div v-if="records.length > 0" class="w-full max-w-2xl my-6">
                <h3 class="text-md font-semibold mb-2">Activity Route</h3>
                <MapChart :data="records" :latKey="'position_lat'" :longKey="'position_long'" />
            </div>
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
                        <p class="text-2xl font-bold">{{ metrics.elapsedTime }}</p>
                        <p class="text-sm text-gray-600">Elapsed Time</p>
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

                <!-- Display Toggle Buttons -->
                <div class="mb-4">
                    <button @click="toggleChart('altitude')" class="px-4 py-2 bg-green-500 text-white rounded">Toggle
                        Altitude</button>
                    <button @click="toggleChart('speed')" class="px-4 py-2 bg-blue-500 text-white rounded">Toggle
                        Speed</button>
                    <button @click="toggleChart('power')" class="px-4 py-2 bg-purple-500 text-white rounded">Toggle
                        Power</button>
                    <button @click="toggleChart('heartRate')" class="px-4 py-2 bg-red-500 text-white rounded">Toggle
                        Heart Rate</button>
                    <button @click="toggleChart('cadence')" class="px-4 py-2 bg-orange-500 text-white rounded">Toggle
                        Cadence</button>
                    <button @click="toggleChart('temperature')" class="px-4 py-2 bg-pink-500 text-white rounded">Toggle
                        Temperature</button>
                </div>

                <!-- Display Charts -->
                <div v-if="records && records.length > 0" class="relative h-96">
                    <!-- Altitude -->
                    <div v-if="showAltitude">
                        <h3 class="text-md font-semibold mb-2">Altitude</h3>
                        <LineChart :data="records" :yKey="'altitude'" :lineColor="'green'" />
                    </div>
                    <!-- Speed -->
                    <div v-if="showSpeed">
                        <h3 class="text-md font-semibold mb-2">Speed</h3>
                        <LineChart :data="speedData" :yKey="'speed'" :lineColor="'blue'" />
                    </div>
                    <!-- Power -->
                    <div v-if="showPower">
                        <h3 class="text-md font-semibold mb-2">Power</h3>
                        <LineChart :data="records" :yKey="'power'" :lineColor="'purple'" />
                    </div>
                    <!-- Heart Rate -->
                    <div v-if="showHeartRate">
                        <h3 class="text-md font-semibold mb-2">Heart Rate</h3>
                        <LineChart :data="records" :yKey="'heartRate'" :lineColor="'red'" />
                    </div>
                    <div v-if="showCadence">
                        <h3 class="text-md font-semibold mb-2">Cadence Records</h3>
                        <LineChart :data="records" :yKey="'cadence'" :lineColor="'orange'" />
                    </div>
                    <!-- Temperature -->
                    <div v-if="showTemperature">
                        <h3 class="text-md font-semibold mb-2">Temperature</h3>
                        <LineChart :data="records" :yKey="'temperature'" :lineColor="'pink'" />
                    </div>
                </div>
                <div v-else>
                    <p>No data available.</p>
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
import LineChart from '@/components/LineChart.vue';
import MapChart from "@/components/MapChart.vue";
import { useMetricsStore } from '@/stores/MetricsStore.js';

export default {
    components: {
        TheHeader,
        LineChart,
        MapChart
    },
    data() {
        return {
            activity: null,
            records: [],
            metrics: null,
            loading: true,
            error: null,
            showCadence: true,
            showPower: true,
            showHeartRate: true,
            showAltitude: true,
            showTemperature: true,
            showSpeed: true,
        };
    },
    computed: {
        speedData() {
            return this.records
                .filter(record => record.speed > 0) // Filter out records with 0 speed
                .map(record => ({
                    ...record,
                    speed: (record.speed * 3.6).toFixed(2) // Convert m/s to km/h
                }));
        }
    },
    methods: {
        async fetchActivity() {
            try {
                const activityId = this.$route.params.ActivityID;
                const response = await axiosInstance.get(`/api/activities/${activityId}/`);
                const response2 = await axiosInstance.get(`/api/activities/${activityId}/records/`);

                console.log("Activity Response:", response.data);
                console.log("Records Response:", response2.data);

                this.activity = response.data;
                this.records = response2.data;
                const metricsStore = useMetricsStore();
                this.metrics = metricsStore.getMetrics(activityId);  // Set metrics to the component data

                this.calculateMetrics(response2.data, activityId);
            } catch (error) {
                console.error("Error fetching activity details:", error);
                this.error = "Failed to load activity details. Please try again later.";
            } finally {
                this.loading = false;
            }
        },
        toggleChart(chart) {
            this[`show${chart.charAt(0).toUpperCase() + chart.slice(1)}`] = !this[`show${chart.charAt(0).toUpperCase() + chart.slice(1)}`];
        },
        calculateMetrics(records, activityId) {
            if (!records || records.length === 0) return;

            const distance = records[records.length - 1].distance;
            const distanceKm = (distance / 1000).toFixed(2);

            const startTime = new Date(records[0].timestamp);
            const endTime = new Date(records[records.length - 1].timestamp);
            const movingTimeMs = endTime - startTime;
            const movingTimeSeconds = movingTimeMs / 1000;
            const elapsedTime = new Date(movingTimeMs).toISOString().substr(11, 8);

            // Ascended elevation
            let ascendedElevation = 0;
            for (let i = 1; i < records.length; i++) {
                const prevAltitude = parseFloat(records[i - 1].altitude);
                const currentAltitude = parseFloat(records[i].altitude);

                if (!isNaN(prevAltitude) && !isNaN(currentAltitude) && currentAltitude > prevAltitude) {
                    ascendedElevation += currentAltitude - prevAltitude;
                }
            }

            const totalPower = records.reduce((acc, record) => {
                const power = parseFloat(record.power);
                return acc + (isNaN(power) ? 0 : power);
            }, 0);
            const avgPower = (totalPower / records.length).toFixed(0);

            const totalWork = (avgPower * movingTimeSeconds / 1000).toFixed(0);

            // Store the metrics in Pinia
            const metrics = {
                distance: distanceKm,
                elapsedTime,
                elevation: ascendedElevation.toFixed(0),
                avgPower,
                totalWork,
            };

            const metricsStore = useMetricsStore();
            metricsStore.setMetrics(activityId, metrics);
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
        this.fetchActivity();
    },
};
</script>


<style scoped></style>