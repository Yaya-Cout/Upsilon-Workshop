<template>
  <div id="register-page">
    <v-card
      class="mx-auto px-6 py-8"
      width="500"
    >
      <h1 class="text-center">
        {{ $t('register.title') }}
      </h1>

      <v-form
        ref="formObject"
        v-model="form"
        @submit.prevent="register"
      >
        <v-container fluid>
          <v-text-field
            v-model="email"
            prepend-inner-icon="mdi-email"
            :label="$t('register.email')"
            :rules="emailRules"
            clearable
            type="email"
          />
          <v-text-field
            v-model="username"
            prepend-inner-icon="mdi-account-circle"
            :label="$t('register.username')"
            :rules="usernameRules"
            clearable
            :hint="$t('register.username-pattern')"
            maxlength="150"
          />

          <PasswordField v-model="password" />

          <PasswordField
            v-model="passwordConfirmation"
            :original-password="password"
            confirm
          />

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
            {{ $t('register.submit') }}
          </v-btn>
        </v-container>
      </v-form>
      <div class="switch-page-login-register">
        {{ $t('register.already-have-account') }}
        <router-link
          to="/login"
        >
          {{ $t('register.login') }}
        </router-link>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAPIStore } from '../stores/api';
import { useGlobalStore } from '../stores/global';
import PasswordField from '../components/forms/PasswordField.vue';
import { VForm } from 'vuetify/components/VForm';
const { t: $t } = useI18n();
const $router = useRouter();

const email = ref('');
const username = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const loading = ref(false);
const form = ref(false);
const formObject = ref<InstanceType<typeof VForm> | null>(null);

const emailRules = [
  (v: string) => !!v || $t('register.email-required-error'),
  (v: string) => /.+@.+\..+/.test(v) || $t('register.email-invalid-error'),
];
const usernameRules = [
  (v: string) => !!v || $t('register.username-required-error'),
  (v: string) => /^[a-zA-Z0-9@+-]+$/.test(v) || $t('register.username-invalid-error'),
  (v: string) => v.length <= 150 || $t('register.username-too-long-error'),
];
const api = useAPIStore().api;
const globalStore = useGlobalStore();

const register = async () => {
  loading.value = true;
  if (!formObject.value) {
    loading.value = false;
    console.error('Form object not found');
    return;
  }
  const { valid } = await formObject.value.validate();

  if (!valid || password.value !== passwordConfirmation.value) {
    loading.value = false;
    return;
  }

  let { success, response } = await api.register(username.value, password.value, email.value).catch(registrationFailed);
  if (!success) {
    registrationFailed(response);
  } else {
    registrationSuccess();
  }
  loading.value = false;
};

const registrationSuccess = () => {
  globalStore.success = "snackbar.success.register.account-created";
  $router.push({ name: 'login' });
};

const registrationFailed = (response: any) => {
  if (response["username"] && response["username"][0] === "A user with that username already exists.") {
    globalStore.usernameTaken = true;
  } else {
    globalStore.error = true;
  }
};
</script>

<style scoped>
#register-page {
  display: flex;
  vertical-align: middle;
  height: 100%;
}

#register-page>div {
  margin: auto;
}

.switch-page-login-register {
  display: inline-block;
  width: 100%;
  text-align: center;
}
</style>
