<template>
    <v-snackbar v-model="globalStore.error">
        <span>
            {{ $t('snackbar.generic-error.message') }}
        </span>
        <template v-slot:actions>
            <v-btn color="pink" variant="text" @click="globalStore.error = false">
                {{ $t('snackbar.close') }}
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useGlobalStore } from '../../stores/global';

export default defineComponent({
    data() {
        return {
            globalStore: useGlobalStore(),
        };
    }
});
</script>

<style scoped></style>
