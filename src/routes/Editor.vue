<template>
    <div id="editor-page" class="fill-height">
        <v-container fluid class="fill-height">
            <v-row class="mt-0 fill-height">
                <div
                    class="bg-background elevation-3 rounded-lg ml-4 pa-1"
                    style="width: 300px"
                >
                    <v-card>
                        <v-card-title>
                            <h3>{{ project?.title }}</h3>
                        </v-card-title>
                        <v-card-item>
                            <v-chip variant="outlined" class="mx-1"
                                >Public</v-chip
                            >
                            <v-chip class="mx-1">Games</v-chip>
                            <v-chip class="mx-1">Upsilon</v-chip>
                            <v-chip class="mx-1">Omega</v-chip>
                        </v-card-item>
                        <v-card-actions>
                            <v-btn> Edit project info </v-btn>
                        </v-card-actions>
                    </v-card>
                    <Simulator :scripts="project?.files" />
                </div>
                <div
                    style="display: flex; flex-direction: column; flex: 1"
                    class="bg-background elevation-3 rounded-lg mx-4 pa-1"
                >
                    <MonacoEditor :scripts="project?.files ?? []" />
                </div>
            </v-row>
        </v-container>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import MonacoEditor from '../components/MonacoEditor.vue';
import Simulator from '../components/Simulator.vue';
import getProjects from '../data';
import { Project } from '../types';
export default defineComponent({
    name: 'EditorPage',
    components: { MonacoEditor, Simulator },
    methods: {
        launch() {},
    },
    data() {
        return {
            tab: null,
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
