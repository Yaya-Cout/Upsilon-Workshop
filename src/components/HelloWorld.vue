<template>
  <p>{{ t('about.title') }}</p>
</template>

<script>
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'HelloWorld',
  setup() {
    const { t } = useI18n({
      inheritLocale: true,
      useScope: 'global'
    })

    return { t }
  }
})
</script>
