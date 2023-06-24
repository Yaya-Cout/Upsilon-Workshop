<template>
  <div id="settings-page">
    <v-container>
      <v-row no-gutters>
        <v-col class="user-col col-1">
          <UserPreviewBig :user="userData" />
        </v-col>
      </v-row>
      Welcome to the settings page
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { User } from '../types';
import { useAPIStore } from '../stores/api';
import UserPreviewBig from '../components/user/UserPreviewBig.vue';

export default defineComponent({
  name: "SettingsPage",
  components: {
    UserPreviewBig,
  },
  data() {
    return {
      api: useAPIStore().api,
      userData: useAPIStore().api.EMPTY_USER as User,
    };
  },
  watch: {
    "api.USERNAME": {
      immediate: true,
      async handler() {
        // If the username is empty, return
        if (this.api.USERNAME === "") {
          return;
        }

        this.userData = await this.api.loadLazyLoadingObject(this.api.getUser(this.api.USERNAME))
      },
    },
  },
});
</script>

<style scoped>

</style>