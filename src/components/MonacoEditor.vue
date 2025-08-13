<template>
  <div class="container">
    <span class="tabs-container">
      <v-tabs
        v-model="tab"
        center-active
        show-arrows
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
      </v-tabs>
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
        @modified="emits('modified', false)"
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
    </span>
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
const firstCreateModels = ref(true);

const globalStore = useGlobalStore();
const apiStore = useAPIStore();

const props = defineProps({
  project: {
    type: Object as () => Project,
    required: true,
  },
});

const emits = defineEmits(['run', 'update-project', 'modified']);

const scripts = computed({
  get(): Script[] {
    return props.project.files;
  },
  set(value: Script[]) {
    // TODO: Use v-model for updating project
    // FIXME: This code is never executed as all writes are done indirectly,
    // through pointers
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
  if (firstCreateModels.value) {
    firstCreateModels.value = false;
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
        emits('modified', true);
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
    let createdModel = monaco.editor.createModel(script.content, "python", monaco.Uri.from({ scheme: "file", path: props.project.uuid + script.title }))
    createdModel.updateOptions({ tabSize: 2 });
    models.push(createdModel);
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

const addScript = (name: string, content: string) => {
  // IDK why this code cause scripts.value to be "undefined", but it does, so we
  // use a for loop instead. The for loop also allows preserving file order
  // scripts.value = scripts.value.filter((file) => file.title !== name);
  let index = 0;
  for (let file of scripts.value) {
    if (file.title == name) {
      file.content = content;
      break;
    }
    index++;
  }
  if (index == scripts.value.length) {
    // Create the file if it wasn't found
    scripts.value.push({
      title: name,
      content: content,
    });
    index = scripts.value.length - 1;
  }

  createModels();
  tab.value = index;
};
</script>

<style scoped>
.monaco-editor-wrapper {
  height: calc(100% - 48px);
}

#monaco-editor {
  height: 100%;
}

.container {
  height: 100%;
  /* TODO: Avoid hardcoding */
  width: max(100vw - 544px, 100vw - 33vw - 64px);
}

.tabs-container {
  display: flex;
}
</style>
