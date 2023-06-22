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

<script lang="ts">
import { defineComponent } from 'vue';
import AvatarView from './AvatarView.vue';

export default defineComponent({
  name: 'UserPreview',
  components: {
    AvatarView,
  },
  props: {
    username: {
      type: String,
      required: true,
    },
  },
});
</script>

<style scoped></style>
