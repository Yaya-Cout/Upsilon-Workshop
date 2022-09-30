<template>
    <div id="editor-page">
        <v-container fluid>
            <v-row class="mt-1 mx-4">
                <v-col class="bg-background elevation-3 rounded-lg">
                    <v-card>
                        <v-card-title>
                            <div id="title-editor" contenteditable style="float:left">Bataille navale</div>
                            <v-chip style="float:right">Public</v-chip>
                        </v-card-title>
                        <v-card-item>
                            TODO: add compatibility selector
                        </v-card-item>
                        <v-card-actions>
                            <v-btn>
                                Make private
                            </v-btn>
                            <v-btn>
                                Delete
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                    <v-card class="mt-4">
                        <v-card-title>Project files</v-card-title>
                        <v-card-item>
                            <div class="src-display">main.py</div>
                            <div class="src-display">engine.py</div>
                        </v-card-item>
                    </v-card>
                </v-col>
                <v-col class="mx-4 v-col-8 bg-background elevation-3 rounded-lg">
                    <MonacoEditor />
                </v-col>
                <v-col class="bg-background elevation-3 rounded-lg">
                    Simulator
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import MonacoEditor from '../components/MonacoEditor.vue';
export default defineComponent({
    name: 'EditorPage',
    components: { MonacoEditor }
});
</script>

<style >

</style>