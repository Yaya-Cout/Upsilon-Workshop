<template>
  <v-progress-linear
    :active="active"
    :indeterminate="indeterminate"
    :model-value="progress"
    bottom
    absolute
    color="deep-purple-accent-4"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useGlobalStore } from '../stores/global';

export default defineComponent({
    data() {
        return {
            globalStore: useGlobalStore(),
        };
    },
    computed: {
        progress() : number {
            if (this.globalStore.progress === true || this.globalStore.progress === false) {
                return 0;
            }
            return this.globalStore.progress;
        },
        indeterminate() : boolean {
            return this.globalStore.progress === true;
        },
        active() : boolean {
            return this.globalStore.progress !== false;
        },
    },
});
</script>

<style scoped></style>
