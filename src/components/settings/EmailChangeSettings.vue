<template>
  <v-card class="mb-4">
    <v-form
      ref="emailFormObject"
      v-model="emailForm"
      @submit.prevent="saveEmail"
    >
      <v-card-title>{{ $t('settings.email') }}</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="email"
          prepend-inner-icon="mdi-email"
          :label="$t('register.email')"
          :rules="emailRules"
          clearable
          type="email"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          :loading="emailLoading"
          :disabled="!emailForm || emailLoading"
          type="submit"
        >
          {{ $t('settings.save') }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useGlobalStore } from '../../stores/global';
import { useAPIStore } from '../../stores/api';
import { VForm } from 'vuetify/components/VForm';

const { t: $t } = useI18n();
const apiStore = useAPIStore();
const api = apiStore.api;
const globalStore = useGlobalStore();

const email = ref('');
const emailLoading = ref(false);
const emailForm = ref(false);

const emailRules = [
  (v: string) => !!v || $t('register.email-required-error'),
  (v: string) => /.+@.+\..+/.test(v) || $t('register.email-invalid-error'),
];

watch(apiStore, () => {
   email.value = apiStore.email;
}, { immediate: true });


const saveEmail = async () => {
  emailLoading.value = true;
  globalStore.progress = true;
  try {
    await api.updateEmail(email.value);
  } catch (e) {
    console.error(e);
    emailLoading.value = false;
    globalStore.progress = false;
    globalStore.error = true;
    return;
  }
  emailLoading.value = false;
  globalStore.progress = false;
  globalStore.success = "snackbar.success.email-changed.message";
}
</script>

<style scoped></style>
