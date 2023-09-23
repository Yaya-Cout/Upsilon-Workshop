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
        {{ $t('editor.replace-confirm.title', { name: scriptName }) }}
      </v-card-title>

      <v-card-text>
        {{ $t('editor.replace-confirm.description', { name: scriptName }) }}

        <v-card-actions>
          <v-spacer />

          <v-btn
            @click="dialog = false"
          >
            {{ $t('editor.replace-confirm.cancel') }}
          </v-btn>

          <v-btn
            color="error"
            @click="replaceScript"
          >
            {{ $t('editor.replace-confirm.replace') }}
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Script } from '../../types';

const { t: $t } = useI18n();

const dialog = ref(false);

const emits = defineEmits(['replace']);

const props = defineProps({
  scriptName: {
    type: String,
    required: true,
  },
  scripts: {
    type: Object as () => Script[],
    default: () => {},
  },
});

watch(dialog, () => {
  // Get if script is already in project
  console.log(props.scriptName)
  const script = props.scripts.find((script) => script.title === props.scriptName);

  // If script is already in project, show replace dialog, otherwise emit replace
  if (!script) {
    dialog.value = false;
    emits('replace');
  }
});

const replaceScript = () => {
  emits('replace');
  dialog.value = false;
};
</script>

<style scoped></style>
