<template>
  <div id="login-page">
    <v-card
      class="mx-auto px-6 py-8"
      width="500"
    >
      <h1 class="text-center">
        {{ $t('login.title') }}
      </h1>

      <v-form
        ref="formObject"
        v-model="form"
        @submit.prevent="login"
      >
        <v-container fluid>
          <v-text-field
            v-model="username"
            prepend-inner-icon="mdi-account-circle"
            :label="$t('login.username')"
            :rules="usernameRules"
            clearable
          />

          <PasswordField v-model="password" />

          <v-btn
            :loading="loading"
            :disabled="!form || loading"
            type="submit"
            block
            class="mt-2"
            variant="elevated"
            width="0%"
            color="primary"
            size="x-large"
          >
            {{ $t('login.submit') }}
          </v-btn>
        </v-container>
      </v-form>
      <a
        href="/register" 
        style="display: inline-block; width: 100%; text-align: center;"
      >{{ $t('login.go-register-page') }}</a>
    </v-card>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
    >
      <span>
        {{ $t('login.error') }}
      </span>
      <template #actions>
        <v-btn
          color="pink"
          variant="text"
          @click="snackbar = false"
        >
          {{ $t('snackbar.close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAPIStore } from '../stores/api';
import PasswordField from '../components/forms/PasswordField.vue';
import { VForm } from 'vuetify/components/VForm';
const { t: $t } = useI18n();
const $router = useRouter();

const username = ref('');
const password = ref('');
const loading = ref(false);
const form = ref(false);
// TODO: Use the global snackbar
const snackbar = ref(false);
const formObject = ref<InstanceType<typeof VForm> | null>(null);

const usernameRules = [
  (v: string) => !!v || $t('login.rules.username.required'),
];
const api = useAPIStore().api;
const timeout = 10000;

const login = async () => {
  loading.value = true
  if (!formObject.value) {
    loading.value = false
    console.error('Form object not found')
    return
  }
  const { valid } = await formObject.value.validate()

  if (!valid) {
    loading.value = false
    return
  }

  await api.login(username.value, password.value)
    .then(connected)
    .catch(connectionFailed);

  loading.value = false
};

const connected = () => {
  $router.push({ name: 'home' })
};

const connectionFailed = () => {
  snackbar.value = true
};
</script>

<style>
#login-page {
  display: flex;
  vertical-align: middle;
  height: 100%;
}

#login-page>div {
  margin: auto;
}
</style>
