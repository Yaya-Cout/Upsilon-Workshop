<template>
    <v-tabs v-model="tab" @update:model-value="setTab">
        <v-tab v-for="script in scripts" :key="script.title">
            {{ script.title }}
        </v-tab>
    </v-tabs>
    <div class="monaco-editor-wrapper">
        <div id="monaco-editor"></div>
    </div>
</template>
<script lang="ts">
import * as monaco from 'monaco-editor';
import { defineComponent, PropType } from 'vue';
type Script = {
    title: string,
    content: string,
}
// Those variables are declared there instead of in data because otherwise it causes endless loops.
var editor: monaco.editor.IStandaloneCodeEditor | null = null;
var models: monaco.editor.ITextModel[] = [];
var states: monaco.editor.ICodeEditorViewState[] = [];
export default defineComponent({
    name: 'MonacoEditor',
    props: {
        scripts: { type: Object as PropType<Script[]>, required: true }
    },
    data() {
        return {
            tab: 0,
            oldTab: 0
        }
    },
    mounted() {
        const editorElement = document.getElementById('monaco-editor')
        if (editorElement === null) return
        editor = monaco.editor.create(editorElement, {
            value: 'ahah',
            language: 'python',
            automaticLayout: true
        });
        for (const script of this.scripts) {
            models.push(monaco.editor.createModel(script.content, 'python'))
        }
        editor.setModel(models[0])
    },
    methods: {
        setTab(tab: any) {
            if (editor == null) throw Error()

            models[this.oldTab] = editor.getModel()!
            states[this.oldTab] = editor.saveViewState()!

            this.oldTab = tab

            editor.setModel(models[tab])
            editor.restoreViewState(states[tab])
        }
    }
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