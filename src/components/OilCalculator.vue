<template>
  <v-container class="max-width-700">
    <v-card class="pa-6" elevation="4">
      <v-card-title class="text-h5 font-weight-bold text-primary px-0 pb-4">
        Test (ASTM 54B) v0.1b
      </v-card-title>

      <v-card-text class="px-0">
        <v-select
            v-model="selectedTankId"
            :items="tanksData"
            item-title="name"
            item-value="id"
            label="Select tank"
            variant="outlined"
            prepend-inner-icon="mdi-propane-tank"
            class="mb-4"
        />

        <v-row>
          <v-col cols="12" sm="6" class="py-0">
            <v-text-field
                v-model.number="sounding"
                label="Tank measurement (Sounding)"
                type="number"
                variant="outlined"
                suffix="см"
                prepend-inner-inner-icon="mdi-ruler"
                class="mb-2"
            />
          </v-col>

          <v-col cols="12" sm="6" class="py-0">
            <v-text-field
                v-model.number="temperature"
                label="Temperature inside the tank"
                type="number"
                variant="outlined"
                suffix="°C"
                prepend-inner-inner-icon="mdi-thermometer"
                class="mb-2"
            />
          </v-col>
        </v-row>

        <v-text-field
            v-model.number="density15"
            label="Density at 15°C (from BDN / certificate)"
            type="number"
            step="0.0001"
            variant="outlined"
            suffix="г/см³"
            hint="For example: 0.9850 for heavy fuel oil or 0.8450 for MGO"
            persistent-hint
            class="mb-6"
        />

        <v-divider class="mb-6"></v-divider>

        <div class="bg-grey-lighten-4 pa-4 rounded-lg border">
          <div class="text-subtitle-2 text-grey-darken-1 mb-3">MEASUREMENT REPORT:</div>

          <div class="d-flex justify-space-between mb-2">
            <span>Selected tank:</span>
            <span class="font-weight-medium">{{ currentTank?.name || 'Not selected' }}</span>
          </div>

          <div class="d-flex justify-space-between mb-2">
            <span>Volume according to the tank table:</span>
            <span class="font-weight-bold text-blue-darken-3">{{ volume.toFixed(3) }} м³</span>
          </div>

          <div class="d-flex justify-space-between mb-2">
            <span>ASTM 54B Coefficient (VCF):</span>
            <span class="font-weight-medium text-purple-darken-2">{{ astmResult.vcf.toFixed(5) }}</span>
          </div>

          <div class="d-flex justify-space-between mb-2">
            <span>Density at {{ temperature }}°C:</span>
            <span class="font-weight-bold">{{ astmResult.densityTemp.toFixed(4) }} g/sm³</span>
          </div>

          <v-divider class="my-3"></v-divider>

          <div class="d-flex justify-space-between align-center bg-green-lighten-5 pa-3 rounded">
            <span class="text-subtitle-1 font-weight-bold text-green-darken-4">Total fuel mass:</span>
            <span class="text-h5 font-weight-black text-green-darken-4">{{ metricTons.toFixed(3) }} MT</span>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">

import { ref, computed } from 'vue'
import { calculateDensityASTM } from '../utils/astm54b'
import tanksData from '../data/tanks.json'

// Set a safe default value for the tank ID
// If the array is empty, we take an empty string.
const defaultTankId = tanksData?.[0]?.id ?? ''


const selectedTankId = ref<string>(defaultTankId)
const sounding = ref<number | null>(null)
const temperature = ref<number>(15)
const density15 = ref<number>(0.9850)

// We find the currently selected tank object (it may return undefined, hence the type Tank | undefined)
const currentTank = computed(() => {
  return tanksData.find(t => t.id === selectedTankId.value)
})

// --- Volume interpolation based on the calibration table for the selected tank ---
const volume = computed<number>(() => {
  const snd = sounding.value

  // Safe check: if no measurement has been entered, or if the tank cannot be found or has not been selected, return 0.
  if (snd === null || snd < 0 || !currentTank.value || !currentTank.value.table) {
    return 0
  }

  // Creating and sorting a copy of a table
  const table = [...currentTank.value.table].sort((a, b) => a.cm - b.cm)

  // Explicitly retrieve the first and last elements using the .at() method (supported in Vite/modern browsers)
  const firstPoint = table.at(0)
  const lastPoint = table.at(-1)

  // Если по какой-то причине точек в таблице нет — выходим
  if (!firstPoint || !lastPoint) return 0

  // Checking boundary conditions (TS is now certain that firstPoint and lastPoint are defined)
  if (snd <= firstPoint.cm) return firstPoint.m3
  if (snd >= lastPoint.cm) return lastPoint.m3

  // Finding an interval for linear interpolation
  for (let i = 0; i < table.length - 1; i++) {
    const p1 = table[i]
    const p2 = table[i + 1]

    // An additional micro-check for TS, to prevent it from complaining inside the loop
    if (!p1 || !p2) continue

    if (snd >= p1.cm && snd <= p2.cm) {
      return p1.m3 + ((snd - p1.cm) * (p2.m3 - p1.m3)) / (p2.cm - p1.cm)
    }
  }
  return 0
})

// --- Calculation according to ASTM 54B standard ---
const astmResult = computed(() => {
  return calculateDensityASTM(density15.value, temperature.value)
})

// --- Total weight in metric tons ---
const metricTons = computed<number>(() => {
  return volume.value * astmResult.value.densityTemp
})
</script>

<style scoped>
.max-width-700 {
  max-width: 700px;
}
</style>
