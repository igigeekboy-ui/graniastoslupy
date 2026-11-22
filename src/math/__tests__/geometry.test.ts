import { describe, it, expect } from 'vitest'
import {
  calculateRegularPolygonVertices,
  calculatePolygonEdges,
  calculateSideLength,
  calculateApothem
} from '../geometry'

describe('Geometry: Regular Polygon Calculations', () => {
  it('calculates regular polygon vertices for triangle, square, pentagon, hexagon', () => {
    const radius = 2
    for (const sides of [3, 4, 5, 6]) {
      const vertices = calculateRegularPolygonVertices(sides, radius)
      expect(vertices).toHaveLength(sides)

      // Verify each vertex is at distance `radius` from (0,0)
      for (const vertex of vertices) {
        const dist = Math.hypot(vertex.x, vertex.z)
        expect(dist).toBeCloseTo(radius, 5)
      }
    }
  })

  it('calculates equal side lengths for regular polygons', () => {
    const radius = 2.5
    for (const sides of [3, 4, 5, 6]) {
      const vertices = calculateRegularPolygonVertices(sides, radius)
      const expectedSideLength = calculateSideLength(sides, radius)

      for (let i = 0; i < sides; i++) {
        const current = vertices[i]
        const next = vertices[(i + 1) % sides]
        const dist = Math.hypot(next.x - current.x, next.z - current.z)
        expect(dist).toBeCloseTo(expectedSideLength, 4)
      }
    }
  })

  it('computes polygon edges with outward pointing normals and accurate midpoints', () => {
    const sides = 4
    const radius = 2
    const vertices = calculateRegularPolygonVertices(sides, radius)
    const edges = calculatePolygonEdges(vertices)

    expect(edges).toHaveLength(4)

    for (const edge of edges) {
      // Check midpoint
      expect(edge.midpoint.x).toBeCloseTo((edge.start.x + edge.end.x) / 2, 5)
      expect(edge.midpoint.z).toBeCloseTo((edge.start.z + edge.end.z) / 2, 5)

      // Normal length should be 1
      const normLen = Math.hypot(edge.normal.x, edge.normal.z)
      expect(normLen).toBeCloseTo(1, 5)

      // Normal should point outward from origin (dot product with midpoint > 0)
      const dot = edge.midpoint.x * edge.normal.x + edge.midpoint.z * edge.normal.z
      expect(dot).toBeGreaterThan(0)

      // Normal should be perpendicular to edge vector
      const edgeVec = { x: edge.end.x - edge.start.x, z: edge.end.z - edge.start.z }
      const dotEdge = edgeVec.x * edge.normal.x + edgeVec.z * edge.normal.z
      expect(dotEdge).toBeCloseTo(0, 5)
    }
  })

  it('calculates apothem (inradius) correctly', () => {
    const radius = 2
    // Square: R = 2, apothem = R * cos(pi/4) = 2 * sqrt(2)/2 = sqrt(2) ≈ 1.4142
    const apothemSquare = calculateApothem(4, radius)
    expect(apothemSquare).toBeCloseTo(Math.SQRT2, 5)

    // Hexagon: R = 2, apothem = 2 * cos(pi/6) = 2 * sqrt(3)/2 = sqrt(3) ≈ 1.73205
    const apothemHex = calculateApothem(6, radius)
    expect(apothemHex).toBeCloseTo(Math.sqrt(3), 5)
  })
})
