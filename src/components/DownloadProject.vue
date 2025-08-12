<template>
  <span @click="download()">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { Project } from '../types';
import { useGlobalStore } from '../stores/global';

const JSZip = import("jszip")

const globalStore = useGlobalStore();

const props = defineProps({
  project: {
    type: Object as () => Project,
    required: true,
  },
});


const download = async () => {
  if (props.project) {
    if (props.project.files.length != 1) {
      await downloadAsZip(props.project);
    } else {
      await downloadAsFile(props.project);
    }
    // No feedback on success as the browser already show the save file dialog/
    // download panel
  } else {
    globalStore.error = true;
    // TODO: Handle this error. (wait ?)
    console.error('No project to upload');
  }
};

const downloadAsZip = async (project: Project) => {
  let JSZip_awaited = await JSZip;
  var zip = new JSZip_awaited.default();

  for (let file of project.files) {
    zip.file(file.title, file.content);
  }
  const blob = await zip.generateAsync({ type: "blob" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = project.title + ".zip";
  link.click();
};

const downloadAsFile = async (project: Project) => {
  // const blob = await zip.generateAsync({ type: "blob" });
  console.assert(project.files.length == 1);
  const blob = new Blob([project.files[0].content], {
    type: "application/octet-stream",
  });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = project.files[0].title;
  link.click();
};
</script>

<style scoped></style>
