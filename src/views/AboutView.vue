<template>
  <div class="about">
    <h1>{{ t("about.title") }}</h1>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'AboutView',
  setup() {
    const { t } = useI18n({
      inheritLocale: true,
      useScope: 'global'
    })

    return { t }
  }
})
</script>
