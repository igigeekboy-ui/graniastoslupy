export type PrismType = 'triangular' | 'square' | 'pentagonal' | 'hexagonal'

export interface PrismConfig {
  type: PrismType
  name: string
  polygonSides: number // n
  baseRadius: number   // R - distance from center to vertices
  height: number       // H - prism height
  sideLength: number   // a - edge of regular n-gon base
  verticesCount: number // V = 2n
  edgesCount: number    // E = 3n
  facesCount: number    // F = n + 2
  colorBase: string
  colorLateral: string
}

export interface Point2D {
  x: number
  z: number
}

export interface EdgeDefinition {
  index: number
  start: Point2D
  end: Point2D
  midpoint: Point2D
  length: number
  normal: Point2D    // 2D unit vector pointing outward from base center
  angle: number     // Angle of edge in radians
  normalAngle: number // Direction of the face outward in radians
}

export interface BaseGeometryData {
  sides: number
  vertices: Point2D[]
  edges: EdgeDefinition[]
}

export interface ViewSettingsState {
  wireframe: boolean
  colorBases: boolean
  showLabels: boolean
  resetFoldOnSwitch: boolean
}
