import * as THREE from 'three'
import { Point2D, EdgeDefinition } from '../types/prism'

/**
 * Calculates vertices of a regular polygon with n sides and given circumradius R.
 * The polygon is centered at (0, 0) on the XZ plane.
 * We rotate by -PI/2 + PI/n so that the top edge or vertices are symmetrically aligned.
 */
export function calculateRegularPolygonVertices(sides: number, radius: number): Point2D[] {
  const vertices: Point2D[] = []
  // Offset to make the shape symmetrical relative to axes
  const angleOffset = -Math.PI / 2 + Math.PI / sides

  for (let i = 0; i < sides; i++) {
    const angle = (2 * Math.PI * i) / sides + angleOffset
    vertices.push({
      x: radius * Math.cos(angle),
      z: radius * Math.sin(angle),
    })
  }

  return vertices
}

/**
 * Calculates the side length of a regular polygon given number of sides and circumradius.
 * a = 2 * R * sin(pi / n)
 */
export function calculateSideLength(sides: number, radius: number): number {
  return 2 * radius * Math.sin(Math.PI / sides)
}

/**
 * Calculates the apothem (inradius) of a regular polygon.
 * r = R * cos(pi / n)
 */
export function calculateApothem(sides: number, radius: number): number {
  return radius * Math.cos(Math.PI / sides)
}

/**
 * Generates edge definitions including midpoints, normals, and orientation angles.
 */
export function calculatePolygonEdges(vertices: Point2D[]): EdgeDefinition[] {
  const edges: EdgeDefinition[] = []
  const n = vertices.length

  for (let i = 0; i < n; i++) {
    const start = vertices[i]
    const end = vertices[(i + 1) % n]

    const midX = (start.x + end.x) / 2
    const midZ = (start.z + end.z) / 2
    const midpoint: Point2D = { x: midX, z: midZ }

    const edgeDx = end.x - start.x
    const edgeDz = end.z - start.z
    const length = Math.hypot(edgeDx, edgeDz)
    const angle = Math.atan2(edgeDz, edgeDx)

    // Outward normal: points from center (0, 0) through midpoint
    const midLen = Math.hypot(midX, midZ)
    const normal: Point2D = midLen > 0.000001
      ? { x: midX / midLen, z: midZ / midLen }
      : { x: 0, z: 1 }

    const normalAngle = Math.atan2(normal.z, normal.x)

    edges.push({
      index: i,
      start,
      end,
      midpoint,
      length,
      normal,
      angle,
      normalAngle,
    })
  }

  return edges
}

/**
 * Transforms bottom base vertices into the local coordinate system of the top base mesh
 * such that in the folded state (t=1), the top base vertices align with the bottom base vertices.
 */
export function calculateTopBaseLocalVertices(
  vertices: Point2D[],
  edge0: EdgeDefinition,
  height: number,
  apothem: number
): Point2D[] {
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
  topBaseMesh.position.set(apothem, 0, 0)
  topBasePivot.add(topBaseMesh)

  root.updateMatrixWorld(true)

  const invMatrix = topBaseMesh.matrixWorld.clone().invert()

  return vertices.map(v => {
    const worldTarget = new THREE.Vector3(v.x, height, v.z)
    const local = worldTarget.applyMatrix4(invMatrix)
    return { x: local.x, z: local.z }
  })
}
