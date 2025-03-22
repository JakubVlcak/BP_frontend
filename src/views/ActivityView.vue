<template>
    <div>
        <TheHeader />

        <section class="flex flex-col items-center justify-center min-h-screen pt-10 px-4">
            <header>
                <h2 class="text-lg font-bold mb-4">Activity Details</h2>
            </header>
            <div v-if="records.length > 0" class="w-full max-w-5xl my-1">
                <h3 class="text-md font-semibold mb-2">Activity Route</h3>
                <MapChart :data="records" :latKey="'position_lat'" :longKey="'position_long'" />
            </div>

            <div v-if="activity" class="w-full max-w-full bg-white shadow rounded p-4">
                <p><strong>Activity ID:</strong> {{ activity.ActivityID }}</p>
                <p><strong>Time Created:</strong> {{ formatDate(activity.timeCreated) }}</p>

                <!-- Grid Layout for Metrics -->
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-6">
                    <div v-for="(value, key) in activityMetrics" :key="key" class="bg-gray-100 p-1 rounded shadow">
                        <p class="font-semibold">{{ key }}</p>
                        <p class="text-lg">{{ value }}</p>
                    </div>
                </div>

                <!-- Display Toggle Buttons -->
                <div class="mb-4 flex flex-wrap gap-2">
                    <button @click="toggleChart('altitude')"
                        class="px-4 py-2 bg-green-950 text-green-400 font-bold rounded border-green-400 border-2">Toggle
                        Altitude</button>
                    <button @click="toggleChart('speed')"
                        class="px-4 py-2 bg-blue-950 text-blue-400 font-bold rounded border-blue-400 border-2">Toggle
                        Speed</button>
                    <button @click="toggleChart('power')"
                        class="px-4 py-2 bg-purple-950 text-purple-400 font-bold rounded border-purple-400 border-2">Toggle
                        Power</button>
                    <button @click="toggleChart('heartRate')"
                        class="px-4 py-2 bg-red-950 text-red-400 font-bold rounded border-red-400 border-2">Toggle
                        Heart Rate</button>
                    <button @click="toggleChart('cadence')"
                        class="px-4 py-2 bg-orange-950 text-orange-400 font-bold rounded border-orange-400  border-2">Toggle
                        Cadence</button>
                    <button @click="toggleChart('temperature')"
                        class="px-4 py-2 bg-pink-950 text-pink-400 font-bold rounded border-pink-400 border-2">Toggle
                        Temperature</button>
                </div>

                <!-- Display Charts -->
                <div v-if="records && records.length > 0" class="relative h-96">
                    <div v-if="showAltitude">
                        <h3 class="text-md font-semibold mb-2">Altitude</h3>
                        <LineChart :data="records" :yKey="'altitude'" :lineColor="'green'" />
                    </div>
                    <div v-if="showSpeed">
                        <h3 class="text-md font-semibold mb-2">Speed</h3>
                        <LineChart :data="speedData" :yKey="'speed'" :lineColor="'blue'" />
                    </div>
                    <div v-if="showPower">
                        <h3 class="text-md font-semibold mb-2">Power</h3>
                        <LineChart :data="records" :yKey="'power'" :lineColor="'purple'" />
                    </div>
                    <div v-if="showHeartRate">
                        <h3 class="text-md font-semibold mb-2">Heart Rate</h3>
                        <LineChart :data="records" :yKey="'heartRate'" :lineColor="'red'" />
                    </div>
                    <div v-if="showCadence">
                        <h3 class="text-md font-semibold mb-2">Cadence Records</h3>
                        <LineChart :data="records" :yKey="'cadence'" :lineColor="'orange'" />
                    </div>
                    <div v-if="showTemperature">
                        <h3 class="text-md font-semibold mb-2">Temperature</h3>
                        <LineChart :data="records" :yKey="'temperature'" :lineColor="'pink'" />
                    </div>
                </div>
                <div v-else>
                    <p>No data available.</p>
                </div>
            </div>

            <div v-else-if="loading" class="text-center">
                <p><strong>Loading</strong></p><br>
                <div class="flex flex-row gap-2">
                    <div class="w-4 h-4 rounded-full bg-black animate-bounce [animation-delay:.7s]"></div>
                    <div class="w-4 h-4 rounded-full bg-black animate-bounce [animation-delay:.3s]"></div>
                    <div class="w-4 h-4 rounded-full bg-black animate-bounce [animation-delay:.7s]"></div>
                </div>
            </div>

            <div v-else-if="error" class="text-center text-red-500">
                <p>Error loading activity details: {{ error }}</p>
            </div>

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


export default {
    components: {
        TheHeader,
        LineChart,
        MapChart,
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
        activityMetrics() {
            return {
                'Distance': `${this.activity.distance} km`,
                'Elapsed Time': this.activity.elapsed_time,
                'Average Power': `${Math.round(this.activity.avg_power)} W`,
                'Total Work': `${this.activity.total_work_kJ} kJ`,
                'Best 5s Power': `${this.activity.best_5s_power} W`,
                'Best 15s Power': `${this.activity.best_15s_power} W`,
                'Best 1min Power': `${this.activity.best_1min_power} W`,
                'Best 5min Power': `${this.activity.best_5min_power} W`,
                'Best 20min Power': `${this.activity.best_20min_power} W`,
                'Cadence (Avg/Max)': `${this.activity.avg_cadence} / ${this.activity.max_cadence} rpm`,
                'Speed (Avg/Max)': `${this.activity.avg_speed} / ${this.activity.max_speed} km/h`,
                'Temperature': `${this.activity.avg_temperature} °C`,
                'Total Ascended Elevation': `${this.activity.ascended_elevation} m`,
                'Heart Rate (Avg/Max)': `${this.activity.avg_heartrate} / ${this.activity.max_heartrate} bpm`
            };
        },
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
                this.activity = response.data;
                this.records = response2.data;

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