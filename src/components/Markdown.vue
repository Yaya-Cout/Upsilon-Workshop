<template>
    <div ref="markdown"></div>
</template>
<script lang="ts">
import showdown from 'showdown';
import { defineComponent } from 'vue';
export default defineComponent({
    props: {
        content: String,
    },
    mounted() {
        //@ts-ignore
        this.$refs.markdown.innerHTML = new showdown.Converter().makeHtml(
            this.content!
        );
    },
    watch: {
        content() {
            //@ts-ignore
            this.$refs.markdown.innerHTML = new showdown.Converter().makeHtml(
                this.content!
            );
        },
    },
});
</script>

<style scoped></style>
