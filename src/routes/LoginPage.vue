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
        ref="loginForm"
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

<script lang="ts">
import { defineComponent } from 'vue';
import { useAPIStore } from '../stores/api';
import PasswordField from '../components/forms/PasswordField.vue';

export default defineComponent({
  components: {
    PasswordField,
  },
  data() {
    return {
      username: '',
      password: '',
      usernameRules: [
        (v: string) => !!v || this.$t('login.rules.username.required'),
      ],
      passwordRules: [
        (v: string) => !!v || this.$t('login.rules.password.required'),
      ],
      show: false,
      loading: false,
      form: false,
      api: useAPIStore().api,
      snackbar: false,
      timeout: 10000
    }
  },
  methods: {
    async login() {
      this.loading = true
      const { valid } = await this.$refs.loginForm.validate()

      if (!valid) {
        this.loading = false
        return
      }

      await this.api.login(this.username, this.password)
        .then(this.connected)
        .catch(this.connectionFailed);

      this.loading = false
    },
    connected() {
      this.$router.push({ name: 'home' })
    },
    connectionFailed() {
      this.snackbar = true
    }
  }
});
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