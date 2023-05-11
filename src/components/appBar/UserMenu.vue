<template>
  <div v-if="!api.LOGGED_IN">
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
      api: useAPIStore().api,
    };
  },
});
</script>

<style scoped></style>
