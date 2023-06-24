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

<script lang="ts">
import { defineComponent } from 'vue';
import { User } from '../../types';
import AvatarView from '../AvatarView.vue';
import { VSkeletonLoader } from 'vuetify/lib/labs/components.mjs';

export default defineComponent({
  name: 'UserPreview',
  components: {
    AvatarView,
    VSkeletonLoader,
  },
  props: {
    user: {
      type: Object as () => User,
      required: true,
    },
  },
  data() {
    return {
      groups: '',
    };
  },
  watch: {
    // We watch on userData.groups to update the groups string
    // when the data is loaded
    'user.groups': {
      async handler() {
        const groups = await this.user?.groups;
        let groupsString = '';
        for (const group of groups || []) {
          const result = await group.name;
          groupsString += result + ', ';
        }
        groupsString = groupsString.slice(0, -2);
        this.groups = groupsString;
      },
      immediate: false,
    },
  },
});
</script>

<style scoped></style>
