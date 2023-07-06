<template>
  <v-autocomplete
    v-model="tags"
    v-model:search="search"
    :items="tagsList"
    :loading="loading"
    chips
    closable-chips
    label="Tags"
    multiple
  />
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useAPIStore } from '../../stores/api';

const props = defineProps({
  modelValue: {
    type: Array as () => string[],
    required: true,
  },
});

const api = useAPIStore().api;

const tagsList = ref([] as string[]);
const loading = ref(false);
const search = ref("");

const emits = defineEmits(["update:modelValue"]);

const tags = computed({
  get() {
    return props.modelValue;
  },
  set(value: string[]) {
    emits("update:modelValue", value);
  },
});

const searchTags = async () => {
  loading.value = true;
  try {
    let tags = await api.getTags(search.value);
    let NewTagsList = [] as string[];
    for (let tag of tags) {
      NewTagsList.push(tag.name);
    }
    tagsList.value = NewTagsList;

  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

watch(search, () => {
  searchTags();
}, { immediate: true });
</script>

<style scoped></style>
