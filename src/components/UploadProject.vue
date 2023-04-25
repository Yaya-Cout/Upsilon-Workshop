<template>
    <span @click="upload()">
        <slot></slot>
    </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useCalculatorStore } from '../stores/calculator';
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
                // TODO: Handle this error. (wait ?)
                console.error("No project to upload");
            }
        },
        async uploadProject(project: Project) {
            // TODO: Make a component for this.
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
            // If the message is "Too much data!", it means that the calculator
            // has too much files. We should handle this error.
            if (error.message === "Too much data!") {
                this.calculatorStore.tooMuchDataError = true;
            }

            // TODO: Handle other errors with a generic error message.
        },
    },
});
</script>

<style scoped></style>
