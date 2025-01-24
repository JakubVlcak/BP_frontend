<template>
    <TheHeader />
    <header>
        <h1>321321</h1>
        <p>{{ number }}</p>
        <button @click="addToNumber">add to number</button>


        <div v-if="activities.length > 0">
            <h2>Activities</h2>
            <ul>
                <li v-for="activity in activities" :key="activity.id">
                    Time Created: {{ activity.timeCreated }}
                </li>
            </ul>
        </div>
    </header>
</template>

<script>
import { useNumberStore } from "@/stores/counter";
import TheHeader from "/src/components/TheHeader.vue";
import axiosInstance from "@/services/AxiosInstance";

export default {
    components: {
        TheHeader,
    },
    data() {
        return {
            store: useNumberStore(),
            activities: [],
        };
    },
    computed: {
        number() {
            return this.store.number;
        },
    },
    methods: {
        addToNumber() {
            this.store.number -= 1;
        },


        async fetchActivities() {
            try {
                const response = await axiosInstance.get("http://localhost:8000/api/activities/");
                this.activities = response.data.results;
            } catch (error) {
                console.error("Error fetching activities:", error);
            }
        },
    },
    mounted() {

        this.fetchActivities();
    },
};
</script>
