/**
 * Clamps a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Calculates folding angle in radians for lateral faces and top base.
 * At t=0 (flat 2D net): angle is 0 rad.
 * At t=1 (fully 3D folded prism): angle is PI / 2 rad (90 degrees).
 */
export function calculateFoldAngle(t: number): number {
  const clampedT = clamp(t, 0, 1)
  return clampedT * (Math.PI / 2)
}

export interface EulerCharacteristics {
  V: number // Vertices: 2n
  E: number // Edges: 3n
  F: number // Faces: n + 2
}

/**
 * Calculates topological characteristics according to Euler's formula: V - E + F = 2.
 */
export function calculateEulerCharacteristics(sides: number): EulerCharacteristics {
  return {
    V: 2 * sides,
    E: 3 * sides,
    F: sides + 2,
  }
}

export interface PrismMetrics {
  baseArea: number
  lateralArea: number
  totalArea: number
  volume: number
}

/**
 * Calculates geometric metrics (areas and volume) for a regular right prism.
 * @param sides Number of polygon sides (n)
 * @param sideLength Length of a base side (a)
 * @param height Height of the prism (H)
 */
export function calculatePrismMetrics(
  sides: number,
  sideLength: number,
  height: number
): PrismMetrics {
  // Area of regular n-gon: (n * a^2) / (4 * tan(PI / n))
  const baseArea = (sides * Math.pow(sideLength, 2)) / (4 * Math.tan(Math.PI / sides))
  const lateralArea = sides * sideLength * height
  const totalArea = 2 * baseArea + lateralArea
  const volume = baseArea * height

  return {
    baseArea,
    lateralArea,
    totalArea,
    volume,
  }
}
