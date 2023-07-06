<template>
  <v-autocomplete
    v-model="collaborators"
    v-model:search="search"
    :items="people"
    :loading="loading"
    chips
    closable-chips
    label="Collaborators"
    multiple
  >
    <template #chip="{ props, item }">
      <v-chip v-bind="props">
        <AvatarView :username="item.raw" />
        <span>{{ item.raw }}</span>
      </v-chip>
    </template>

    <template #item="{ props, item }">
      <v-list-item v-bind="props">
        <template #prepend>
          <AvatarView :username="item.raw" />
        </template>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useAPIStore } from '../../stores/api';
import AvatarView from '../AvatarView.vue';

const props = defineProps({
  modelValue: {
    type: Array as () => string[],
    required: true,
  },
});

const api = useAPIStore().api;

const people = ref([] as string[]);
const loading = ref(false);
const search = ref("");

const emits = defineEmits(["update:modelValue"]);

const collaborators = computed({
  get() {
    return props.modelValue;
  },
  set(value: string[]) {
    emits("update:modelValue", value);
  },
});

const searchUsers = async () => {
  loading.value = true;
  try {
    let users = await api.getUsers(search.value);
    let usernameList = [];
    for (let user of users) {
      usernameList.push(user.username);
    }
    people.value = usernameList;

  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};


watch(search, () => {
  searchUsers();
}, { immediate: true });
</script>

<style scoped></style>
