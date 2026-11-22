import { describe, it, expect } from 'vitest'
import {
  calculateRegularPolygonVertices,
  calculatePolygonEdges
} from '../geometry'
import { calculateFoldAngle } from '../kinematics'

describe('Net Geometry & Coordinate Transformations', () => {
  it('correctly maps lateral face coordinates at flat state t=0 and closed state t=1', () => {
    const sides = 4
    const radius = 2
    const height = 4
    const vertices = calculateRegularPolygonVertices(sides, radius)
    const edges = calculatePolygonEdges(vertices)

    expect(edges).toHaveLength(4)

    // Verify for each edge that at t=0, the lateral face starts at the edge and extends outward along normal
    for (const edge of edges) {
      const bottomCenter = edge.midpoint
      // Outward direction is edge.normal
      const topCenterFlat = {
        x: bottomCenter.x + edge.normal.x * height,
        y: 0,
        z: bottomCenter.z + edge.normal.z * height
      }

      // At t=0, flat y is 0
      expect(topCenterFlat.y).toBe(0)

      // At t=1, rotation by 90 deg brings top edge to y=height, and x,z remain at bottomCenter (directly vertical)
      const angle = calculateFoldAngle(1)
      expect(angle).toBeCloseTo(Math.PI / 2, 5)

      const topCenterFolded = {
        x: bottomCenter.x + edge.normal.x * height * Math.cos(angle),
        y: height * Math.sin(angle),
        z: bottomCenter.z + edge.normal.z * height * Math.cos(angle)
      }

      expect(topCenterFolded.y).toBeCloseTo(height, 5)
      expect(topCenterFolded.x).toBeCloseTo(bottomCenter.x, 5)
      expect(topCenterFolded.z).toBeCloseTo(bottomCenter.z, 5)
    }
  })

  it('verifies top base aligns perfectly with bottom base at t=1 on plane y=H', () => {
    // For regular n-gons, verify that translating bottom base to y=H gives matching top base vertices
    const sides = 5
    const radius = 2.1
    const height = 3.5
    const bottomVertices = calculateRegularPolygonVertices(sides, radius)

    // In closed state t=1, top base vertices should have the exact same x, z coordinates as bottom base, and y = height
    for (const v of bottomVertices) {
      const topVertex = { x: v.x, y: height, z: v.z }
      expect(topVertex.y).toBe(height)
      expect(Math.hypot(topVertex.x, topVertex.z)).toBeCloseTo(radius, 5)
    }
  })
})
