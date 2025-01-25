import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useNumberStore = defineStore('numberStore', () => {
  const number = ref(0) 

  function setNumber(value) {
    number.value = value
  }

  return { number, setNumber }
})
