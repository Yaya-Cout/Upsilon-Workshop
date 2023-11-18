<template>
  <div @click="upload">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const JSZip = import("jszip")

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits(["update:modelValue", "write"]);

const storage = computed({
  get() {
    return props.modelValue;
  },
  set(value: Object) {
    emits("update:modelValue", value);
  },
});

const upload = () => {
  const input = document.createElement("input");
  input.type = "file";
  // input.accept = ".py,.zip";
  input.onchange = (e) => {
    if (!e.target || !("files" in e.target)) {
      throw new Error("Files is not returned by the input")
    }
    for (const file of e.target.files) {
      // console.log(file.name);
      // If file name ends with .zip, unzip it
      if (file.name.endsWith(".zip")) {
        uploadZip(file);
      } else {
        uploadFile(file);
      }
    }
  };
  input.click();
};

const uploadFile = async (file: Blob) => {
  const reader = new FileReader();
  reader.readAsText(file);
  reader.addEventListener("load", async () => {
    let code = reader.result;
    const name = file.name.replace(/\.[^/.]+$/, "");
    const type = file.name.split(".").pop();
    const fullName = file.name
    // If the script already exists in the storage, we remove it.
    storage.value.records = storage.value.records.filter((record) => record.fullName !== fullName);
    storage.value.records.push({ name, type, code, fullName });
    emits("write");
  });
}
const uploadZip = async (file: Blob) => {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.addEventListener("load", async () => {
    // Await JSZip to avoid eslint warning
    let JSZip_awaited = await JSZip;
    if (reader.result === null) {
      throw new Error("FileReader returned null")
    }
    const zip = await JSZip_awaited.loadAsync(reader.result);
    for (const [name, file] of Object.entries(zip.files)) {
      const code = await file.async("string");
      const type = name.split(".").pop();
      const nameWithoutExtension = name.replace(/\.[^/.]+$/, "");
      const fullName = file.name
      // If the script already exists in the storage, we remove it.
      storage.value.records = storage.value.records.filter((record) => record.fullName !== fullName);
      storage.value.records.push({ name: nameWithoutExtension, type, code, fullName });
    }
    emits("write");
  });
}
</script>

<style scoped></style>
