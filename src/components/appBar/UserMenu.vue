<template>
  <div v-if="!apiStore.loggedIn">
    <v-btn
      class="mx-2"
      to="/login"
    >
      {{ $t('navbar.login') }}
    </v-btn>
    <v-btn
      class="mx-2"
      variant="outlined"
      to="/register"
    >
      {{ $t('navbar.signup') }}
    </v-btn>
  </div>
  <div v-else>
    <UserDropdown ref="menu" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAPIStore } from '../../stores/api';
import UserDropdown from './UserDropdown.vue';

export default defineComponent({
  components: {
    UserDropdown
  },
  data() {
    return {
      apiStore: useAPIStore(),
    };
  },
});
</script>

<style scoped></style>
