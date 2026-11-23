import React, { useState } from 'react'
import Header from './components/UI/Header'
import PrismSelector from './components/UI/PrismSelector'
import FoldSlider from './components/UI/FoldSlider'
import ViewSettings from './components/UI/ViewSettings'
import PrismInfo from './components/UI/PrismInfo'
import BottomSheetDrawer from './components/UI/BottomSheetDrawer'
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

  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)

  const currentConfig = getPrismConfig(prismType)

  return (
    <div className="relative w-full h-[100dvh] min-h-[100dvh] flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none safe-pb">
      {/* Top Navigation */}
      <Header
        onResetCamera={resetCamera}
        onOpenDrawer={() => setIsMobileDrawerOpen(true)}
      />

      {/* Main 3D Viewport with Floating Controls Overlay */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        {/* 3D Canvas */}
        <SceneContainer
          config={currentConfig}
          foldProgress={foldProgress}
          viewSettings={viewSettings}
          cameraResetTrigger={cameraResetTrigger}
        />

        {/* Desktop Sidebar Toggle Button */}
        <button
          onClick={() => setIsDesktopSidebarOpen(prev => !prev)}
          aria-label={isDesktopSidebarOpen ? 'Ukryj panel opcji' : 'Pokaż panel opcji'}
          className="hidden lg:flex absolute top-3.5 right-4 z-30 items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 text-indigo-400 hover:text-indigo-300 border border-slate-800 shadow-xl backdrop-blur-md text-xs font-semibold transition-colors"
        >
          {isDesktopSidebarOpen ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
          <span>{isDesktopSidebarOpen ? 'Ukryj opcje' : 'Pokaż opcje'}</span>
        </button>

        {/* Right Floating Sidebar for Desktop (lg and up) */}
        <aside
          className={`hidden lg:flex absolute top-14 right-4 z-20 flex-col gap-3 w-80 max-h-[calc(100%-7.5rem)] overflow-y-auto pr-1 pointer-events-auto transition-all duration-300 ${
            isDesktopSidebarOpen
              ? 'translate-x-0 opacity-100'
              : 'translate-x-[120%] opacity-0 pointer-events-none'
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

        {/* Bottom Floating Folding Controller (Touch-Friendly Dock) */}
        <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-xl px-3 sm:px-4 pointer-events-auto safe-mb">
          <FoldSlider
            foldProgress={foldProgress}
            onFoldProgressChange={setFoldProgress}
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            onFold={fold}
            onUnfold={unfold}
            speed={speed}
            onSpeedChange={setSpeed}
            onOpenDrawer={() => setIsMobileDrawerOpen(true)}
          />
        </div>

        {/* Mobile Bottom Sheet Drawer (< lg) */}
        <div className="lg:hidden">
          <BottomSheetDrawer
            isOpen={isMobileDrawerOpen}
            onClose={() => setIsMobileDrawerOpen(false)}
            prismType={prismType}
            onSelectPrismType={setPrismType}
            currentConfig={currentConfig}
            viewSettings={viewSettings}
            onToggleWireframe={toggleWireframe}
            onToggleColorBases={toggleColorBases}
            onToggleLabels={toggleLabels}
            onToggleResetFoldOnSwitch={toggleResetFoldOnSwitch}
            onResetCamera={resetCamera}
          />
        </div>
      </main>
    </div>
  )
}
