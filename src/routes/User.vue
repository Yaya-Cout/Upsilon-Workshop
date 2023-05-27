<template>
  <div id="user-page">
    <v-container>
      <v-row no-gutters>
        <v-col class="user-col col-1">
          <v-card>
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
        </v-col>
        <v-col class="col-1">
          <v-card>
            <v-card-title>
              <h3>Projects</h3>
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="project in userData?.projects"
                  :key="project.uuid"
                >
                  <v-list-item-title>{{ project.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{ project.description }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
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
.user-col {
  max-width: 400px;
}

.col-1 {
  margin: 16px;
}
</style>
