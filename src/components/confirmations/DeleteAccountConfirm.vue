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
        ref="formObject"
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

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGlobalStore } from '../../stores/global';
import { useAPIStore } from '../../stores/api';
import PasswordField from '../forms/PasswordField.vue';
import { VForm } from 'vuetify/components/VForm';

const globalStore = useGlobalStore();
const api = useAPIStore().api;
const $router = useRouter();

const dialog = ref(false);
const password = ref('');
const confirm = ref(false);
const loading = ref(false);
const form = ref(false);

const formObject = ref<InstanceType<typeof VForm> | null>(null);

const deleteAccount = async () => {
    loading.value = true;
    globalStore.progress = true;

    // If the form object is null, return
    if (!formObject.value) {
        loading.value = false;
        globalStore.error = true;
        globalStore.progress = false;
        console.error("Form object is null.");
        return;
    }

    // Ensure the form is valid
    let valid = await formObject.value.validate();
    if (!valid) {
        loading.value = false;
        return;
    }

    // Delete the account
    try {
        await api.deleteUser(password.value);
    } catch (e) {
        globalStore.error = true
        loading.value = false;
        globalStore.progress = false;
        console.error(e);
        return;
    }

    loading.value = false;
    globalStore.progress = false;
    globalStore.success = "snackbar.success.account-deleted.message"
    dialog.value = false;
    // Redirect to the home page
    $router.push({ name: 'home' });
};
</script>

<style scoped></style>
