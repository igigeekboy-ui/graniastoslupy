import React, { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { PrismConfig, ViewSettingsState } from '../../types/prism'
import PrismNet from './PrismNet'

interface SceneContainerProps {
  config: PrismConfig
  foldProgress: number
  viewSettings: ViewSettingsState
  cameraResetTrigger: number
}

function CameraController({ resetTrigger }: { resetTrigger: number }) {
  const controlsRef = useRef<OrbitControlsImpl>(null)

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }, [resetTrigger])

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.05}
      minDistance={3}
      maxDistance={30}
      target={[0, 0, 0]}
    />
  )
}

export default function SceneContainer({
  config,
  foldProgress,
  viewSettings,
  cameraResetTrigger,
}: SceneContainerProps): React.ReactElement {
  return (
    <div className="w-full h-full relative outline-none select-none">
      <Canvas
        camera={{ position: [7, 7, 8], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        className="w-full h-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
      >
        {/* Lighting setup */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 15, 10]} intensity={1.2} />
        <directionalLight position={[-10, 10, -10]} intensity={0.4} />
        <pointLight position={[0, -5, 0]} intensity={0.3} />

        {/* Orbit Controls with reset listener */}
        <CameraController resetTrigger={cameraResetTrigger} />

        {/* Dynamic Prism Net Model */}
        <PrismNet
          config={config}
          foldProgress={foldProgress}
          viewSettings={viewSettings}
        />

        {/* Subtle ground orientation grid */}
        <Grid
          position={[0, -config.height / 3 - 0.05, 0]}
          args={[30, 30]}
          cellSize={1}
          cellThickness={0.6}
          cellColor="#334155"
          sectionSize={5}
          sectionThickness={1.2}
          sectionColor="#475569"
          fadeDistance={25}
          fadeStrength={1.5}
        />
      </Canvas>
    </div>
  )
}
