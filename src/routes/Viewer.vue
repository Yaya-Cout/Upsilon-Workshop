<template>
    <div id="viewer-page">
        <v-progress-linear
            :active="loading"
            :indeterminate="loading"
            bottom
            color="deep-purple-accent-4"
        ></v-progress-linear>
        <v-row>
            <v-col>
                <h1>{{ project?.title }}</h1>
                <v-btn :to="'/edit/' + project?.uuid">Edit</v-btn>
                <v-btn @click="upload()">Upload to calculator</v-btn>
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
import { useCalculatorStore } from '../stores/calculator';
import { Project, Script } from '../types';

export default defineComponent({
    name: 'Viewer',
    components: { Simulator, Markdown },
    data() {
        return {
            project: null as Project | null,
            api: useAPIStore().api,
            calculatorStore: useCalculatorStore(),
            calculator: useCalculatorStore().calculator,
            loading: true,
        };
    },
    async mounted() {
        this.project = await this.api.getProject(this.$route.params.uuid);
        this.loading = false;
    },
    methods: {
        async upload() {
            if (this.project) {
                if (this.connected) {
                    await this.uploadProject(this.project);
                } else {
                    this.calculatorStore.notConnectedError = true;
                }
            } else {
                // TODO: Handle this error. (wait ?)
                console.error("No project to upload");
            }
        },
        async uploadProject(project: Project) {
            // TODO: Male a component for this.
            let storage = await this.calculator.backupStorage();

            for (let file of project.files) {
                let name = file.title.split('.').shift();
                let type = file.title.split('.').pop();
                storage.records.push({
                    name: name,
                    type: type,
                    // TODO: Store it on the API and retrieve it here.
                    // (Or mark the file which have the name of the project to
                    // be autoImported)
                    autoImport: true,
                    code: file.content,
                });
            }

            // TODO: Handle errors like too much files.
            await this.calculator.installStorage(storage, this.storageInstalled, this.storageInstallError);
        },
        storageInstalled() {
            console.log("Storage installed");
        },
        storageInstallError(error: any) {
            console.error("Storage install error: " + error);
        },
    },
    computed: {
        connected: {
            get() {
                return this.calculatorStore.connected;
            },
            set(value: boolean) {
                this.calculatorStore.connected = value;
            },
        },
    },
});
</script>

<style scoped></style>
