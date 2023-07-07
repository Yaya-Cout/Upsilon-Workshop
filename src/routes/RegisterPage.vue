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
        ref="registerForm"
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
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAPIStore } from '../stores/api';
import { useGlobalStore } from '../stores/global';
import PasswordField from '../components/forms/PasswordField.vue';

export default defineComponent({
  components: {
    PasswordField,
  },
  data() {
    let data = {
      email: '',
      username: '',
      password: '',
      passwordConfirmation: '',
      emailRules: [
        (v: string) => !!v || this.$t('register.email-required-error'),
        (v: string) => /.+@.+\..+/.test(v) || this.$t('register.email-invalid-error'),
      ],
      usernameRules: [
        (v: string) => !!v || this.$t('register.username-required-error'),
        (v: string) => /^[a-zA-Z0-9@+-]+$/.test(v) || this.$t('register.username-invalid-error'),
        (v: string) => v.length <= 150 || this.$t('register.username-too-long-error'),
      ],
      passwordRules: [
        (v: string) => !!v || this.$t('register.password-required-error'),
        (v: string) => v.length >= 8 || this.$t('register.least-8-chars-error'),
      ],
      passwordConfirmRules: [] as object[],
      showPassword: false,
      showPasswordConfirmation: false,
      loading: false,
      form: false,
      api: useAPIStore().api,
      snackbar: false,
      globalStore: useGlobalStore()
    }
    data.passwordConfirmRules.push((v: string) => v === data.password || this.$t('register.password-identical-error'))
    return data
  },
  methods: {
    async register() {
      this.loading = true
      const { valid } = await this.$refs.registerForm.validate()

      if (!valid || this.password !== this.passwordConfirmation) {
        this.loading = false
        return
      }

      let { success, response } = await this.api.register(this.username, this.password, this.email).catch(this.registrationFailed)
      if (!success) {
        this.registrationFailed(response)
      } else {
        this.registrationSuccess()
      }
      this.loading = false
    },
    registrationSuccess() {
      this.globalStore.success = "snackbar.success.register.account-created"
      this.$router.push({ name: 'login' })
    },
    registrationFailed(response: any) {
      if (response["username"] && response["username"][0] === "A user with that username already exists.") {
        this.globalStore.usernameTaken = true;
      } else {
        this.globalStore.error = true;
      }
    }
  }
});
</script>

<style>
#register-page {
  display: flex;
  vertical-align: middle;
  height: 100%;
}

#register-page>div {
  margin: auto;
}
</style>