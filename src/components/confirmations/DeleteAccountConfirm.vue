<template>
  <v-dialog
    v-model="dialog"
    max-width="450"
  >
    <template #activator="{ props }">
      <div v-bind="props">
        <slot />
      </div>
    </template>
    <v-card>
      <v-form
        ref="form"
        v-model="form"
        @submit.prevent="deleteAccount"
      >
        <v-card-title class="headline">
          {{ $t('settings.danger-zone.delete-account.confirm.title') }}
        </v-card-title>
        <v-alert type="warning">
          {{ $t('settings.danger-zone.delete-account.confirm.warning') }}
        </v-alert>
        <v-card-text>
          {{ $t('settings.danger-zone.delete-account.confirm.description') }}


          <PasswordField v-model="password" />

          <v-checkbox
            v-model="confirm"
            :label="$t('settings.danger-zone.delete-account.confirm.confirm')"
            :rules="[v => !!v || $t('settings.danger-zone.delete-account.confirm.confirm-required')]"
          />

          <v-card-actions>
            <v-spacer />

            <v-btn @click="dialog = false">
              {{ $t('settings.danger-zone.delete-account.confirm.no') }}
            </v-btn>

            <v-btn
              color="error"
              :disabled="!form || loading"
              :loading="loading"
              type="submit"
            >
              {{ $t('settings.danger-zone.delete-account.confirm.yes') }}
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useGlobalStore } from '../../stores/global';
import { useAPIStore } from '../../stores/api';
import PasswordField from '../forms/PasswordField.vue';

export default defineComponent({
  name: 'DeleteAccountConfirm',
  components: {
    PasswordField,
  },
  data() {
    return {
      dialog: false,
      globalStore: useGlobalStore(),
      api: useAPIStore().api,
      password: '',
      confirm: false,
      loading: false,
      form: false,
    };
  },
  methods: {
    async deleteAccount() {
      this.loading = true;
      this.globalStore.progress = true;

      // Ensure the form is valid
      let valid = await this.$refs.form.validate();
      if (!valid) {
        this.loading = false;
        return;
      }

      // Delete the account
      try {
        await this.api.deleteUser(this.password);
      } catch (e) {
        this.globalStore.error = true
        this.loading = false;
        this.globalStore.progress = false;
        console.error(e);
        return;
      }

      this.loading = false;
      this.globalStore.progress = false;
      this.globalStore.success = "snackbar.success.account-deleted.message"
      this.dialog = false;
      // Redirect to the home page
      this.$router.push({ name: 'home' });
    },
  },
});
</script>

<style scoped></style>
