<template>
  <div class="text-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="true"
    >
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          icon
        >
          <AvatarView :username="api.USERNAME" />
        </v-btn>
      </template>
      <v-card min-width="300">
        <v-list>
          <UserPreview :username="api.USERNAME" />
        </v-list>

        <v-divider />

        <v-list>
          <v-list-item
            prepend-icon="mdi-cogs"
            to="/settings"
          >
            {{ $t('navbar.settings') }}
          </v-list-item>

          <DisconnectConfirm>
            <v-list-item
              prepend-icon="mdi-logout"
              @click="null"
            >
              {{ $t('navbar.logout') }}
            </v-list-item>
          </DisconnectConfirm>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useAPIStore } from '../../stores/api';
import AvatarView from '../AvatarView.vue';
import DisconnectConfirm from '../confirmations/DisconnectConfirm.vue';
import UserPreview from '../UserPreview.vue';

export default defineComponent({
  components: {
    AvatarView,
    DisconnectConfirm,
    UserPreview,
  },
  data() {
    return {
      api: useAPIStore().api,
      menu: false
    };
  },
});
</script>

<style scoped></style>
