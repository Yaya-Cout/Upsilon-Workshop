import { defineStore } from 'pinia'
import API from '../api/main';

export const useAPIStore = defineStore('API', {
  state: () => ({
    api: new API(),
    username: "",
    ready: false,
    loggedIn: false,
    notLoggedInError: false,
  }),
})
