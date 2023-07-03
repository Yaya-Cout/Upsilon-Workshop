<template>
  <v-text-field
    v-model="password"
    prepend-inner-icon="mdi-lock"
    :label="confirm ? $t('forms.password-field.label-confirm') : $t('forms.password-field.label')"
    :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
    :rules="passwordRules"
    :type="showPassword ? 'text' : 'password'"
    :hint="confirm ? $t('forms.password-field.hint-confirm') : $t('forms.password-field.hint')"
    @click:append-inner="showPassword = !showPassword"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: "PasswordField",
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    confirm: {
      type: Boolean,
      default: false,
    },
    originalPassword: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue"],
  data() {
    let data = {
      showPassword: false,
      passwordRules: [
        (v: string) => !!v || this.$t('forms.password-field.rules.required'),
        (v: string) => v.length >= 8 || this.$t('forms.password-field.rules.min-8-chars'),
      ],
    };
    if (this.confirm) {
      data.passwordRules.push((v: string) => v === this.originalPassword || this.$t('forms.password-field.rules.identical'));
    }

    return data;
  },
  computed: {
    password: {
      get(): string[] {
        return this.modelValue
      },
      set(value: string[]) {
        this.$emit("update:modelValue", value);
      },
    },
  },
});
</script>

<style scoped></style>
