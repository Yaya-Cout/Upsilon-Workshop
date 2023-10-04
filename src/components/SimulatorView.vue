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
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Project } from '../types';
import DefaultSimulatorView from './simulator/DefaultSimulatorView.vue';
import CASWorksSimulatorView from './simulator/CASWorksSimulatorView.vue';

const casworksSimulatorObject = ref<InstanceType<typeof CASWorksSimulatorView> | null>(null);
const defaultSimulatorObject = ref<InstanceType<typeof DefaultSimulatorView> | null>(null);

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

defineExpose({
  send
});
</script>

<style scoped></style>
