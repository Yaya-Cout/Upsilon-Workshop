<template>
  <v-app>
    <div class="main-container">
      <v-main>
        <AppBar />
        <router-view />
        <MainManager />
        <MainSnackbar />
      </v-main>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import MainManager from './components/manager/MainManager.vue';
import MainSnackbar from './components/snackbars/MainSnackbar.vue';
import AppBar from './components/appBar/AppBar.vue';
</script>

<style scoped>
.v-main {
  backdrop-filter: blur(6px);
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
}

.main-container {
  background-image: url('./assets/background_light.webp');
  background-size: cover;
  width: 100%;
  height: 100%;
}
</style>
