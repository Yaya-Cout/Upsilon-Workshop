<template>
  <v-card class="mb-4">
    <v-form
      ref="passwordFormObject"
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
          type="submit"
        >
          {{ $t('settings.save') }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useGlobalStore } from '../../stores/global';
import { useAPIStore } from '../../stores/api';
import PasswordField from '../forms/PasswordField.vue';
import { VForm } from 'vuetify/components/VForm';

const api = useAPIStore().api;
const globalStore = useGlobalStore();

const password = ref('');
const passwordConfirm = ref('');
const passwordLoading = ref(false);
const passwordForm = ref(false);
const passwordFormObject = ref<InstanceType<typeof VForm> | null>(null);

const savePassword = async () => {
  passwordLoading.value = true;
  globalStore.progress = true;
  try {
    await api.updatePassword(password.value);
  } catch (e) {
    console.error(e);
    passwordLoading.value = false;
    globalStore.progress = false;
    globalStore.error = true;
    return;
  }
  passwordLoading.value = false;
  globalStore.progress = false;
  globalStore.success = "snackbar.success.password-changed.message";
  // Ensure the form object is not null
  if (!passwordFormObject.value) {
    console.error("Form object is null.");
    return;
  }
  passwordFormObject.value.reset();
}
</script>

<style scoped></style>
