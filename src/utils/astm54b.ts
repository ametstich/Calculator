const K0 = 103.8720
const K1 = 0.2701

export function calculateDensityASTM(density15: number, temp: number): {
  densityTemp: number
  vcf: number
} {
  if (density15 <= 0) return { densityTemp: 0, vcf: 0 }
  const d15 = density15 > 2 ? density15 : density15 * 1000
  const alpha15 = (K0 / (d15 * d15)) + (K1 / d15)
  const deltaT = temp - 15
  const vcf = Math.exp(-alpha15 * deltaT * (1 + 0.8 * alpha15 * deltaT))
  const densityTemp = d15 * vcf

  return {
    densityTemp: densityTemp / 1000,
    vcf: vcf
  }
}
