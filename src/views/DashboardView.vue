<template>
    <TheHeader />
    <div class="flex max-w-6xl mx-auto p-10 space-x-6">
        <!-- Main Content -->
        <div class="flex-1 space-y-6">
            <FitFileUpload />
            <ListActivities />
        </div>

        <!-- Sidebar -->
        <aside class="w-fit bg-white text-black p-4 rounded-lg shadow-lg self-start">
            <MyStats />
        </aside>
    </div>
</template>

<script>
import TheHeader from "/src/components/TheHeader.vue";
import ListActivities from "/src/components/ListActivities.vue";
import FitFileUpload from "/src/components/FitFileUpload.vue";
import MyStats from "@/components/MyStats.vue";

export default {
    components: {
        TheHeader,
        ListActivities,
        FitFileUpload,
        MyStats,
    },
};
</script>
