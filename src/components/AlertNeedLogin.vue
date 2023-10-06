<template>
  <div v-if="!apiStore.loggedIn">
    <v-alert
      :title="$t('alert.needlogin.title')"
      :text="$t('alert.needlogin.description')"
      type="warning"
    />
  </div>
</template>

<script setup lang="ts">
import { useAPIStore } from '../stores/api';

const apiStore = useAPIStore();
</script>

<style scoped></style>
