import React, { useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { Point2D } from '../../types/prism'
import { Html } from '@react-three/drei'

export interface PolygonFaceProps {
  vertices: Point2D[]
  color: string
  wireframe?: boolean
  label?: string
  showLabel?: boolean
  labelPosition?: [number, number, number]
  opacity?: number
}

export default function PolygonFace({
  vertices,
  color,
  wireframe = true,
  label,
  showLabel = false,
  labelPosition,
  opacity = 0.92,
}: PolygonFaceProps): React.ReactElement {
  const { geometry, edgesGeometry } = useMemo(() => {
    const shape = new THREE.Shape()

    if (vertices.length > 0) {
      shape.moveTo(vertices[0].x, vertices[0].z)
      for (let i = 1; i < vertices.length; i++) {
        shape.lineTo(vertices[i].x, vertices[i].z)
      }
      shape.closePath()
    }

    const geom = new THREE.ShapeGeometry(shape)
    // Rotate geometry from XY to XZ plane so it lies horizontally flat by default
    geom.rotateX(Math.PI / 2)

    const edges = new THREE.EdgesGeometry(geom)

    return { geometry: geom, edgesGeometry: edges }
  }, [vertices])

  // Clean up GPU buffer geometries on change and unmount to prevent WebGL memory leaks
  useEffect(() => {
    return () => {
      geometry.dispose()
      edgesGeometry.dispose()
    }
  }, [geometry, edgesGeometry])

  // Calculate face centroid so labels appear centered on any polygon (bases or lateral faces)
  const centroid = useMemo(() => {
    if (vertices.length === 0) return [0, 0.1, 0] as [number, number, number]
    const sumX = vertices.reduce((acc, v) => acc + v.x, 0)
    const sumZ = vertices.reduce((acc, v) => acc + v.z, 0)
    return [sumX / vertices.length, 0.1, sumZ / vertices.length] as [number, number, number]
  }, [vertices])

  const effectiveLabelPosition = labelPosition ?? centroid

  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color={color}
          roughness={0.35}
          metalness={0.15}
          side={THREE.DoubleSide}
          transparent
          opacity={opacity}
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
      </mesh>

      {wireframe && (
        <lineSegments geometry={edgesGeometry}>
          <lineBasicMaterial color="#ffffff" linewidth={2} />
        </lineSegments>
      )}

      {showLabel && label && (
        <Html position={effectiveLabelPosition} center distanceFactor={15}>
          <div className="px-2 py-0.5 text-[10px] font-semibold bg-slate-900/90 text-white rounded border border-slate-700 shadow pointer-events-none whitespace-nowrap">
            {label}
          </div>
        </Html>
      )}
    </group>
  )
}
