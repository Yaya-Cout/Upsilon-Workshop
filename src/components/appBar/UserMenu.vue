<template>
  <span
    v-if="!apiStore.loggedIn"
    class="container"
  >
    <v-btn
      class="mx-2"
      to="/login"
      color="primary"
    >
      {{ $t('navbar.login') }}
    </v-btn>
    <v-btn
      class="mx-2"
      variant="outlined"
      to="/register"
      color="primary"
    >
      {{ $t('navbar.signup') }}
    </v-btn>
  </span>
  <span
    v-else
    class="register"
  >
    <div>
      <UserDropdown ref="menu" />
    </div>
  </span>
  <PopupWarningPrivateProjects />
</template>

<script setup lang="ts">
import { useAPIStore } from '../../stores/api';
import UserDropdown from './UserDropdown.vue';
import PopupWarningPrivateProjects from '../popup/PopupWarningPrivateProjects.vue';

const apiStore = useAPIStore();
</script>

<style scoped>
.container {
  margin-right: 8px;
  display: inherit;
}
</style>
