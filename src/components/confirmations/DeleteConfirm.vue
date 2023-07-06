<template>
  <v-dialog
    v-model="dialog"
    max-width="350"
  >
    <template #activator="{ props }">
      <div v-bind="props">
        <slot />
      </div>
    </template>
    <v-card>
      <v-card-title class="headline">
        {{ $t('editor.delete-confirm.title', { name: scriptName }) }}
      </v-card-title>

      <v-card-text>
        {{ $t('editor.delete-confirm.description', { name: scriptName }) }}

        <v-switch
          v-model="dontShowAgain"
          :label="$t('editor.delete-confirm.dont-show-again')"
          hide-details
        />

        <v-card-actions>
          <v-spacer />

          <v-btn
            @click="dialog = false"
          >
            {{ $t('editor.delete-confirm.cancel') }}
          </v-btn>

          <v-btn
            color="error"
            @click="deleteScript"
          >
            {{ $t('editor.delete-confirm.delete') }}
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useGlobalStore } from '../../stores/global';

const globalStore = useGlobalStore();
const { t: $t } = useI18n();

const dialog = ref(false);

const emits = defineEmits(['delete']);

defineProps({
  scriptName: {
    type: String,
    required: true,
  },
});

const dontShowAgain = computed({
  get() {
    return !globalStore.showDeleteConfirm;
  },
  set(value: boolean) {
    globalStore.showDeleteConfirm = !value;
  },
});

watch(dialog, () => {
  // If the dialog is closed and the user has checked the "don't show again" box, delete the script without asking
  // TODO: Find a way to enable the dialog again
  if (dialog.value && dontShowAgain.value) {
    deleteScript();
    dialog.value = false;
  }
});

const deleteScript = () => {
  emits('delete');
  dialog.value = false;
};
</script>

<style scoped></style>
