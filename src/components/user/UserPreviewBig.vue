<template>
  <v-card>
    <v-card-title>
      <AvatarView :username="user.username" />
      <span class="ml-2">{{ user.username }}</span>
    </v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item v-if="groups !== ''">
          <v-list-item-title>{{ $t('user.groups') }}</v-list-item-title>
          <v-skeleton-loader
            :loading="groups === 'none'"
            type="text"
            width="100"
          >
            <v-list-item-subtitle>{{ groups }}</v-list-item-subtitle>
          </v-skeleton-loader>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { User } from '../../types';
import AvatarView from '../AvatarView.vue';
import { VSkeletonLoader } from 'vuetify/lib/labs/components.mjs';

const props = defineProps({
  user: {
    type: Object as () => User,
    required: true,
  },
});

const groups = ref('');

watchEffect(async () => {
  const groupsAwaited = await props.user?.groups;
  let groupsString = '';
  for (const group of groupsAwaited || []) {
    const result = await group.name;
    groupsString += result + ', ';
  }
  groupsString = groupsString.slice(0, -2);
  groups.value = groupsString;
});
</script>

<style scoped></style>
