<template>
  <CASWorksSimulatorView
    v-if="project.runner === 'parisse-with-xcas'"
    ref="casworksSimulatorObject"
    :scripts="project.files"
  />
  <DefaultSimulatorView
    v-else
    ref="defaultSimulatorObject"
    :scripts="project.files"
    @new-files="newFiles"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Project, Script } from '../types';
import DefaultSimulatorView from './simulator/DefaultSimulatorView.vue';
import CASWorksSimulatorView from './simulator/CASWorksSimulatorView.vue';

const casworksSimulatorObject = ref<InstanceType<typeof CASWorksSimulatorView> | null>(null);
const defaultSimulatorObject = ref<InstanceType<typeof DefaultSimulatorView> | null>(null);

const emits = defineEmits(['new-files']);

const props = defineProps({
  project: {
    type: Object as () => Project,
    required: true
  }
});

const send = () => {
  if (props.project.runner === 'parisse-with-xcas') {
    if (casworksSimulatorObject.value) {
      casworksSimulatorObject.value.send();
    } else {
      console.error('Simulator object is null');
    }
  } else {
    if (defaultSimulatorObject.value) {
      defaultSimulatorObject.value.send();
    } else {
      console.error('Simulator object is null');
    }
  }
}

const newFiles = (files: { modified_files: Script[], added_files: Script[]}) => {
  emits('new-files', files);
}

defineExpose({
  send
});
</script>

<style scoped></style>
