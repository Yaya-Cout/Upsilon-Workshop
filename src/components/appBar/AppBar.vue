<template>
  <NotReachableWarning />
  <v-app-bar elevation="5">
    <ProgressbarComponent />
    <v-app-bar-title>
      <router-link
        to="/"
        class="home-link"
      >
        {{ $t('upsilon-workshop') }}
      </router-link>
    </v-app-bar-title>
    <v-btn
      class="mx-2"
      to="/search"
    >
      {{ $t('navbar.explore') }}
    </v-btn>
    <v-btn
      class="mx-2"
      to="/create"
    >
      {{ $t('navbar.start') }}
    </v-btn>
    <v-btn
      class="mx-2"
      to="/calculator"
    >
      {{ $t('navbar.calculator') }}
    </v-btn>
    <UserMenu />
  </v-app-bar>
</template>

<script setup lang="ts">
import ProgressbarComponent from '../ProgressbarComponent.vue';
import NotReachableWarning from './NotReachableWarning.vue';
import UserMenu from './UserMenu.vue';
</script>

<style scoped>
.home-link {
  color: var(--v-primary-base);
  text-decoration: none;
}
</style>
