import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: () => ({
    // Generic error message
    error: false,
    // True when the account was successfully created
    accountCreated: false,
    // True when the username is already taken
    usernameTaken: false,
  }),
})
