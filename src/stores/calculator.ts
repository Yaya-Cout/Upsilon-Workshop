import { defineStore } from 'pinia'
import { newCalculator } from '../calculator/main'

export const useCalculatorStore = defineStore('calculator', {
  state: () => ({
    calculator: newCalculator(),
    connected: false,
    notConnectedError: false,
    tooMuchDataError: false,
  }),
})
