<template>
  <v-app-bar elevation="5">
    <ProgressbarComponent />
    <v-app-bar-title>
      <router-link
        to="/"
        class="home-link"
      >
        Upsilon Workshop
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
      to="/edit"
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

<script lang="ts">
import { defineComponent } from 'vue';
import ProgressbarComponent from '../ProgressbarComponent.vue';
import UserMenu from './UserMenu.vue';

export default defineComponent({
    components: {
      ProgressbarComponent,
      UserMenu
    }
});
</script>

<style scoped>
.home-link {
  color: var(--v-primary-base);
  text-decoration: none;
}
</style>
