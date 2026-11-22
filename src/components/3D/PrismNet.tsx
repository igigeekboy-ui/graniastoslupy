import React, { useMemo } from 'react'
import { PrismConfig, ViewSettingsState, Point2D } from '../../types/prism'
import {
  calculateRegularPolygonVertices,
  calculatePolygonEdges,
  calculateApothem,
  calculateTopBaseLocalVertices,
} from '../../math/geometry'
import { calculateFoldAngle } from '../../math/kinematics'
import PolygonFace from './PolygonFace'
import HingeGroup from './HingeGroup'

interface PrismNetProps {
  config: PrismConfig
  foldProgress: number
  viewSettings: ViewSettingsState
}

export default function PrismNet({
  config,
  foldProgress,
  viewSettings,
}: PrismNetProps): React.ReactElement {
  const { vertices, edges, apothem, lateralFaceVertices, topBaseVertices } = useMemo(() => {
    const verts = calculateRegularPolygonVertices(config.polygonSides, config.baseRadius)
    const edgs = calculatePolygonEdges(verts)
    const apo = calculateApothem(config.polygonSides, config.baseRadius)

    const halfA = config.sideLength / 2
    const H = config.height

    // Lateral face rectangle in local 2D space (x along normal, z along edge)
    const latVerts: Point2D[] = [
      { x: 0, z: -halfA },
      { x: H, z: -halfA },
      { x: H, z: halfA },
      { x: 0, z: halfA },
    ]

    const topVerts = calculateTopBaseLocalVertices(verts, edgs[0], H, apo)

    return {
      vertices: verts,
      edges: edgs,
      apothem: apo,
      lateralFaceVertices: latVerts,
      topBaseVertices: topVerts,
    }
  }, [config])

  const foldAngle = calculateFoldAngle(foldProgress)
  const baseColor = viewSettings.colorBases ? config.colorBase : config.colorLateral

  return (
    <group position={[0, -config.height / 3, 0]}>
      {/* 1. Root Bottom Base */}
      <PolygonFace
        vertices={vertices}
        color={baseColor}
        wireframe={viewSettings.wireframe}
        label="Podstawa dolna"
        showLabel={viewSettings.showLabels}
      />

      {/* 2. Lateral Faces & Top Base */}
      {edges.map((edge, index) => {
        const isCarrierForTopBase = index === 0

        return (
          <HingeGroup
            key={`lateral-hinge-${index}`}
            position={[edge.midpoint.x, 0, edge.midpoint.z]}
            rotation={[0, -edge.normalAngle, 0]}
            hingeAngle={foldAngle}
            axis="z"
          >
            {/* Lateral Face Rectangular Polygon */}
            <PolygonFace
              vertices={lateralFaceVertices}
              color={config.colorLateral}
              wireframe={viewSettings.wireframe}
              label={`Ściana boczna ${index + 1}`}
              showLabel={viewSettings.showLabels}
            />

            {/* Top Base mounted to top edge of Face 0 */}
            {isCarrierForTopBase && (
              <HingeGroup
                position={[config.height, 0, 0]}
                hingeAngle={foldAngle}
                axis="z"
              >
                {/* Position top base center at distance apothem */}
                <group position={[apothem, 0, 0]}>
                  <PolygonFace
                    vertices={topBaseVertices}
                    color={baseColor}
                    wireframe={viewSettings.wireframe}
                    label="Podstawa górna"
                    showLabel={viewSettings.showLabels}
                  />
                </group>
              </HingeGroup>
            )}
          </HingeGroup>
        )
      })}
    </group>
  )
}
