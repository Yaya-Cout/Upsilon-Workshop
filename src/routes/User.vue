<template>
  <div id="user-page">
    <v-card class="user-card">
      <v-card-title>
        <AvatarView :username="username" />
        <span class="ml-2">{{ username }}</span>
      </v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item>
            <v-list-item-title>Groups</v-list-item-title>
            <v-list-item-subtitle>{{ groups }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { User } from '../types';
import { useAPIStore } from '../stores/api';
import AvatarView from '../components/AvatarView.vue';

export default defineComponent({
  name: 'UserPage',
  components: {
    AvatarView,
  },
  data() {
    return {
      api: useAPIStore().api,
      username: this.$route.params.username as string,
      userData: null as User | null,
      groups: '',
    }
  },
  watch: {
    // We watch on userData.groups to update the groups string
    // when the data is loaded
    'userData.groups': {
      async handler() {
        const groups = await this.userData?.groups;
        let groupsString = '';
        for (const group of groups || []) {
          const result = await group.name;
          groupsString += result + ', ';
        }
        groupsString = groupsString.slice(0, -2);
        this.groups = groupsString;

      },
      immediate: true,
    },
  },
  async mounted() {
    this.userData = await this.api.getUser(this.username);
  },
});
</script>

<style scoped>
#user-page {
  /* Center vertically */
  display: flex;
  vertical-align: middle;
  height: 100%;
}

.user-card {
  width: 100%;
  max-width: 400px;
  height: fit-content;
  margin-top: 16px;
  margin-left: 16px;
}
</style>
