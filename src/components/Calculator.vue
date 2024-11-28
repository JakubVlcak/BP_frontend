<template>
  <div class="calculator">
    <h1>Vue.js Calculator</h1>

    <!-- Display -->
    <input type="text" v-model="currentInput" disabled />

    <!-- Buttons for numbers and operations -->
    <div class="buttons">
      <button @click="appendNumber('1')">1</button>
      <button @click="appendNumber('2')">2</button>
      <button @click="appendNumber('3')">3</button>
      <button @click="chooseOperation('+')">+</button>

      <button @click="appendNumber('4')">4</button>
      <button @click="appendNumber('5')">5</button>
      <button @click="appendNumber('6')">6</button>
      <button @click="chooseOperation('-')">-</button>

      <button @click="appendNumber('7')">7</button>
      <button @click="appendNumber('8')">8</button>
      <button @click="appendNumber('9')">9</button>
      <button @click="chooseOperation('*')">*</button>

      <button @click="appendNumber('0')">0</button>
      <button @click="clear">C</button>
      <button @click="calculate">=</button>
      <button @click="chooseOperation('/')">/</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentInput: '', // The current input to be displayed
      previousInput: '', // The previous number before operation
      operation: null, // The selected operation (+, -, *, /)
    }
  },
  methods: {
    // Append numbers to the current input
    appendNumber(number) {
      this.currentInput += number
    },

    // Choose an operation (+, -, *, /)
    chooseOperation(op) {
      if (this.currentInput === '') return // Do nothing if there's no number
      if (this.previousInput !== '') {
        this.calculate()
      }
      this.operation = op
      this.previousInput = this.currentInput // Store the current input as previous input
      this.currentInput = '' // Reset current input for the next number
    },

    // Clear all inputs
    clear() {
      this.currentInput = ''
      this.previousInput = ''
      this.operation = null
    },

    // Perform the calculation
    calculate() {
      let result
      const prev = parseFloat(this.previousInput)
      const current = parseFloat(this.currentInput)

      if (isNaN(prev) || isNaN(current)) return

      switch (this.operation) {
        case '+':
          result = prev + current
          break
        case '-':
          result = prev - current
          break
        case '*':
          result = prev * current
          break
        case '/':
          result = prev / current
          break
        default:
          return
      }

      this.currentInput = result.toString()
      this.operation = null
      this.previousInput = ''
    },
  },
}
</script>

<style scoped>
.calculator {
  max-width: 300px;
  margin: 0 auto;
  text-align: center;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 20px;
  margin-bottom: 10px;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

button {
  padding: 20px;
  font-size: 18px;
  cursor: pointer;
}
</style>
