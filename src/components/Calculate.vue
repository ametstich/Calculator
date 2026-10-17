<script setup lang="ts">
import {ref} from "vue";

defineProps<{
  msg: string
}>()

const lbs = ref<string | null>(null)
const temp = ref<string | null>(null)

const calculate = () => {
  console.log(lbs.value)
  console.log(temp.value)
}
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <div class="flex gap-3 m3">
      <div>
        <span>Объем</span><input v-model="lbs"/><span>lbs.</span>
      </div>
      <div>
        <span>Температура</span><input v-model="temp"/><span>С</span>
      </div>
    </div>
    <div class="button-container">
      <button class="i-material-symbols:magic-button" name="Calculate" value="Calculate" @click="calculate" >Calculate</button>
    </div>
  </div>
</template>

<style scoped>
.button-container {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}
</style>
