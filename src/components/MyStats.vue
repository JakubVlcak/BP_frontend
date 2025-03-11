<template>
    <p>mystats: </p>
</template>

<script>
import axiosInstance from "@/services/axiosInstance";

export default {
    data() {
        return {
            stats: [],
            name: "MyStats",
        };
    },
    async fetchStats() {
        try {
            const response = await axiosInstance.get(
                `http://localhost:8000/api/stats/`
            );

            this.stats = response.data.results;
        } catch (error) {
            console.error("Error fetching activities:", error);
        }
    },
}
</script>

<style></style>