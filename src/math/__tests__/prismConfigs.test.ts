import { describe, it, expect } from 'vitest'
import { PRISM_CONFIGS, getPrismConfig } from '../prismConfigs'
import { PrismType } from '../../types/prism'

describe('Prism Configurations', () => {
  const prismTypes: PrismType[] = ['triangular', 'square', 'pentagonal', 'hexagonal']

  it('contains configurations for all 4 required prisms', () => {
    for (const type of prismTypes) {
      const config = PRISM_CONFIGS[type]
      expect(config).toBeDefined()
      expect(config.type).toBe(type)
    }
  })

  it('provides correct topology and Euler characteristics for each prism', () => {
    const expectations = {
      triangular: { sides: 3, V: 6, E: 9, F: 5 },
      square: { sides: 4, V: 8, E: 12, F: 6 },
      pentagonal: { sides: 5, V: 10, E: 15, F: 7 },
      hexagonal: { sides: 6, V: 12, E: 18, F: 8 },
    }

    for (const type of prismTypes) {
      const config = PRISM_CONFIGS[type]
      const exp = expectations[type]

      expect(config.polygonSides).toBe(exp.sides)
      expect(config.verticesCount).toBe(exp.V)
      expect(config.edgesCount).toBe(exp.E)
      expect(config.facesCount).toBe(exp.F)
      expect(config.verticesCount - config.edgesCount + config.facesCount).toBe(2)
      expect(config.height).toBeGreaterThan(0)
      expect(config.baseRadius).toBeGreaterThan(0)
      expect(config.sideLength).toBeGreaterThan(0)
    }
  })

  it('retrieves config via getPrismConfig helper', () => {
    const config = getPrismConfig('triangular')
    expect(config.type).toBe('triangular')
    expect(config.polygonSides).toBe(3)
  })

  it('falls back safely for unknown prism type', () => {
    // @ts-expect-error test invalid input fallback
    const config = getPrismConfig('unknown')
    expect(config).toBeDefined()
    expect(config.type).toBe('square')
  })
})
