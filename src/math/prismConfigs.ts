import { PrismConfig, PrismType } from '../types/prism'
import { calculateSideLength } from './geometry'
import { calculateEulerCharacteristics } from './kinematics'

function createPrismConfig(
  type: PrismType,
  name: string,
  polygonSides: number,
  baseRadius: number,
  height: number,
  colorBase = '#0284c7',    // Sky blue
  colorLateral = '#f97316'  // Orange
): PrismConfig {
  const euler = calculateEulerCharacteristics(polygonSides)
  const sideLength = calculateSideLength(polygonSides, baseRadius)

  return {
    type,
    name,
    polygonSides,
    baseRadius,
    height,
    sideLength,
    verticesCount: euler.V,
    edgesCount: euler.E,
    facesCount: euler.F,
    colorBase,
    colorLateral,
  }
}

export const PRISM_CONFIGS: Record<PrismType, PrismConfig> = {
  triangular: createPrismConfig(
    'triangular',
    'Graniastosłup trójkątny',
    3,
    2.4,
    3.8,
    '#0ea5e9',
    '#f59e0b'
  ),
  square: createPrismConfig(
    'square',
    'Graniastosłup czworokątny',
    4,
    2.2,
    3.6,
    '#06b6d4',
    '#f97316'
  ),
  pentagonal: createPrismConfig(
    'pentagonal',
    'Graniastosłup pięciokątny',
    5,
    2.1,
    3.5,
    '#14b8a6',
    '#fb923c'
  ),
  hexagonal: createPrismConfig(
    'hexagonal',
    'Graniastosłup sześciokątny',
    6,
    2.0,
    3.4,
    '#0284c7',
    '#ea580c'
  ),
}

export function getPrismConfig(type: PrismType): PrismConfig {
  return PRISM_CONFIGS[type] || PRISM_CONFIGS.square
}
