<template>
    <v-app>
        <v-main>
            <v-app-bar>
                <v-app-bar-title>Upsilon Workshop </v-app-bar-title>
                <v-btn class="mx-2" to="/search">
                    {{ $t('navbar.explore') }}
                </v-btn>
                <v-btn class="mx-2" to="/edit">
                    {{ $t('navbar.start') }}
                </v-btn>
                <div v-if="!api.isLoggedIn()">
                    <v-btn class="mx-2" to="/login">
                        {{ $t('navbar.login') }}
                    </v-btn>
                    <v-btn class="mx-2" variant="outlined">
                        {{ $t('navbar.signup') }}
                    </v-btn>
                </div>
                <div v-else>
                    <v-btn class="mx-2" variant="outlined" @click="api.logout()" to="/login">
                        {{ $t('navbar.logout') }}
                    </v-btn>
                </div>
            </v-app-bar>
            <router-view></router-view>
        </v-main>
    </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAPIStore } from '@/stores/api';

export default defineComponent({
    name: 'App',

    data() {
        return {
            api: useAPIStore().api,
        };
    },
});
</script>
<style>
.v-main {
    background-image: url('./assets/background_light.webp') !important;
    background-size: cover;
}
</style>
