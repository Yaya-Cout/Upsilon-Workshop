<template>
  <div id="search">
    <v-row>
      <v-col cols="12">
        <h1>Searching for {{ $route.params.query }}</h1>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "SearchView",
  setup() {
    const { t } = useI18n({
      inheritLocale: true,
      useScope: "local",
    });

    return { t };
  },
});
</script>
