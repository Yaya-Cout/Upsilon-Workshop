<template>
  <div ref="markdown" />
</template>
<script lang="ts">
import showdown from 'showdown';
import { defineComponent } from 'vue';
export default defineComponent({
    props: {
        content: {
            type: String,
            default: '',
        },
    },
    watch: {
        content() {
            //@ts-ignore
            this.$refs.markdown.innerHTML = new showdown.Converter().makeHtml(
                this.content!
            );
        },
    },
    mounted() {
        //@ts-ignore
        this.$refs.markdown.innerHTML = new showdown.Converter().makeHtml(
            this.content!
        );
    },
});
</script>

<style scoped></style>
