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

    <v-text-field
      v-model="search"
      label="Search scripts"
      class="search-bar"
      hide-details
      clearable
    />
    <!-- <v-btn icon>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon>mdi-dots-vertical</v-icon>
    </v-btn> -->

    <template #extension>
      <v-tabs
        v-model="actualTab"
        align-with-title
      >
        <v-tab
          v-for="tab in tabs"
          :key="tab"
        >
          {{ tab[0] }}
        </v-tab>
        <!-- <v-tab>Home</v-tab>
        <v-tab>Most Downloaded</v-tab>
        <v-tab>Latest</v-tab>
        <v-tab>Solo Games</v-tab>
        <v-tab>Multiplayer Games</v-tab>
        <v-tab>Mathematics</v-tab>
        <v-tab>Others</v-tab> -->
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
    search: '',
    tabs: [
      [
        "Home",
        "/"
      ],
      [
        "Most Downloaded",
        "/list/most-downloaded"
      ],
      [
        "Latest",
        "/list/latest"
      ],
      [
        "Solo Games",
        "/list/solo-games"
      ],
      [
        "Multiplayer Games",
        "/list/multiplayer-games"
      ],
      [
        "Mathematics",
        "/list/mathematics"
      ],
      [
        "Others",
        "/list/others"
      ]
    ],
    actualTab: 0,
  }),
  computed: {
    pageTitle() {
      return this.$route.meta.title
    },
    route() {
      return this.$route.path
    }
  },
  watch: {
    search() {
      // If search is empty, redirect to home
      if (this.search === '') {
        this.$router.push({ name: 'home' })
      } else {
        // Else, redirect to search page
        this.$router.push({ name: 'search', params: { query: this.search } })
      }
    },
    actualTab() {
      // Get the route of the tab
      const route = this.tabs[this.actualTab][1]
      // Redirect to the route
      this.$router.push({ path: route })
    },
    route() {
      // Get the index of the tab
      const index = this.tabs.findIndex((tab) => tab[1] === this.route)
      // Set the actual tab
      this.actualTab = index
    }
  },
  mounted() {}
})
</script>

<style scoped>
.search-bar {
  margin: 0 1rem;
}
</style>