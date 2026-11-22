import { describe, it, expect } from 'vitest'
import * as THREE from 'three'
import {
  calculateRegularPolygonVertices,
  calculatePolygonEdges,
  calculateApothem,
  calculateTopBaseLocalVertices,
} from '../geometry'
import { calculateFoldAngle } from '../kinematics'

describe('3D Hinge Kinematics and Closure Validation', () => {
  it('validates that top base transforms exactly to y=H and matches bottom base at t=1', () => {
    const sides = 4
    const radius = 2
    const height = 3.6
    const r = calculateApothem(sides, radius)
    const vertices = calculateRegularPolygonVertices(sides, radius)
    const edges = calculatePolygonEdges(vertices)

    const edge0 = edges[0]
    const alpha = edge0.normalAngle

    const root = new THREE.Group()

    const face0Hinge = new THREE.Group()
    face0Hinge.position.set(edge0.midpoint.x, 0, edge0.midpoint.z)
    face0Hinge.rotation.y = -alpha
    root.add(face0Hinge)

    const face0Pivot = new THREE.Group()
    face0Hinge.add(face0Pivot)

    const topHinge = new THREE.Group()
    topHinge.position.set(height, 0, 0)
    face0Pivot.add(topHinge)

    const topBasePivot = new THREE.Group()
    topHinge.add(topBasePivot)

    const topBaseMesh = new THREE.Group()
    topBaseMesh.position.set(r, 0, 0)
    topBasePivot.add(topBaseMesh)

    // t=0
    face0Pivot.rotation.z = calculateFoldAngle(0)
    topBasePivot.rotation.z = calculateFoldAngle(0)
    root.updateMatrixWorld(true)

    const posT0 = new THREE.Vector3()
    topBaseMesh.getWorldPosition(posT0)
    expect(posT0.y).toBeCloseTo(0, 5)

    // t=1
    const angle = calculateFoldAngle(1)
    face0Pivot.rotation.z = angle
    topBasePivot.rotation.z = angle
    root.updateMatrixWorld(true)

    const posT1 = new THREE.Vector3()
    topBaseMesh.getWorldPosition(posT1)

    expect(posT1.y).toBeCloseTo(height, 5)
    expect(posT1.x).toBeCloseTo(0, 4)
    expect(posT1.z).toBeCloseTo(0, 4)
  })

  it('computes top base local vertices that match bottom vertices in world space at t=1 for all n', () => {
    for (const sides of [3, 4, 5, 6]) {
      const radius = 2
      const height = 3.5
      const r = calculateApothem(sides, radius)
      const vertices = calculateRegularPolygonVertices(sides, radius)
      const edges = calculatePolygonEdges(vertices)
      const edge0 = edges[0]

      const localVertices = calculateTopBaseLocalVertices(vertices, edge0, height, r)

      // Verify that when placed on topBaseMesh at t=1, world position equals (v.x, height, v.z)
      const root = new THREE.Group()
      const face0Hinge = new THREE.Group()
      face0Hinge.position.set(edge0.midpoint.x, 0, edge0.midpoint.z)
      face0Hinge.rotation.y = -edge0.normalAngle
      root.add(face0Hinge)

      const face0Pivot = new THREE.Group()
      face0Hinge.add(face0Pivot)
      face0Pivot.rotation.z = Math.PI / 2

      const topHinge = new THREE.Group()
      topHinge.position.set(height, 0, 0)
      face0Pivot.add(topHinge)

      const topBasePivot = new THREE.Group()
      topHinge.add(topBasePivot)
      topBasePivot.rotation.z = Math.PI / 2

      const topBaseMesh = new THREE.Group()
      topBaseMesh.position.set(r, 0, 0)
      topBasePivot.add(topBaseMesh)

      for (let i = 0; i < vertices.length; i++) {
        const obj = new THREE.Object3D()
        obj.position.set(localVertices[i].x, 0, localVertices[i].z)
        topBaseMesh.add(obj)

        root.updateMatrixWorld(true)
        const worldPos = new THREE.Vector3()
        obj.getWorldPosition(worldPos)

        expect(worldPos.x).toBeCloseTo(vertices[i].x, 4)
        expect(worldPos.y).toBeCloseTo(height, 4)
        expect(worldPos.z).toBeCloseTo(vertices[i].z, 4)
      }
    }
  })
})
