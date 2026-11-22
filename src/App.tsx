import React, { useState } from 'react'
import Header from './components/UI/Header'
import PrismSelector from './components/UI/PrismSelector'
import FoldSlider from './components/UI/FoldSlider'
import ViewSettings from './components/UI/ViewSettings'
import PrismInfo from './components/UI/PrismInfo'
import SceneContainer from './components/3D/SceneContainer'
import { usePrismState } from './hooks/usePrismState'
import { getPrismConfig } from './math/prismConfigs'
import { SlidersHorizontal, X } from 'lucide-react'

export default function App(): React.ReactElement {
  const {
    prismType,
    setPrismType,
    foldProgress,
    setFoldProgress,
    isPlaying,
    togglePlay,
    speed,
    setSpeed,
    fold,
    unfold,
    viewSettings,
    toggleWireframe,
    toggleColorBases,
    toggleLabels,
    toggleResetFoldOnSwitch,
    cameraResetTrigger,
    resetCamera,
  } = usePrismState('square')

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const currentConfig = getPrismConfig(prismType)

  return (
    <div className="relative w-screen h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Navigation */}
      <Header />

      {/* Main 3D Viewport with Floating Controls Overlay */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        {/* 3D Canvas */}
        <SceneContainer
          config={currentConfig}
          foldProgress={foldProgress}
          viewSettings={viewSettings}
          cameraResetTrigger={cameraResetTrigger}
        />

        {/* Mobile Toggle Button for Sidebar */}
        <button
          onClick={() => setIsSidebarOpen(prev => !prev)}
          aria-label={isSidebarOpen ? 'Ukryj panel opcji' : 'Pokaż panel opcji'}
          className="md:hidden absolute top-4 right-4 z-30 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 text-indigo-400 border border-slate-800 shadow-xl backdrop-blur-md text-xs font-semibold"
        >
          {isSidebarOpen ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
          <span>{isSidebarOpen ? 'Zamknij' : 'Opcje'}</span>
        </button>

        {/* Right Floating Sidebar */}
        <aside
          className={`absolute top-4 right-4 z-20 flex flex-col gap-3 w-80 max-w-[calc(100vw-2rem)] max-h-[calc(100%-7rem)] md:max-h-[calc(100%-2rem)] overflow-y-auto pr-1 pointer-events-auto transition-all duration-300 ${
            isSidebarOpen
              ? 'translate-x-0 opacity-100'
              : 'translate-x-[120%] opacity-0 pointer-events-none md:translate-x-0 md:opacity-100 md:pointer-events-auto'
          }`}
        >
          <PrismSelector
            activeType={prismType}
            onSelect={setPrismType}
          />

          <PrismInfo config={currentConfig} />

          <ViewSettings
            settings={viewSettings}
            onToggleWireframe={toggleWireframe}
            onToggleColorBases={toggleColorBases}
            onToggleLabels={toggleLabels}
            onToggleResetFoldOnSwitch={toggleResetFoldOnSwitch}
            onResetCamera={resetCamera}
          />
        </aside>

        {/* Bottom Floating Folding Controller */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-xl px-4 pointer-events-auto">
          <FoldSlider
            foldProgress={foldProgress}
            onFoldProgressChange={setFoldProgress}
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            onFold={fold}
            onUnfold={unfold}
            speed={speed}
            onSpeedChange={setSpeed}
          />
        </div>
      </main>
    </div>
  )
}
