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

<script setup lang="ts">
import { ref, computed } from 'vue';
import { User } from '../../types';
import { useAPIStore } from '../../stores/api';
import { useGlobalStore } from '../../stores/global';

const api = useAPIStore().api;
const globalStore = useGlobalStore();

const generalSettingsForm = ref(false);
const loading = ref(false);

const emits = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: {
    type: Object as () => User,
    required: true,
  },
});

const userData = computed({
  get() {
    return props.modelValue;
  },
  set(value: User) {
    emits('update:modelValue', value);
  },
});

const save = async () => {
  loading.value = true;
  globalStore.progress = true;
  try {
    await api.updateUser(userData.value);
  } catch (e) {
    console.error(e);
    loading.value = false;
    globalStore.progress = false;
    globalStore.error = true;
  }
  loading.value = false;
  globalStore.progress = false;
  globalStore.success = true;
};
</script>

<style scoped></style>
