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
          <v-card class="mb-4">
            <v-form
              ref="passwordForm"
              v-model="passwordForm"
              @submit.prevent="savePassword"
            >
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
                  :loading="passwordLoading"
                  :disabled="!passwordForm || passwordLoading"
                  @click="savePassword"
                >
                  {{ $t('settings.save') }}
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
          <v-card class="mb-4 danger">
            <v-card-title>{{ $t('settings.danger-zone.title') }}</v-card-title>
            <v-card-text>
              {{ $t('settings.danger-zone.delete-account.description') }}
            </v-card-text>
            <v-card-actions>
              <v-spacer />

              <DeleteAccountConfirm>
                <v-btn color="error">
                  {{ $t('settings.danger-zone.delete-account.delete') }}
                </v-btn>
              </DeleteAccountConfirm>
            </v-card-actions>
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
import { useGlobalStore } from '../stores/global';
import UserPreviewBig from '../components/user/UserPreviewBig.vue';
import PasswordField from '../components/forms/PasswordField.vue';
import DeleteAccountConfirm from '../components/confirmations/DeleteAccountConfirm.vue';

export default defineComponent({
  name: "SettingsPage",
  components: {
    UserPreviewBig,
    PasswordField,
    DeleteAccountConfirm,
  },
  data() {
    return {
      api: useAPIStore().api,
      globalStore: useGlobalStore(),
      userData: useAPIStore().api.EMPTY_USER as User,
      passwordLoading: false,
      password: "",
      passwordConfirm: "",
      passwordForm: false,
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
      this.passwordLoading = true;
      this.globalStore.progress = true;
      try {
        await this.api.updatePassword(this.password);
      } catch (e) {
        console.error(e);
        this.passwordLoading = false;
        return;
      }
      this.passwordLoading = false;
      this.globalStore.progress = false;
      this.globalStore.success = "snackbar.success.password-changed.message";
      this.$refs.passwordForm.reset();
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

.danger {
  /* Add a red border */
  border: 1px solid red;
  background-color: #ffdddd;
}
</style>