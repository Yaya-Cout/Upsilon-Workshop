<template>
  <div class="search">
    <p>
      {{ $route.params.gameId }}
    </p>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "HelloI18n",
  setup() {
    const { t } = useI18n({
      inheritLocale: true,
      useScope: "local",
    });

    return { t };
  },
});
</script>
