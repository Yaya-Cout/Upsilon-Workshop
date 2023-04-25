<template>
  <v-tabs
    v-model="tab"
    @update:model-value="setTab"
  >
    <v-tab
      v-for="script in scripts"
      :key="script.title"
    >
      {{ script.title }}
    </v-tab>
    <v-btn @click="update">
      Update
    </v-btn>
  </v-tabs>
  <div class="monaco-editor-wrapper">
    <div id="monaco-editor" />
  </div>
</template>
<script lang="ts">
import * as monaco from 'monaco-editor';
import { defineComponent, PropType } from 'vue';
import { Script } from '../types';

// Those variables are declared there instead of in data because otherwise it causes endless loops.
var editor: monaco.editor.IStandaloneCodeEditor | null = null;
var models: monaco.editor.ITextModel[] = [];
var states: monaco.editor.ICodeEditorViewState[] = [];
export default defineComponent({
    name: 'MonacoEditor',
    props: {
        scripts: { type: Object as PropType<Script[]>, required: true },
    },
    data() {
        return {
            tab: 0,
            oldTab: 0,
        };
    },
    watch: {
        scripts: {
            deep: true,
            handler() {
                //FIXME this will break with script renaming
                if (this.scripts.length != models.length) {
                    // Delete and re create all models
                    this.createModels();
                } else {
                    // Update existing models
                    for (const script of this.scripts) {
                        for (var i = 0; i < models.length; i++) {
                            if (
                                models[i].uri.path.substring(1) === script.title
                            ) {
                                models[i].setValue(script.content);
                            }
                        }
                    }
                }
            },
        },
    },
    mounted() {
        const editorElement = document.getElementById('monaco-editor');
        if (editorElement === null) return;
        editor = monaco.editor.create(editorElement, {
            language: 'python',
            automaticLayout: true,
        });
        this.createModels();
    },
    methods: {
        createModels() {
            models = [];
            for (const script of this.scripts) {
                models.push(
                    monaco.editor.createModel(
                        script.content,
                        'python',
                        monaco.Uri.from({ scheme: 'file', path: script.title })
                    )
                );
            }
            editor?.setModel(models[0]);
        },
        setTab(tab: any) {
            if (editor == null) throw Error();

            models[this.oldTab] = editor.getModel()!;
            states[this.oldTab] = editor.saveViewState()!;

            this.oldTab = tab;

            editor.setModel(models[tab]);
            editor.restoreViewState(states[tab]);
        },
        update() {
            for (const model of models) {
                for (var i = 0; i < this.scripts.length; i++) {
                    if (this.scripts[i].title === model.uri.path.substring(1)) {
                        this.scripts[i].content = model.getValue();
                    }
                }
            }
        },
    },
});
</script>

<style>
.monaco-editor-wrapper {
    height: 100%;
}

.monaco-editor {
    width: 0 !important;
}

#monaco-editor {
    height: calc(100% - 1px);
}
</style>
