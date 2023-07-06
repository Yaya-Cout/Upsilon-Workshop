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

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const props = defineProps({
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
});

const showPassword = ref(false);

const emits = defineEmits(["update:modelValue"]);

const passwordRules = computed(() => {
  let rules = [
    (v: string) => !!v || $t('forms.password-field.rules.required'),
    (v: string) => v.length >= 8 || $t('forms.password-field.rules.min-8-chars'),
  ];
  if (props.confirm) {
    rules.push((v: string) => v === props.originalPassword || $t('forms.password-field.rules.identical'));
  }
  return rules;
});


const password = computed({
  get() {
    return props.modelValue;
  },
  set(value: string) {
    emits("update:modelValue", value);
  },
});
</script>

<style scoped></style>
