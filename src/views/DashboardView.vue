<template>
    <TheHeader />
    <ListActivities />

</template>

<script>
import TheHeader from "/src/components/TheHeader.vue";
import ListActivities from "/src/components/ListActivities.vue";

export default {
    components: {
        TheHeader,
        ListActivities,
    },
    data() {
        return {
            activities: [],
        };
    },
};
</script>
