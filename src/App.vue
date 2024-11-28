<template>
  <TheHeader></TheHeader>
  <h1>hello</h1>
  <input v-model="message" placeholder="Enter a message" />
  <p>Message is: {{ message }}</p>
  <button @click="submitMessage">Submit</button>
  <p>Submit message: {{ SubmitMessage }}</p>
  <calculator></calculator>
  <ais-card></ais-card>
</template>

<style scoped></style>

<script>
import TheHeader from './components/TheHeader.vue';
import Calculator from './components/Calculator.vue'
import AisCard from './components/AisCard.vue'
export default {
  components: { Calculator, AisCard, TheHeader },
  data() {
    return {
      message: '', // The data property that v-model will bind to
      SubmitMessage: '',
    }
  },
  methods: {
    submitMessage() {
      this.SubmitMessage = this.message // On submit, set SubmitMessage to the current message
    },

  },
}
</script>
