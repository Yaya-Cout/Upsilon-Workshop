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


<script setup lang="ts">
import { watchEffect, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAPIStore } from '../stores/api';
import UserPreviewBig from '../components/user/UserPreviewBig.vue';
// import GeneralSettings from '../components/settings/GeneralSettings.vue';
import DangerZoneSettings from '../components/settings/DangerZoneSettings.vue';
import PasswordChangeSettings from '../components/settings/PasswordChangeSettings.vue';
const $router = useRouter();

const api = useAPIStore().api;
const apiStore = useAPIStore();
const userData = ref(api.EMPTY_USER);

watchEffect(async () => {
  // If the username is empty, return
  if (apiStore.username === "") {
    return;
  }

  userData.value = await api.loadLazyLoadingObject(api.getUser(apiStore.username));
});

watchEffect(() => {
  // If the API is ready and the username is empty, redirect to the login page
  if (apiStore.ready && !apiStore.loggedIn && apiStore.username === "") {
    $router.push({ name: "login" });
  }
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