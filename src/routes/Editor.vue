<template>
    <div id="editor-page" class="fill-height">
        <v-container fluid class="fill-height">
            <v-row class="mt-0 fill-height">
                <div class="bg-background elevation-3 rounded-lg ml-4 pa-1" style="width:300px">
                    <v-card>
                        <v-card-title>
                            <h3>{{ project.title }}</h3>
                        </v-card-title>
                        <v-card-item>
                            <v-chip variant="outlined" class="mx-1">Public</v-chip>
                            <v-chip class="mx-1">Games</v-chip>
                            <v-chip class="mx-1">Upsilon</v-chip>
                            <v-chip class="mx-1">Omega</v-chip>
                        </v-card-item>
                        <v-card-actions>
                            <v-btn>
                                Edit project info
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                    <Simulator />
                </div>
                <div style="display:flex; flex-direction:column;flex:1"
                    class="bg-background elevation-3 rounded-lg mx-4 pa-1">
                    <MonacoEditor :scripts="project.scripts" />
                </div>
            </v-row>
        </v-container>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import MonacoEditor from '../components/MonacoEditor.vue';
import Simulator from '../components/Simulator.vue';
export default defineComponent({
    name: 'EditorPage',
    components: { MonacoEditor, Simulator },
    data() {
        return {
            tab: null,
            project: {
                public: true,
                title: 'Bataille navale',

                scripts: [
                    { title: 'main.py', content: 'from math import *' },
                    { title: 'engine.py', content: 'from math import *' }
                ]
            }
        }
    }
});
</script>

