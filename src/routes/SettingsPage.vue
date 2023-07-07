<template>
  <div id="settings-page">
    <v-container>
      <v-row no-gutters>
        <v-col class="user-col col-1">
          <UserPreviewBig :user="userData" />
        </v-col>
        <!-- TODO: Allow changing email and username -->
        <v-col class="col-1">
          <!-- <GeneralSettings :model-value="userData" /> -->
          <PasswordChangeSettings />
          <DangerZoneSettings />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { User } from '../types';
import { useAPIStore } from '../stores/api';
import { useGlobalStore } from '../stores/global';
import UserPreviewBig from '../components/user/UserPreviewBig.vue';
// import GeneralSettings from '../components/settings/GeneralSettings.vue';
import DangerZoneSettings from '../components/settings/DangerZoneSettings.vue';
import PasswordChangeSettings from '../components/settings/PasswordChangeSettings.vue';

export default defineComponent({
  components: {
    UserPreviewBig,
    // GeneralSettings,
    PasswordChangeSettings,
    DangerZoneSettings,
  },
  data() {
    return {
      api: useAPIStore().api,
      apiStore: useAPIStore(),
      globalStore: useGlobalStore(),
      userData: useAPIStore().api.EMPTY_USER as User,
    };
  },
  watch: {
    "apiStore.username": {
      immediate: true,
      async handler() {
        // If the username is empty, return
        if (this.apiStore.username === "") {
          return;
        }

        this.userData = await this.api.loadLazyLoadingObject(this.api.getUser(this.apiStore.username))
      },
    },
    "apiStore.ready": {
      immediate: true,
      async handler() {
        // If the API is ready and the username is empty, redirect to the login page
        if (useAPIStore().ready && !useAPIStore().loggedIn && useAPIStore().username === "") {
          this.$router.push({ name: "login" })
        }
      },
    },
  },
});
</script>

<style scoped>
.user-col {
  max-width: 300px;
}

.col-1 {
  margin: 16px;
}
</style>