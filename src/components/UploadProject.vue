<template>
    <span @click="upload()">
        <slot></slot>
    </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useCalculatorStore } from '../stores/calculator';
import { useGlobalStore } from '../stores/global';
import { Project } from '../types';

export default defineComponent({
    props: {
        project: {
            type: Object as PropType<Project>,
            required: true
        }
    },
    data() {
        return {
            calculatorStore: useCalculatorStore(),
            calculator: useCalculatorStore().calculator,
            globalStore: useGlobalStore(),
        };
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
    methods: {
        async upload() {
            if (this.project) {
                if (this.connected) {
                    await this.uploadProject(this.project);
                } else {
                    this.calculatorStore.notConnectedError = true;
                }
            } else {
                this.globalStore.error = true;
                // TODO: Handle this error. (wait ?)
                console.error("No project to upload");
            }
        },
        async uploadProject(project: Project) {
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

            try {
                await this.calculator.installStorage(storage, this.storageInstalled);
            } catch (error) {
                this.storageInstallError(error);
            }
        },
        storageInstalled() {
            this.calculatorStore.installationSuccess = true;
        },
        storageInstallError(error: any) {
            if (error.message === "Too much data!") {
                this.calculatorStore.tooMuchDataError = true;
            } else {
                this.globalStore.error = true;
            }
        },
    },
});
</script>

<style scoped></style>
