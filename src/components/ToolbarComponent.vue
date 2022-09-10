<template>
  <v-app-bar
    app
    color="#6A76AB"
    shrink-on-scroll
    prominent
    fade-img-on-scroll
    elevate-on-scroll
    scroll-target="#scrolling-techniques-3"
  >
    <template #img="{ props }">
      <v-img
        v-bind="props"
        gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"
      />
    </template>

    <v-app-bar-nav-icon />

    <v-app-bar-title>{{ pageTitle }}</v-app-bar-title>

    <v-spacer />

    <v-btn icon>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon>mdi-dots-vertical</v-icon>
    </v-btn>

    <template #extension>
      <v-tabs align-with-title>
        <v-tab>Most Downloaded</v-tab>
        <v-tab>Latest</v-tab>
        <v-tab>Solo Games</v-tab>
        <v-tab>Multiplayer Games</v-tab>
        <v-tab>Mathematics</v-tab>
        <v-tab>Others</v-tab>
      </v-tabs>
    </template>
  </v-app-bar>
</template>

<script>
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'ToolbarComponent',
  setup() {
    const { t } = useI18n({
      inheritLocale: true,
      useScope: 'local'
    })
    return { t }
  },
  data: () => ({
    collapseOnScroll: true
  }),
  computed: {
    pageTitle() {
      return this.$route.meta.title
    }
  }
})
</script>
