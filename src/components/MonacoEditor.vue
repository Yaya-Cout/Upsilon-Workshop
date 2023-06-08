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
        <RenameScript :script="script">
          <template #default>
            {{ script.title }}
            <v-tooltip
              activator="parent"
              location="bottom"
            >
              Click to rename
            </v-tooltip>
          </template>
        </RenameScript>
      </v-tab>
      <v-btn
        icon
        @click="run"
      >
        <v-icon>mdi-play</v-icon>
        <v-tooltip
          activator="parent"
          location="bottom"
        >
          Run project
        </v-tooltip>
      </v-btn>
      <!-- TODO: Save button should be disabled when there are no changes -->
      <!-- TODO: Save button should call run before saving -->
      <SaveProject :project="project">
        <v-btn icon>
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
        <v-tooltip
          activator="parent"
          location="bottom"
        >
          Save project
        </v-tooltip>
      </SaveProject>
      <AddScript :project="project">
        <v-btn icon>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-tooltip
          activator="parent"
          location="bottom"
        >
          Add script
        </v-tooltip>
      </AddScript>
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
import RenameScript from './RenameScript.vue';
import AddScript from './AddScript.vue';

// Those variables are declared there instead of in data because otherwise it causes endless loops.
// TODO: Clear those variables when the component is destroyed
var editor: monaco.editor.IStandaloneCodeEditor | null = null;
var models: monaco.editor.ITextModel[] = [];
var states: monaco.editor.ICodeEditorViewState[] = [];

export default defineComponent({
  name: "MonacoEditor",
  components: {
    SaveProject,
    RenameScript,
    AddScript,
  },
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
      skipScriptUpdate: false,
      scriptToRename: null as Script | null,
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
        if (this.skipScriptUpdate) {
          this.skipScriptUpdate = false;
          return;
        }
        // FIXME this will break with script renaming
        if (this.scripts.length != models.length) {
          // Update models
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
            this.skipScriptUpdate = true;
            this.project.files[i].content = model.getValue();
          }
        }
      }
    },
    createModels() {
      for (const script of this.scripts) {
        // Get if model already exists
        let exists = false;
        for (const model of models) {
          if (model.uri.path.substring(1) === script.title) {
            // If it exists, update it
            console.log("Updating model " + script.title);
            model.setValue(script.content);
            exists = true;
            break;
          }
        }
        if (exists) {
          continue;
        }
        console.log("Creating model " + script.title);
        // If it doesn't exist, create it
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
    renameScript(script: Script) {
      this.scriptToRename = script;
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
