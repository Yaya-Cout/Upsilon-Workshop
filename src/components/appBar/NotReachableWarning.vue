<template>
  <v-banner
    v-if="apiStore.serverNotReachable"
    color="error"
    icon="mdi-network-off"
    position="fixed"
    elevation="2"
    class="top-banner"
  >
    The server is not reachable. Please check your internet connection and try again! This might also be a temporary issue with the server.
    <template #actions>
      <v-btn @click="closeBanner">
        Close
      </v-btn>
    </template>
  </v-banner>
</template>

<script setup lang="ts">
import { useAPIStore } from '../../stores/api';

const apiStore = useAPIStore();

const closeBanner = () => {
  apiStore.serverNotReachable = false;
};
</script>

<style scoped>
.top-banner {
  width: 100%;
  z-index: 1000;
}
</style>
