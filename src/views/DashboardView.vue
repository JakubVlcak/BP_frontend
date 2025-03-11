<template>
    <TheHeader />
    <div class="max-w-3xl mx-auto p-10 space-y-6">
        <FitFileUpload />
        <ListActivities />

    </div>
    <MyStats />

</template>

<script>
import TheHeader from "/src/components/TheHeader.vue";
import ListActivities from "/src/components/ListActivities.vue";
import FitFileUpload from '/src/components/FitFileUpload.vue';
import MyStats from "@/components/MyStats.vue";
export default {
    components: {
        TheHeader,
        ListActivities,
        FitFileUpload,
        MyStats,
    },
    data() {
        return {
            activities: [],
        };
    },
};
</script>

<style></style>