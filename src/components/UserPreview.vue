<template>
  <v-list-item
    :title="username"
    :to="`/user/${username}`"
  >
    <template #prepend>
      <AvatarView :username="username" />
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
import AvatarView from './AvatarView.vue';

defineProps({
  username: {
    type: String,
    required: true,
  },
});
</script>

<style scoped></style>
