<template>
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
          type="submit"
        >
          {{ $t('settings.save') }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useGlobalStore } from '../../stores/global';
import { useAPIStore } from '../../stores/api';
import PasswordField from '../forms/PasswordField.vue';

export default defineComponent({
  name: "PasswordChangeSettings",
  components: {
    PasswordField,
  },
  data() {
    return {
      api: useAPIStore().api,
      globalStore: useGlobalStore(),
      password: '',
      passwordConfirm: '',
      passwordForm: false,
      passwordLoading: false,
    };
  },
  methods: {
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

<style scoped></style>
