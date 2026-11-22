import { describe, it, expect } from 'vitest'
import {
  calculateFoldAngle,
  calculateEulerCharacteristics,
  calculatePrismMetrics
} from '../kinematics'

describe('Kinematics and Prism Calculations', () => {
  it('calculates folding angles correctly across progress range [0, 1]', () => {
    expect(calculateFoldAngle(0)).toBeCloseTo(0, 5)
    expect(calculateFoldAngle(0.5)).toBeCloseTo(Math.PI / 4, 5)
    expect(calculateFoldAngle(1)).toBeCloseTo(Math.PI / 2, 5)
  })

  it('clamps fold progress between 0 and 1', () => {
    expect(calculateFoldAngle(-0.5)).toBeCloseTo(0, 5)
    expect(calculateFoldAngle(1.5)).toBeCloseTo(Math.PI / 2, 5)
  })

  it('verifies Euler characteristics for all supported prisms (V - E + F = 2)', () => {
    const testCases = [
      { sides: 3, V: 6, E: 9, F: 5 },
      { sides: 4, V: 8, E: 12, F: 6 },
      { sides: 5, V: 10, E: 15, F: 7 },
      { sides: 6, V: 12, E: 18, F: 8 },
    ]

    for (const tc of testCases) {
      const euler = calculateEulerCharacteristics(tc.sides)
      expect(euler.V).toBe(tc.V)
      expect(euler.E).toBe(tc.E)
      expect(euler.F).toBe(tc.F)
      expect(euler.V - euler.E + euler.F).toBe(2)
    }
  })

  it('computes prism metrics (base area, lateral area, total area, volume)', () => {
    // For square prism (sides = 4) with side length = 2, height = 5
    // Base area Pp = 2 * 2 = 4
    // Lateral area Pb = 4 * 2 * 5 = 40
    // Total area Pc = 2 * 4 + 40 = 48
    // Volume V = 4 * 5 = 20
    const metrics = calculatePrismMetrics(4, 2, 5)
    expect(metrics.baseArea).toBeCloseTo(4, 3)
    expect(metrics.lateralArea).toBeCloseTo(40, 3)
    expect(metrics.totalArea).toBeCloseTo(48, 3)
    expect(metrics.volume).toBeCloseTo(20, 3)
  })
})
