<template>
    <div id="viewer-page">
        <v-row>
            <v-col>
                <h1>{{ project?.title }}</h1>
                <v-btn :to="'/edit/' + project?.uuid">Edit</v-btn>
                <Markdown :content="project?.description" />
            </v-col>
            <v-col>
                <Simulator :scripts="project?.files" />
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Markdown from '../components/Markdown.vue';
import Simulator from '../components/Simulator.vue';
import { useAPIStore } from '../stores/api';
import { Project } from '../types';

export default defineComponent({
    name: 'Viewer',
    components: { Simulator, Markdown },
    data() {
        return {
            project: null as Project | null,
            api: useAPIStore().api,
        };
    },
    async mounted() {
        this.project = await this.api.getProject(this.$route.params.uuid);
    },
});
</script>

<style scoped></style>
