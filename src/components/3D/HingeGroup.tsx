import React, { useRef } from 'react'
import * as THREE from 'three'

interface HingeGroupProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  hingeAngle: number // Current rotation angle in radians around hinge axis
  axis?: 'x' | 'y' | 'z'
  children: React.ReactNode
}

/**
 * HingeGroup provides a pivot node in the Three.js scene tree.
 * The hinge rotates around the specified axis (default: 'z') by `hingeAngle`.
 */
export default function HingeGroup({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  hingeAngle,
  axis = 'z',
  children,
}: HingeGroupProps): React.ReactElement {
  const groupRef = useRef<THREE.Group>(null)

  return (
    <group position={position} rotation={rotation}>
      <group ref={groupRef} rotation={[
        axis === 'x' ? hingeAngle : 0,
        axis === 'y' ? hingeAngle : 0,
        axis === 'z' ? hingeAngle : 0,
      ]}>
        {children}
      </group>
    </group>
  )
}
