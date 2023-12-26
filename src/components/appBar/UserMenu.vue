<template>
  <div v-if="!apiStore.loggedIn">
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
  </div>
  <div v-else>
    <UserDropdown ref="menu" />
  </div>
  <PopupWarningPrivateProjects />
</template>

<script setup lang="ts">
import { useAPIStore } from '../../stores/api';
import UserDropdown from './UserDropdown.vue';
import PopupWarningPrivateProjects from '../popup/PopupWarningPrivateProjects.vue';

const apiStore = useAPIStore();
</script>

<style scoped></style>
