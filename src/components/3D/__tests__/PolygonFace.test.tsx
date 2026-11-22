import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import * as THREE from 'three'
import PolygonFace from '../PolygonFace'

// Mock Three.js R3F components for JSDOM
vi.mock('@react-three/drei', () => ({
  Html: ({ children, position }: { children: React.ReactNode; position?: number[] }) => (
    <div data-testid="mock-html-label" data-position={JSON.stringify(position)}>
      {children}
    </div>
  ),
}))

describe('PolygonFace Component', () => {
  it('disposes of geometries upon unmount to prevent WebGL memory leaks', () => {
    const shapeDisposeSpy = vi.spyOn(THREE.ShapeGeometry.prototype, 'dispose')
    const edgesDisposeSpy = vi.spyOn(THREE.EdgesGeometry.prototype, 'dispose')

    const vertices = [
      { x: 0, z: -1 },
      { x: 2, z: -1 },
      { x: 2, z: 1 },
      { x: 0, z: 1 },
    ]

    const { unmount } = render(
      <PolygonFace
        vertices={vertices}
        color="#0284c7"
        wireframe={true}
      />
    )

    expect(shapeDisposeSpy).not.toHaveBeenCalled()
    expect(edgesDisposeSpy).not.toHaveBeenCalled()

    unmount()

    expect(shapeDisposeSpy).toHaveBeenCalledTimes(1)
    expect(edgesDisposeSpy).toHaveBeenCalledTimes(1)

    shapeDisposeSpy.mockRestore()
    edgesDisposeSpy.mockRestore()
  })

  it('calculates the centroid position for labels on lateral faces', () => {
    // A lateral face extending from x=0 to x=4, with width 2 (z: -1 to 1)
    const vertices = [
      { x: 0, z: -1 },
      { x: 4, z: -1 },
      { x: 4, z: 1 },
      { x: 0, z: 1 },
    ]

    const { getByTestId } = render(
      <PolygonFace
        vertices={vertices}
        color="#f97316"
        label="Ściana boczna 1"
        showLabel={true}
      />
    )

    const labelElem = getByTestId('mock-html-label')
    const pos = JSON.parse(labelElem.getAttribute('data-position') || '[]')

    // Centroid x should be 2.0 (H/2), y should be 0.1, z should be 0.0
    expect(pos[0]).toBeCloseTo(2.0, 5)
    expect(pos[1]).toBeCloseTo(0.1, 5)
    expect(pos[2]).toBeCloseTo(0.0, 5)
  })
})
