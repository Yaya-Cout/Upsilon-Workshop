<template>
  <div class="container">
    <v-tabs
      id="monaco-editor-tabs"
      v-model="tab"
      @update:model-value="setTab"
    >
      <v-tab
        v-for="(script, scriptIndex) in project.files"
        :key="script.title"
      >
        <ChangeScript
          v-if="scriptIndex === tab"
          :project="project"
          :script-index="scriptIndex"
        >
          <template #default>
            {{ script.title }}
            <v-tooltip
              activator="parent"
              location="bottom"
            >
              {{ $t('editor.monaco-editor.change-tooltip') }}
            </v-tooltip>
          </template>
        </ChangeScript>
        <div v-else>
          {{ script.title }}
        </div>
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
          {{ $t('editor.monaco-editor.run-tooltip') }}
        </v-tooltip>
      </v-btn>
      <!-- TODO: Save button should be disabled when there are no changes -->
      <!-- TODO: Save button should call run before saving -->
      <SaveProject
        v-if="hasWriteAccess"
        :project="project"
      >
        <v-btn icon>
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
        <v-tooltip
          activator="parent"
          location="bottom"
        >
          {{ $t('editor.monaco-editor.save-tooltip') }}
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
          {{ $t('editor.monaco-editor.add-script-tooltip') }}
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
import { useGlobalStore } from '../stores/global';
import { useAPIStore } from '../stores/api';
import { Script, Project } from '../types';
import SaveProject from './SaveProject.vue';
import ChangeScript from './ChangeScript.vue';
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
    ChangeScript,
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
      scriptToRename: null as Script | null,
      globalStore: useGlobalStore(),
      api: useAPIStore().api,
    };
  },
  computed: {
    scripts: {
      get(): Script[] {
        return this.project.files;
      },
      set(value: Script[]) {
        // TODO: Avoid using mutation
        this.project.files = value;
      },
    },
    hasWriteAccess(): boolean {
      // Get if the user is the owner of the project
      console.log(this.project.author, this.api.USERNAME);
      if (this.project.author === this.api.USERNAME) {
        return true;
      }
      // Get if the user is a collaborator of the project
      // TODO: Check if the user is a collaborator
      return false;
    },
  },
  watch: {
    "project.files": {
      deep: true,
      handler() {
        this.createModels();
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
          if (this.project.uuid + this.scripts[i].title === model.uri.path.substring(1)) {
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
          if (model.uri.path.substring(1) === this.project.uuid + script.title) {
            // If it exists, check if it needs to be updated
            if (model.getValue() === script.content) {
              exists = true;
              break;
            }
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
        models.push(monaco.editor.createModel(script.content, "python", monaco.Uri.from({ scheme: "file", path: this.project.uuid + script.title })));
      }
      this.setTab(this.tab);
    },
    setTab(tab: any) {
      // If there is no script, don't do anything
      if (this.scripts.length === 0) {
        return;
      }
      // If the tab is out of bounds, set it to the first tab
      if (tab >= this.scripts.length) {
        tab = 0;
      }
      // If oldTab is out of bounds, set it to the first tab
      if (this.oldTab >= this.scripts.length) {
        this.oldTab = 0;
      }
      if (editor == null)
        throw Error();
      // Iterate over all models and get the one that corresponds to the tab
      let id = -1;
      for (const model of models) {
        if (model.uri.path.substring(1) === this.project.uuid + this.scripts[tab].title) {
          id = models.indexOf(model);
          break;
        }
      }
      if (id === -1) {
        throw Error("Couldn't find model for tab " + tab);
      }
      // Do the same for the old tab
      let oldId = -1;
      for (const model of models) {
        if (model.uri.path.substring(1) === this.project.uuid + this.scripts[this.oldTab].title) {
          oldId = models.indexOf(model);
          break;
        }
      }
      if (oldId === -1) {
        throw Error("Couldn't find model for old tab " + this.oldTab);
      }
      states[oldId] = editor.saveViewState();
      this.oldTab = tab;
      editor.setModel(models[id]);
      editor.restoreViewState(states[id]);
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

#monaco-editor-tabs {
  /* TODO : Avoid hardcoding */
  max-width: calc(100vw - 364px);
}
</style>
