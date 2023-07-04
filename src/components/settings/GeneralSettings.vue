<template>
  <v-card class="mb-4">
    <v-form
      ref="generalSettingsForm"
      v-model="generalSettingsForm"
      @submit.prevent="save"
    >
      <v-card-title>{{ $t('settings.title') }}</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="userData.username"
          :label="$t('settings.username')"
          outlined
          dense
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          :loading="loading"
          :disabled="!generalSettingsForm || loading"
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
import { User } from '../../types';
import { useAPIStore } from '../../stores/api';
import { useGlobalStore } from '../../stores/global';

export default defineComponent({
  name: "DangerZoneSettings",
  props: {
    modelValue: {
      type: Object as () => User,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      api: useAPIStore().api,
      globalStore: useGlobalStore(),
      generalSettingsForm: false,
      loading: false,
    };
  },
  computed: {
    userData: {
      get() {
        return this.modelValue
      },
      set(value: User) {
        this.$emit('update:modelValue', value);
      },
    },
  },
  methods: {
    async save() {
      this.loading = true;
      this.globalStore.progress = true;
      try {
        await this.api.updateUser(this.userData);
      } catch (e) {
        console.error(e);
        this.loading = false;
        this.globalStore.progress = false;
        this.globalStore.error = true;
      }
      this.loading = false;
      this.globalStore.progress = false;
      this.globalStore.success = true;
    },
  },
});
</script>

<style scoped></style>
