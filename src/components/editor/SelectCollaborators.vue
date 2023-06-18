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

<script lang="ts">
import { defineComponent } from 'vue';
import { useAPIStore } from '../../stores/api';
import AvatarView from '../AvatarView.vue';

export default defineComponent({
  name: "SelectCollaborators",
  components: { AvatarView },
  props: {
    modelValue: {
      type: Array as () => string[],
      required: true,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      people: [] as string[],
      loading: false,
      search: "",
      api: useAPIStore().api,
    };
  },
  computed: {
    collaborators: {
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
      this.searchUsers();
    },
  },
  mounted() {
    this.searchUsers();
  },
  methods: {
    async searchUsers() {
      this.loading = true;
      try {
        let users = await this.api.getUsers(this.search);
        let usernameList = [];
        for (let user of users) {
          usernameList.push(user.username);
        }
        this.people = usernameList;

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
