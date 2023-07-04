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

<script lang="ts">
import { defineComponent } from 'vue';
import { useGlobalStore } from '../../stores/global';

export default defineComponent({
  name: 'DeleteConfirm',
  props: {
    scriptName: {
      type: String,
      required: true,
    },
  },
  emits: ['delete'],
  data() {
    return {
      dialog: false,
      globalStore: useGlobalStore(),
    };
  },
  methods: {
    deleteScript() {
      this.$emit('delete');
      this.dialog = false;
    },
  },
});
</script>

<style scoped></style>
