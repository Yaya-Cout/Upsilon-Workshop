<template>
    <div id="viewer-page">
        <v-progress-linear :active="loading" :indeterminate="loading" bottom
            color="deep-purple-accent-4"></v-progress-linear>
        <v-row>
            <v-col>
                <h1>{{ project?.title }}</h1>
                <v-btn :to="'/edit/' + project?.uuid">Edit</v-btn>
                <UploadProject :project="project">
                    <v-btn>Upload to calculator</v-btn>
                </UploadProject>
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
import UploadProject from '../components/UploadProject.vue';

export default defineComponent({
    name: 'Viewer',
    components: {
        Simulator,
        Markdown,
        UploadProject,
    },
    data() {
        return {
            project: null as Project | null,
            api: useAPIStore().api,
            loading: true,
        };
    },
    async mounted() {
        this.project = await this.api.getProject(this.$route.params.uuid);
        this.loading = false;
    },
});
</script>

<style scoped></style>
