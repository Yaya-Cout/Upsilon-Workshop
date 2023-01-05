<template>
    <div id="viewer-page">
        <h1>{{ project?.title }}</h1>
        <Simulator />
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import Simulator from '../components/Simulator.vue';
import getProjects from '../data';
import { Project } from '../types';

export default defineComponent({
    name: 'Viewer',
    components: { Simulator },
    data() {
        return {
            project: null as Project | null,
        };
    },
    mounted() {
        getProjects().then(
            (projects: Project[]) =>
                (this.project = projects.filter(
                    (project) => project.uuid === this.$route.params.uuid
                )[0])
        );
    },
});
</script>

<style scoped></style>
