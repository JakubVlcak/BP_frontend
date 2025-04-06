<template>
    <div>
        <p
            class="flex items-center justify-between mb-2 bg-black text-white px-4 py-2 rounded-md text-lg font-semibold">
            All-time Stats</p>
        <table class="w-full border-collapse border-white-500 bg-gray-50 text-gray-800 font-semibold rounded-lg">
            <tbody>
                <tr class="border-b border-black">
                    <td class="p-2 font-semibold">Total Activities:</td>
                    <td class="p-2">{{ stats.total_activities }}</td>
                </tr>
                <tr class="border-b border-black">
                    <td class="p-2 font-semibold">Total Distance:</td>
                    <td class="p-2">{{ stats.total_distance }} km</td>
                </tr>
                <tr class="border-b border-black">
                    <td class="p-2 font-semibold">Total Elevation Gain:</td>
                    <td class="p-2">{{ stats.total_elevation_gain }} m</td>
                </tr>
                <tr>
                    <td class="p-2 font-semibold">Total Work:</td>
                    <td class="p-2">{{ stats.total_work_kJ }} kJ</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div>
        <p
            class="flex items-center justify-between mb-2 bg-black text-white px-4 py-2 rounded-md text-lg font-semibold">
            Best Efforts</p>
        <table class="w-full border-collapse border-white-500 bg-gray-50 text-gray-800 font-semibold rounded-lg">
            <tbody>
                <tr class="border-b border-black">
                    <td class="p-2 font-semibold">Longest ride:</td>
                    <td class="p-2">{{ stats.longest_ride }} km</td>
                </tr>
                <tr class="border-b border-black">
                    <td class="p-2 font-semibold">Biggest elevation gain: </td>
                    <td class="p-2">{{ stats.biggest_climb_elevation_gain }} m</td>
                </tr>
                <tr class="border-b border-black">
                    <td class="p-2 font-semibold">Best 5s power output:</td>
                    <td class="p-2">{{ stats.best_5s_power }} w</td>
                </tr>
                <tr class="border-b border-black">
                    <td class="p-2 font-semibold">Best 15s power output:</td>
                    <td class="p-2">{{ stats.best_15s_power }} w</td>
                </tr>
                <tr class="border-b border-black">
                    <td class="p-2 font-semibold">Best 1min power output:</td>
                    <td class="p-2">{{ stats.best_1min_power }} w</td>
                </tr>
                <tr class="border-b border-black">
                    <td class="p-2 font-semibold">Best 2min power output:</td>
                    <td class="p-2">{{ stats.best_2min_power }} w</td>
                </tr>
                <tr class="border-b border-black">
                    <td class="p-2 font-semibold">Best 5min power output:</td>
                    <td class="p-2">{{ stats.best_5min_power }} w</td>
                </tr>
                <tr class="border-b border-black">
                    <td class="p-2 font-semibold">Best 10min power output:</td>
                    <td class="p-2">{{ stats.best_10min_power }} w</td>
                </tr>
                <tr class="border-b border-black">
                    <td class="p-2 font-semibold">Best 20min power output:</td>
                    <td class="p-2">{{ stats.best_20min_power }} w</td>
                </tr>
                <tr class="border-b border-black">
                    <td class="p-2 font-semibold">Best 30min power output:</td>
                    <td class="p-2">{{ stats.best_30min_power }} w</td>
                </tr>
                <tr class="border-b border-black">
                    <td class="p-2 font-semibold">Best 1h power output:</td>
                    <td class="p-2">{{ stats.best_1h_power }} w</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axiosInstance from "@/services/axiosInstance";
import { API_URL } from "@/const";
export default {
    data() {
        return {
            stats: JSON.parse(localStorage.getItem("stats")) || {},
        };
    },
    async mounted() {
        await this.fetchStats();
    },
    methods: {
        async fetchStats() {
            try {
                const response = await axiosInstance.get(`${API_URL}/api/stats/`);
                const newStats = response.data;
                if (JSON.stringify(newStats) !== JSON.stringify(this.stats)) {
                    this.stats = newStats;
                    localStorage.setItem("stats", JSON.stringify(newStats));
                }
            } catch (error) {
                console.error("Error fetching activities:", error);
            }
        }
    }
};
</script>
