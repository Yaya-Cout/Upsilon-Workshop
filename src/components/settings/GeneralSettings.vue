<template>
  <v-card class="mb-4">
    <v-card-title>{{ $t('settings.title') }}</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item>
          <v-text-field
            v-model="userData.username"
            :label="$t('settings.username')"
            outlined
            dense
          />
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="primary"
        @click="save"
      >
        {{ $t('settings.save') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { User } from '../../types';

export default defineComponent({
  name: "DangerZoneSettings",
  props: {
    modelValue: {
      type: Object as () => User,
      required: true,
    },
  },
  emits: ['update:modelValue'],
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
      await this.api.updateUser(this.userData);
    },
  },
});
</script>

<style scoped></style>
