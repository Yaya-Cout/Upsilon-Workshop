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
          @rename="filename => rename(scriptIndex, filename)"
          @delete="deleteScript(scriptIndex)"
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
      <AddScript
        :project="project"
        @add="addScript"
      >
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
// Those variables are declared there instead of in data because otherwise it causes endless loops.
// TODO: Clear those variables when the component is destroyed
var editor: monaco.editor.IStandaloneCodeEditor | null = null;
var models: monaco.editor.ITextModel[] = [];
var states: monaco.editor.ICodeEditorViewState[] = [];
</script>

<script setup lang="ts">
import { ref, watchEffect, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import * as monaco from 'monaco-editor';
import { useGlobalStore } from '../stores/global';
import { useAPIStore } from '../stores/api';
import { Script, Project } from '../types';
import SaveProject from './SaveProject.vue';
import ChangeScript from './ChangeScript.vue';
import AddScript from './AddScript.vue';
const { t: $t } = useI18n();

const tab = ref(0);
const oldTab = ref(0);
const fistCreateModels = ref(true);

const globalStore = useGlobalStore();
const apiStore = useAPIStore();

const props = defineProps({
  project: {
    type: Object as () => Project,
    required: true,
  },
});

const emits = defineEmits(['run', 'update-project']);

const scripts = computed({
  get(): Script[] {
    return props.project.files;
  },
  set(value: Script[]) {
    // TODO: Use v-model for updating project
    emits('update-project', value);
  },
});

const hasWriteAccess = computed(() => {
  // Get if the user is the owner of the project
  if (props.project.author === apiStore.username && apiStore.username !== '') {
    return true;
  }
  // Get if the user is a collaborator of the project
  for (const collaborator of props.project.collaborators) {
    if (collaborator === apiStore.username) {
      return true;
    }
  }
  return false;
});

// Dirty hack to watch for changes in scripts (not working with traditional watch)
watchEffect(() => {
  for (const script of scripts.value) {
    // Required to force WatchEffect to update
  }
  if (fistCreateModels.value) {
    fistCreateModels.value = false;
    return;
  }
  createModels();
});

onMounted(() => {
  const editorElement = document.getElementById("monaco-editor");
  if (editorElement === null)
    return;
  editor = monaco.editor.create(editorElement, {
    language: "python",
    automaticLayout: true,
  });
  editor.onDidChangeModelContent(contentChanged);
  createModels();
});

const contentChanged = () => {
  for (const model of models) {
    for (var i = 0; i < scripts.value.length; i++) {
      if (props.project.uuid + scripts.value[i].title === model.uri.path.substring(1)) {
        scripts.value[i].content = model.getValue();
      }
    }
  }
};

const createModels = () => {
  for (const script of scripts.value) {
    // Get if model already exists
    let exists = false;
    for (const model of models) {
      if (model.uri.path.substring(1) === props.project.uuid + script.title) {
        // If it exists, check if it needs to be updated
        if (model.getValue() === script.content) {
          exists = true;
          break;
        }
        model.setValue(script.content);
        exists = true;
        break;
      }
    }
    if (exists) {
      continue;
    }
    // If it doesn't exist, create it
    models.push(monaco.editor.createModel(script.content, "python", monaco.Uri.from({ scheme: "file", path: props.project.uuid + script.title })));
  }
  setTab(tab.value);
};

const setTab = (newTab: number) => {
  // If there is no script, don't do anything
  if (scripts.value.length === 0) {
    return;
  }
  // If the tab is out of bounds, set it to the first tab
  if (newTab >= scripts.value.length) {
    newTab = 0;
    tab.value = 0;
  }
  // If oldTab is out of bounds, set it to the first tab
  if (oldTab.value >= scripts.value.length) {
    oldTab.value = 0;
  }
  if (editor == null)
    throw Error();
  // Iterate over all models and get the one that corresponds to the tab
  let id = -1;
  for (const model of models) {
    if (model.uri.path.substring(1) === props.project.uuid + scripts.value[newTab].title) {
      id = models.indexOf(model);
      break;
    }
  }
  if (id === -1) {
    throw Error("Couldn't find model for tab " + newTab);
  }
  // Do the same for the old tab
  let oldId = -1;
  for (const model of models) {
    if (model.uri.path.substring(1) === props.project.uuid + scripts.value[oldTab.value].title) {
      oldId = models.indexOf(model);
      break;
    }
  }
  if (oldId === -1) {
    throw Error("Couldn't find model for old tab " + oldTab.value);
  }
  states[oldId] = editor.saveViewState();
  oldTab.value = newTab;
  editor.setModel(models[id]);
  editor.restoreViewState(states[id]);
};

const run = () => {
  emits("run");
};

const rename = (scriptId: number, newTitle: string) => {
  scripts.value[scriptId].title = newTitle;
};

const deleteScript = (scriptId: number) => {
  scripts.value.splice(scriptId, 1);
  globalStore.success = "snackbar.success.script-deleted.message";
};

const addScript = (name: string) => {
  scripts.value.push({
    title: name,
    content: "",
  });
  setTab(scripts.value.length - 1);
};
</script>

<style scoped>
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
