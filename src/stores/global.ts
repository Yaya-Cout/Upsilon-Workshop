import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: () => ({
    // Generic error message
    error: false,
    // True when the account was successfully created
    accountCreated: false,
    // True when the username is already taken
    usernameTaken: false,
    // Show the global progress bar (boolean or number between 0 and 100)
    progress: false as boolean | number,
  }),
})
