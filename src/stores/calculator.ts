import { defineStore } from 'pinia'
import NumWorks from "upsilon.js";

export const useCalculatorStore = defineStore('calculator', {
  state: () => ({
    calculator: new NumWorks(),
    connected: false,
    notConnectedError: false,
  }),
})
