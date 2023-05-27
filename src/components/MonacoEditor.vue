<template>
  <div class="container">
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
      <v-btn
        icon
        @click="run"
      >
        <v-icon>mdi-reload</v-icon>
      </v-btn>
      <!-- TODO: Save button should be disabled when there are no changes -->
      <!-- TODO: Save button should call run before saving -->
      <SaveProject :project="project">
        <v-btn icon>
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
      </SaveProject>
      <!-- <v-btn
        icon
        @click="addScript"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn> -->
    </v-tabs>
    <div class="monaco-editor-wrapper">
      <div id="monaco-editor" />
    </div>
  </div>
</template>

<script lang="ts">
import * as monaco from 'monaco-editor';
import { defineComponent, PropType } from 'vue';
import { Script, Project } from '../types';
import SaveProject from './SaveProject.vue';

// Those variables are declared there instead of in data because otherwise it causes endless loops.
// TODO: Clear those variables when the component is destroyed
var editor: monaco.editor.IStandaloneCodeEditor | null = null;
var models: monaco.editor.ITextModel[] = [];
var states: monaco.editor.ICodeEditorViewState[] = [];

export default defineComponent({
  name: "MonacoEditor",
  components: { SaveProject },
  props: {
    project: {
      type: Object as PropType<Project>,
      required: true,
    },
  },
  emits: ["run"],
  data() {
    return {
      tab: 0,
      oldTab: 0,
    };
  },
  computed: {
    scripts: {
      get(): Script[] {
        return this.project.files ?? [];
      },
      set(value: Script[]) {
        // TODO: Avoid using mutation
        this.project.files = value;
      },
    }
  },
  watch: {
    scripts: {
      deep: true,
      handler() {
        // FIXME this will break with script renaming
        if (this.scripts.length != models.length) {
          // Delete and re create all models
          this.createModels();
        }
        else {
          // Update existing models
          for (const script of this.scripts) {
            for (var i = 0; i < models.length; i++) {
              if (models[i].uri.path.substring(1) === script.title) {
                models[i].setValue(script.content);
              }
            }
          }
        }
      },
    },
  },
  mounted() {
    const editorElement = document.getElementById("monaco-editor");
    if (editorElement === null)
      return;
    editor = monaco.editor.create(editorElement, {
      language: "python",
      automaticLayout: true,
    });
    editor.onDidChangeModelContent(this.contentChanged);
    this.createModels();
  },
  methods: {
    contentChanged() {
      for (const model of models) {
        for (var i = 0; i < this.scripts.length; i++) {
          if (this.scripts[i].title === model.uri.path.substring(1)) {
            this.project.files[i].content = model.getValue();
          }
        }
      }
    },
    createModels() {
      models = [];
      for (const script of this.scripts) {
        models.push(monaco.editor.createModel(script.content, "python", monaco.Uri.from({ scheme: "file", path: script.title })));
      }
      editor?.setModel(models[0]);
    },
    setTab(tab: any) {
      if (editor == null)
        throw Error();
      models[this.oldTab] = editor.getModel()!;
      states[this.oldTab] = editor.saveViewState()!;
      this.oldTab = tab;
      editor.setModel(models[tab]);
      editor.restoreViewState(states[tab]);
    },
    run() {
      this.$emit("run");
    },
  }
});
</script>

<style>
.monaco-editor-wrapper {
  /* height: 100%; */
  height: calc(100% - 48px);
}

.monaco-editor {
  width: 0 !important;
}

#monaco-editor {
  height: 100%;
}

.container {
  height: 100%;
  width: 100%;
}
</style>
