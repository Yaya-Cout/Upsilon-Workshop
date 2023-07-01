<template>
  <div id="settings-page">
    <v-container>
      <v-row no-gutters>
        <v-col class="user-col col-1">
          <UserPreviewBig :user="userData" />
        </v-col>
        <!-- TODO: Allow changing email and username -->
        <v-col class="col-1">
          <!-- <v-card>
            <v-card-title>{{ $t('settings.title') }}</v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item>
                  <v-text-field
                    v-model="userData.username"
                    :label="$t('settings.username')"
                    outlined
                    dense
                  />
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                @click="save"
              >
                {{ $t('settings.save') }}
              </v-btn>
            </v-card-actions>
          </v-card> -->
          <!-- Password changing -->
          <v-card>
            <v-card-title>{{ $t('settings.password') }}</v-card-title>
            <v-card-text>
              <PasswordField v-model="password" />
              <PasswordField
                v-model="passwordConfirm"
                :original-password="password"
                confirm
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                @click="savePassword"
              >
                {{ $t('settings.save') }}
              </v-btn>
            </v-card-actions>
          </v-card>
          <!-- TODO: Add delete account -->
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { User } from '../types';
import { useAPIStore } from '../stores/api';
import UserPreviewBig from '../components/user/UserPreviewBig.vue';
import PasswordField from '../components/forms/PasswordField.vue';

export default defineComponent({
  name: "SettingsPage",
  components: {
    UserPreviewBig,
    PasswordField,
  },
  data() {
    return {
      api: useAPIStore().api,
      userData: useAPIStore().api.EMPTY_USER as User,
      password: "",
      passwordConfirm: "",
    };
  },
  watch: {
    "api.USERNAME": {
      immediate: true,
      async handler() {
        // If the username is empty, return
        if (this.api.USERNAME === "") {
          return;
        }

        this.userData = await this.api.loadLazyLoadingObject(this.api.getUser(this.api.USERNAME))
      },
    },
  },
  methods: {
    async save() {
      await this.api.updateUser(this.userData);
    },
    async savePassword() {
      await this.api.updatePassword(this.password);
    },
  },
});
</script>

<style scoped>
.user-col {
  max-width: 300px;
}

.col-1 {
  margin: 16px;
}
</style>