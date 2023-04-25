<template>
    <!-- We use a div to avoid the v-card being a direct child of the v-row and
        being affected by other v-cards in the same row -->
    <div>
        <v-card class="ma-2 rounded-lg" elevation="4" :to="'/view/' + project.uuid">
            <div class="flex justify-between">
                <!-- <v-img
                class="rounded-lg"
                elevation="4"
                :aspect-ratio="320 / 240"
                width="260"
                src="/assets/screenshot.png"
                style="z-index: -1"
            /> -->
                <div class="elevation-10">
                    <v-card-title class="pb-0">{{ project.title }}</v-card-title>
                    <v-card-text class="py-0">{{ project.author }}</v-card-text>
                    <v-card-subtitle>{{ project.description }}</v-card-subtitle>
                    <v-card-actions>
                        <v-rating length="5" v-model="project.rating"></v-rating>
                    </v-card-actions>
                </div>
            </div>
        </v-card>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Project } from '../types';

export default defineComponent({
    name: 'ProjectPreview',
    props: {
        project: {
            type: Object as PropType<Project>,
            required: true
        }
    },
});
</script>

<style scoped></style>
