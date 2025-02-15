<template>
    <TheHeader />
    <div class="max-w-3xl mx-auto p-10 space-y-6">
        <FitFileUpload />
        <ListActivities />
    </div>


</template>

<script>
import TheHeader from "/src/components/TheHeader.vue";
import ListActivities from "/src/components/ListActivities.vue";
import FitFileUpload from '/src/components/FitFileUpload.vue';

export default {
    components: {
        TheHeader,
        ListActivities,
        FitFileUpload
    },
    data() {
        return {
            activities: [],
        };
    },
};
</script>
