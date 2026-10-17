<script setup lang="ts">
import {reactive, ref} from 'vue'
defineProps<{
  msg: string
}>()

const result = ref<number | null>(null)


const initialState = {
  param_1: '',
  param_2: '',
  param_3: '',
}

const state = reactive({
  ...initialState,
})



const change = () => {
  if (state.param_1 !== '' && state.param_2 !== '' && state.param_3 !== '') {
    result.value = Number(state.param_1) + Number(state.param_2) / Number(state.param_3)
  }
}
</script>

<template>
    <v-main class="bg-grey-lighten-4 d-flex align-center flex-column">
        <v-toolbar color="primary">
          <v-toolbar-title class="text-center font-weight-bold tracking-wider">
            Oil Calcs
          </v-toolbar-title>
        </v-toolbar>
        <form class="w-100 px-3">
          <v-text-field v-model="state.param_1" type="number" label="Param 1" @change="change" />
          <v-text-field v-model="state.param_2" type="number" label="Param 2" @change="change" />
          <v-text-field v-model="state.param_3" type="number" label="Param 3" @change="change" />
          <v-input v-if="result">{{result}}% s.v's.</v-input>
        </form>
    </v-main>
</template>

<style scoped>
</style>
