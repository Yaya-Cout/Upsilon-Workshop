<template>
  <span @click="upload()">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Project } from '../types';
import { useGlobalStore } from '../stores/global';
import { useCalculatorStore } from '../stores/calculator';

const globalStore = useGlobalStore();
const calculatorStore = useCalculatorStore();

const props = defineProps({
  project: {
    type: Object as () => Project,
    required: true,
  },
});

const connected = computed(() => {
  return calculatorStore.connected;
});

const upload = async () => {
  if (props.project) {
    if (connected.value) {
      await uploadProject(props.project);
    } else {
      calculatorStore.notConnectedError = true;
    }
  } else {
    globalStore.error = true;
    // TODO: Handle this error. (wait ?)
    console.error('No project to upload');
  }
};

const uploadProject = async (project: Project) => {
  let storage = await calculatorStore.calculator.backupStorage();

  for (let file of project.files) {
    let name = file.title.split('.').shift();
    let type = file.title.split('.').pop();
    // If the script already exists in the storage, we remove it.
    storage.records = storage.records.filter((record) => record.name !== name);
    // TODO: Show a popup to ask the user if he wants to overwrite the
    // existing script.
    storage.records.push({
      name: name,
      type: type,
      // TODO: Store it on the API and retrieve it here.
      // (Or mark the file which have the name of the project to
      // be autoImported)
      autoImport: true,
      code: file.content,
    });
  }

  try {
    await calculatorStore.calculator.installStorage(storage, storageInstalled);
  } catch (error) {
    storageInstallError(error);
  }
};

const storageInstalled = () => {
  globalStore.success = 'snackbar.success.installation-success.message';
};

const storageInstallError = (error: any) => {
  if (error.message === 'Too much data!') {
    calculatorStore.tooMuchDataError = true;
  } else {
    globalStore.error = true;
  }
};
</script>

<style scoped></style>
