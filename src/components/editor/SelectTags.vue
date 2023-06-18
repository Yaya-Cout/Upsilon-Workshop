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

<script lang="ts">
import { defineComponent } from 'vue';
import { useAPIStore } from '../../stores/api';

export default defineComponent({
  name: "SelectTags",
  props: {
    modelValue: {
      type: Array as () => string[],
      required: true,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      tagsList: [] as string[],
      loading: false,
      search: "",
      api: useAPIStore().api,
    };
  },
  computed: {
    tags: {
      get(): string[] {
        return this.modelValue
      },
      set(value: string[]) {
        this.$emit("update:modelValue", value);
      },
    },
  },
  watch: {
    search() {
      this.searchTags();
    },
  },
  mounted() {
    this.searchTags();
  },
  methods: {
    async searchTags() {
      this.loading = true;
      try {
        let tags = await this.api.getTags(this.search);
        let tagsList = [] as string[];
        for (let tag of tags) {
          tagsList.push(tag.name);
        }
        this.tagsList = tagsList;
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>

<style scoped></style>
